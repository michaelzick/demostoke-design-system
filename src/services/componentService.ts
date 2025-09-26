import { supabase } from "@/integrations/supabase/client";
import { DesignSystemComponent, GenerateComponentRequest, GenerateComponentResponse, ComponentPropsSchema } from "@/types/component";
import type { Database } from "@/integrations/supabase/types";

export const componentService = {
  // Generate a new component using AI
  async generateComponent(request: GenerateComponentRequest): Promise<GenerateComponentResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-component', {
        body: request
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate component');
      }

      return data;
    } catch (error) {
      console.error('Error generating component:', error);
      
      // Extract more specific error information
      let errorMessage = 'Failed to generate component';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Get all components for the current user
  async getUserComponents(): Promise<DesignSystemComponent[]> {
    try {
      const { data, error } = await supabase
        .from('design_system_components')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return (data || []).map(item => ({
        ...item,
        props_schema: item.props_schema as ComponentPropsSchema,
        stories: item.stories as any[],
        status: item.status as 'draft' | 'published' | 'deprecated'
      }));
    } catch (error) {
      console.error('Error fetching components:', error);
      return [];
    }
  },

  // Get public components
  async getPublicComponents(): Promise<DesignSystemComponent[]> {
    try {
      const { data, error } = await supabase
        .from('design_system_components')
        .select('*')
        .eq('is_public', true)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return (data || []).map(item => ({
        ...item,
        props_schema: item.props_schema as ComponentPropsSchema,
        stories: item.stories as any[],
        status: item.status as 'draft' | 'published' | 'deprecated'
      }));
    } catch (error) {
      console.error('Error fetching public components:', error);
      return [];
    }
  },

  // Get component by ID
  async getComponent(id: string): Promise<DesignSystemComponent | null> {
    try {
      const { data, error } = await supabase
        .from('design_system_components')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data ? {
        ...data,
        props_schema: data.props_schema as ComponentPropsSchema,
        stories: data.stories as any[],
        status: data.status as 'draft' | 'published' | 'deprecated'
      } : null;
    } catch (error) {
      console.error('Error fetching component:', error);
      return null;
    }
  },

  // Update component
  async updateComponent(id: string, updates: Partial<DesignSystemComponent>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('design_system_components')
        .update(updates)
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      return true;
    } catch (error) {
      console.error('Error updating component:', error);
      return false;
    }
  },

  // Delete component
  async deleteComponent(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('design_system_components')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      return true;
    } catch (error) {
      console.error('Error deleting component:', error);
      return false;
    }
  },

  // Check if user is authenticated
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Check if Supabase is connected
  isConnected(): boolean {
    try {
      return !!supabase && typeof supabase.from === 'function';
    } catch {
      return false;
    }
  }
};