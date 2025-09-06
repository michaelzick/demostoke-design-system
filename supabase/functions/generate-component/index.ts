import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { componentName, prompt, userId } = await req.json();

    if (!componentName || !prompt) {
      throw new Error('Component name and prompt are required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Generate component with OpenAI
    const systemPrompt = `You are an expert React developer creating reusable components for a design system. 
    
Generate a complete React component based on the user's description. The component should:
- Use TypeScript
- Follow React best practices
- Use Tailwind CSS for styling with semantic tokens
- Include proper TypeScript interfaces for props
- Be accessible and responsive
- Include JSDoc comments
- Use design system patterns

Return ONLY a JSON object with this exact structure:
{
  "component_code": "// Complete React component code here",
  "props_schema": {
    "variant": { "type": "string", "options": ["primary", "secondary"], "default": "primary" },
    "size": { "type": "string", "options": ["sm", "md", "lg"], "default": "md" },
    "children": { "type": "ReactNode", "required": true }
  },
  "description": "Brief description of what this component does",
  "category": "buttons|forms|layout|navigation|feedback|display|media",
  "tags": ["tag1", "tag2"]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Create a React component named "${componentName}". ${prompt}` }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    // Parse the JSON response from OpenAI
    let componentData;
    try {
      componentData = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', generatedContent);
      throw new Error('Failed to parse generated component data');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Save component to database
    const { data: savedComponent, error: dbError } = await supabase
      .from('design_system_components')
      .insert({
        name: componentName,
        description: componentData.description,
        category: componentData.category,
        component_code: componentData.component_code,
        props_schema: componentData.props_schema,
        tags: componentData.tags || [],
        created_by: userId,
        status: 'draft',
        is_public: false,
        version: '1.0.0'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error(`Failed to save component: ${dbError.message}`);
    }

    console.log('Component generated and saved successfully:', componentName);

    return new Response(
      JSON.stringify({
        success: true,
        component: savedComponent,
        generatedData: componentData
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-component function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});