import { useQuery } from '@tanstack/react-query';
import { componentService } from '@/services/componentService';
import { DesignSystemComponent } from '@/types/component';

export interface RecentComponent {
  name: string;
  variant: string;
  lastModified: string;
  status: string;
}

export function useRecentComponents(limit = 4) {
  return useQuery({
    queryKey: ['recent-components', limit],
    queryFn: async (): Promise<RecentComponent[]> => {
      if (!componentService.isConnected()) {
        return [];
      }

      const components = await componentService.getUserComponents();
      
      // Sort by updated_at descending and take the most recent
      const recent = components
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, limit);

      // Transform to match dashboard format
      return recent.map((component: DesignSystemComponent) => ({
        name: component.name,
        variant: component.category || 'Default',
        lastModified: formatLastModified(component.updated_at),
        status: component.status === 'published' ? 'Published' : 
                component.status === 'deprecated' ? 'Deprecated' : 'Draft'
      }));
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: componentService.isConnected(),
  });
}

function formatLastModified(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);

  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
}