import { supabase } from '@/integrations/supabase/client';

interface DesignSystemTokens {
  id?: string;
  user_id?: string;
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
  created_at?: string;
  updated_at?: string;
}

export const designSystemTokensService = {
  async getCurrentTokens(): Promise<DesignSystemTokens | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('design_system_tokens')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching design system tokens:', error);
      return null;
    }

    return data;
  },

  async updateTokens(updates: Partial<Omit<DesignSystemTokens, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return false;
    }

    // Use UPSERT to handle both insert and update cases
    const { data, error } = await supabase
      .from('design_system_tokens')
      .upsert({
        user_id: user.id,
        ...updates
      }, {
        onConflict: 'user_id'
      })
      .select();

    if (error) {
      console.error('Error upserting design system tokens:', error);
      return false;
    }

    if (!data || data.length === 0) {
      console.error('No data returned from upsert operation');
      return false;
    }

    console.log('Tokens updated successfully:', data[0]);
    return true;
  },

  async createDefaultTokens(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return false;
    }

    const { data, error } = await supabase
      .from('design_system_tokens')
      .insert({
        user_id: user.id,
        // All default values are set in the database schema
      })
      .select();

    if (error) {
      console.error('Error creating design system tokens:', error);
      return false;
    }

    console.log('Tokens created successfully:', data[0]);
    return true;
  },

  isConnected(): boolean {
    return !!supabase;
  }
};

export type { DesignSystemTokens };