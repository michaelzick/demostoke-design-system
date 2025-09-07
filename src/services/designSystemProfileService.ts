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
      console.error('No authenticated user found');
      return false;
    }

    // Use UPSERT to handle both insert and update cases
    const { data, error } = await supabase
      .from('design_system_profiles')
      .upsert({
        user_id: user.id,
        ...updates
      }, {
        onConflict: 'user_id'
      })
      .select();

    if (error) {
      console.error('Error upserting design system profile:', error);
      return false;
    }

    if (!data || data.length === 0) {
      console.error('No data returned from upsert operation');
      return false;
    }

    console.log('Profile updated successfully:', data[0]);
    return true;
  },

  async createProfile(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return false;
    }

    const { data, error } = await supabase
      .from('design_system_profiles')
      .insert({
        user_id: user.id,
        display_name: user.user_metadata?.name || user.email,
        avatar_url: `https://api.dicebear.com/6.x/avataaars/svg?seed=${user.id}`
      })
      .select();

    if (error) {
      console.error('Error creating design system profile:', error);
      return false;
    }

    console.log('Profile created successfully:', data[0]);
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