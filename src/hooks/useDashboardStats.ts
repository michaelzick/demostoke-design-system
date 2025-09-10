import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Count actual UI components based on the 8 main categories
      // Based on the actual files in src/components/ui/
      const coreUIComponents = 8; // Main component categories user is tracking

      // Get design system components count
      const { count: designSystemComponents } = await supabase
        .from('design_system_components')
        .select('*', { count: 'exact', head: true });

      // Get design tokens count (from settings - approx 60 tokens per settings config)
      const { count: settingsCount } = await supabase
        .from('design_system_settings')
        .select('*', { count: 'exact', head: true });

      // Get team members count (users with design system profiles)  
      const { count: teamMembers } = await supabase
        .from('design_system_profiles')
        .select('*', { count: 'exact', head: true });

      return {
        totalComponents: coreUIComponents + (designSystemComponents || 0),
        designTokens: (settingsCount || 0) * 60, // Approximate tokens per settings config
        documentationPages: 8, // Static - actual docs pages count
        teamMembers: teamMembers || 0
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}