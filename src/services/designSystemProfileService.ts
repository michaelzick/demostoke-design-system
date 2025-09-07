import { supabase } from '@/integrations/supabase/client';

export interface DesignSystemProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  company: string | null;
  website_url: string | null;
  github_url: string | null;
  dribbble_url: string | null;
  created_at: string;
  updated_at: string;
}

export const designSystemProfileService = {
  async getCurrentProfile(): Promise<DesignSystemProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('design_system_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching design system profile:', error);
      return null;
    }

    return data;
  },

  async updateProfile(updates: Partial<Omit<DesignSystemProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    const { error } = await supabase
      .from('design_system_profiles')
      .update(updates)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating design system profile:', error);
      return false;
    }

    return true;
  },

  async getProfileByUserId(userId: string): Promise<DesignSystemProfile | null> {
    const { data, error } = await supabase
      .from('design_system_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching design system profile by user ID:', error);
      return null;
    }

    return data;
  },

  isConnected(): boolean {
    return !!supabase;
  }
};