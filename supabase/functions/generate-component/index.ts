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
    const systemPrompt = `You are an expert React developer creating reusable components for a design system using Radix UI, Lucide icons, and Tailwind CSS.

CRITICAL: Return ONLY valid JSON without any markdown formatting, code blocks, or additional text.

Generate a complete React component based on the user's description. The component should:
- Use TypeScript with proper interfaces
- Use Tailwind CSS with semantic tokens (hsl colors from CSS variables)
- Import from available libraries: @radix-ui/react-*, lucide-react, @/components/ui/*
- Include JSDoc comments
- Be accessible and responsive
- Follow React best practices

Available UI components: Button, Card, Input, Label, Select, Checkbox, Switch, Avatar, Badge, Alert, Dialog, Dropdown, Tooltip, etc.

Return this exact JSON structure:
{
  "component_code": "import React from 'react';\nimport { Button } from '@/components/ui/button';\n\n// Component code here",
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
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Create a React component named "${componentName}". ${prompt}` }
        ],
        max_tokens: 2000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    // Parse the JSON response from OpenAI (handle markdown-wrapped JSON)
    let componentData;
    try {
      let jsonContent = generatedContent.trim();
      
      // Strip markdown code blocks if present
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonContent.startsWith('```')) {
        jsonContent = jsonContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      componentData = JSON.parse(jsonContent);
      
      // Validate required fields
      if (!componentData.component_code || !componentData.description || !componentData.category) {
        throw new Error('Missing required fields in generated component data');
      }
      
    } catch (parseError: any) {
      console.error('Failed to parse OpenAI response:', generatedContent);
      console.error('Parse error:', parseError.message);
      throw new Error(`Failed to parse generated component data: ${parseError.message}`);
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
      console.error('Component data being saved:', {
        name: componentName,
        description: componentData.description,
        category: componentData.category,
        created_by: userId
      });
      throw new Error(`Database error: ${dbError.message || 'Unknown database error'}`);
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

  } catch (error: any) {
    console.error('Error in generate-component function:', error);
    
    // Determine appropriate error status and message
    let status = 500;
    let errorMessage = error.message || 'Unknown error occurred';
    
    if (error.message?.includes('OpenAI API error')) {
      status = 502;
      errorMessage = 'AI service temporarily unavailable';
    } else if (error.message?.includes('parse')) {
      status = 422;
      errorMessage = 'Failed to process AI response';
    } else if (error.message?.includes('Database error')) {
      status = 500;
      errorMessage = 'Failed to save component';
    }
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        details: error.message
      }),
      {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});