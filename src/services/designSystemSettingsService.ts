import { supabase } from '@/integrations/supabase/client';
import {
  designSystemDefaults,
  designTokenSettingKeys,
  legacyDesignTokenValues,
} from '@/lib/designTokens';

interface DesignSystemSettings {
  id?: string;
  user_id?: string;
  project_name?: string;
  project_description?: string;
  project_version?: string;
  default_theme?: string;
  // Light mode colors
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  success_color?: string;
  destructive_color?: string;
  warning_color?: string;
  background_color?: string;
  foreground_color?: string;
  muted_color?: string;
  border_color?: string;
  ring_color?: string;
  // Dark mode colors
  primary_color_dark?: string;
  secondary_color_dark?: string;
  accent_color_dark?: string;
  success_color_dark?: string;
  destructive_color_dark?: string;
  warning_color_dark?: string;
  background_color_dark?: string;
  foreground_color_dark?: string;
  muted_color_dark?: string;
  border_color_dark?: string;
  ring_color_dark?: string;
  // Sidebar colors
  sidebar_background?: string;
  sidebar_foreground?: string;
  sidebar_primary?: string;
  sidebar_primary_foreground?: string;
  sidebar_accent?: string;
  sidebar_accent_foreground?: string;
  sidebar_border?: string;
  sidebar_ring?: string;
  // Dark mode sidebar colors
  sidebar_background_dark?: string;
  sidebar_foreground_dark?: string;
  sidebar_primary_dark?: string;
  sidebar_primary_foreground_dark?: string;
  sidebar_accent_dark?: string;
  sidebar_accent_foreground_dark?: string;
  sidebar_border_dark?: string;
  sidebar_ring_dark?: string;
  // Typography
  font_family?: string;
  base_font_size?: string;
  font_display_lg?: string;
  font_display_md?: string;
  font_display_sm?: string;
  font_heading_lg?: string;
  font_heading_md?: string;
  font_heading_sm?: string;
  font_body_lg?: string;
  font_body_md?: string;
  font_body_sm?: string;
  font_caption?: string;
  // Spacing
  spacing_xs?: string;
  spacing_sm?: string;
  spacing_md?: string;
  spacing_lg?: string;
  spacing_xl?: string;
  spacing_2xl?: string;
  spacing_3xl?: string;
  spacing_4xl?: string;
  // Other settings
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

    return this.ensureLatestDesignTokens(data);
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

  async ensureLatestDesignTokens(settings: DesignSystemSettings): Promise<DesignSystemSettings> {
    const updates: Partial<DesignSystemSettings> = {};

    const normalize = (value: unknown): string | null => {
      if (value === null || value === undefined) return null;
      if (typeof value !== 'string') return null;
      return value.trim().toLowerCase();
    };

    designTokenSettingKeys.forEach((key) => {
      const defaultValue = designSystemDefaults[key];
      const defaultNormalized = normalize(defaultValue);
      const currentValue = settings[key as keyof DesignSystemSettings];
      const currentNormalized = normalize(currentValue);

      if (currentNormalized === defaultNormalized) {
        return;
      }

      const legacyValues = legacyDesignTokenValues[key]?.map(normalize).filter((value): value is string => Boolean(value));

      if (currentNormalized === null || currentNormalized === '' || (legacyValues && legacyValues.includes(currentNormalized))) {
        (updates as any)[key] = defaultValue;
      }
    });

    if (Object.keys(updates).length === 0) {
      return settings;
    }

    const success = await this.updateSettings(updates);

    if (!success) {
      console.warn('Failed to persist canonical design token defaults', updates);
    }

    return { ...settings, ...updates };
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
        default_theme: 'light',
        auto_publish: true,
        notifications: true,
        public_components: false,
        code_generation: 'typescript',
        storybook_port: '6006',
        font_family: 'inter',
        base_font_size: '16',
        ...designSystemDefaults,
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
