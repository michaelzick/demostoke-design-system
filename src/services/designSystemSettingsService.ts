import { supabase } from '@/integrations/supabase/client';

interface DesignSystemSettings {
  id?: string;
  user_id?: string;
  project_name?: string;
  project_description?: string;
  project_version?: string;
  auto_publish?: boolean;
  notifications?: boolean;
  public_components?: boolean;
  code_generation?: string;
  storybook_port?: string;
  build_command?: string;
  test_command?: string;
  created_at?: string;
  updated_at?: string;
}

export const designSystemSettingsService = {
  async getCurrentSettings(): Promise<DesignSystemSettings | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('design_system_settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching design system settings:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    return data;
  },

  async updateSettings(updates: Partial<Omit<DesignSystemSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return false;
    }

    // Use UPSERT to handle both insert and update cases
    const { data, error } = await supabase
      .from('design_system_settings')
      .upsert({
        user_id: user.id,
        ...updates
      }, {
        onConflict: 'user_id'
      })
      .select();

    if (error) {
      console.error('Error upserting design system settings:', error);
      return false;
    }

    if (!data || data.length === 0) {
      console.error('No data returned from upsert operation');
      return false;
    }

    console.log('Settings updated successfully:', data[0]);
    return true;
  },


  async createDefaultSettings(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return false;
    }

    const { data, error } = await supabase
      .from('design_system_settings')
      .insert({
        user_id: user.id,
        project_name: 'DemoStoke Design System',
        project_version: '1.0.0',
        auto_publish: true,
        notifications: true,
        public_components: false,
        code_generation: 'typescript',
        storybook_port: '6006',
      })
      .select();

    if (error) {
      console.error('Error creating design system settings:', error);
      return false;
    }

    console.log('Settings created successfully:', data[0]);
    return true;
  },

  isConnected(): boolean {
    return !!supabase;
  }
};

export type { DesignSystemSettings };
