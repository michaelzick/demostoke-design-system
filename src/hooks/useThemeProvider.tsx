import { useEffect } from 'react';
import { designSystemSettingsService } from '@/services/designSystemSettingsService';

export const useThemeProvider = () => {
  useEffect(() => {
    const applyDesignSystemSettings = async () => {
      try {
        const settings = await designSystemSettingsService.getCurrentSettings();
        if (!settings) return;

        const root = document.documentElement;

        // Convert hex colors to HSL
        const hexToHsl = (hex: string) => {
          if (!hex || !hex.startsWith('#')) return hex;
          
          const r = parseInt(hex.slice(1, 3), 16) / 255;
          const g = parseInt(hex.slice(3, 5), 16) / 255;
          const b = parseInt(hex.slice(5, 7), 16) / 255;

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          let h = 0, s = 0, l = (max + min) / 2;

          if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
              case r: h = (g - b) / d + (g < b ? 6 : 0); break;
              case g: h = (b - r) / d + 2; break;
              case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
          }

          return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
        };

        // Apply all color tokens
        const colorMappings = [
          // Light mode colors
          { setting: 'primary_color', variable: '--primary' },
          { setting: 'secondary_color', variable: '--secondary' },
          { setting: 'accent_color', variable: '--accent' },
          { setting: 'success_color', variable: '--success' },
          { setting: 'destructive_color', variable: '--destructive' },
          { setting: 'warning_color', variable: '--warning' },
          { setting: 'background_color', variable: '--background' },
          { setting: 'foreground_color', variable: '--foreground' },
          { setting: 'muted_color', variable: '--muted' },
          { setting: 'border_color', variable: '--border' },
          { setting: 'ring_color', variable: '--ring' },
          
          // Dark mode colors
          { setting: 'primary_color_dark', variable: '--primary-dark' },
          { setting: 'secondary_color_dark', variable: '--secondary-dark' },
          { setting: 'accent_color_dark', variable: '--accent-dark' },
          { setting: 'success_color_dark', variable: '--success-dark' },
          { setting: 'destructive_color_dark', variable: '--destructive-dark' },
          { setting: 'warning_color_dark', variable: '--warning-dark' },
          { setting: 'background_color_dark', variable: '--background-dark' },
          { setting: 'foreground_color_dark', variable: '--foreground-dark' },
          { setting: 'muted_color_dark', variable: '--muted-dark' },
          { setting: 'border_color_dark', variable: '--border-dark' },
          { setting: 'ring_color_dark', variable: '--ring-dark' },
          
          // Sidebar colors
          { setting: 'sidebar_background', variable: '--sidebar-background' },
          { setting: 'sidebar_foreground', variable: '--sidebar-foreground' },
          { setting: 'sidebar_primary', variable: '--sidebar-primary' },
          { setting: 'sidebar_primary_foreground', variable: '--sidebar-primary-foreground' },
          { setting: 'sidebar_accent', variable: '--sidebar-accent' },
          { setting: 'sidebar_accent_foreground', variable: '--sidebar-accent-foreground' },
          { setting: 'sidebar_border', variable: '--sidebar-border' },
          { setting: 'sidebar_ring', variable: '--sidebar-ring' },
          
          // Dark sidebar colors
          { setting: 'sidebar_background_dark', variable: '--sidebar-background-dark' },
          { setting: 'sidebar_foreground_dark', variable: '--sidebar-foreground-dark' },
          { setting: 'sidebar_primary_dark', variable: '--sidebar-primary-dark' },
          { setting: 'sidebar_primary_foreground_dark', variable: '--sidebar-primary-foreground-dark' },
          { setting: 'sidebar_accent_dark', variable: '--sidebar-accent-dark' },
          { setting: 'sidebar_accent_foreground_dark', variable: '--sidebar-accent-foreground-dark' },
          { setting: 'sidebar_border_dark', variable: '--sidebar-border-dark' },
          { setting: 'sidebar_ring_dark', variable: '--sidebar-ring-dark' }
        ];

        colorMappings.forEach(({ setting, variable }) => {
          if (settings[setting]) {
            const hsl = hexToHsl(settings[setting]);
            root.style.setProperty(variable, hsl);
          }
        });

        // Apply typography tokens
        const typographyMappings = [
          { setting: 'font_display_lg', variable: '--font-size-display-lg' },
          { setting: 'font_display_md', variable: '--font-size-display-md' },
          { setting: 'font_display_sm', variable: '--font-size-display-sm' },
          { setting: 'font_heading_lg', variable: '--font-size-heading-lg' },
          { setting: 'font_heading_md', variable: '--font-size-heading-md' },
          { setting: 'font_heading_sm', variable: '--font-size-heading-sm' },
          { setting: 'font_body_lg', variable: '--font-size-body-lg' },
          { setting: 'font_body_md', variable: '--font-size-body-md' },
          { setting: 'font_body_sm', variable: '--font-size-body-sm' },
          { setting: 'font_caption', variable: '--font-size-caption' }
        ];

        typographyMappings.forEach(({ setting, variable }) => {
          if (settings[setting]) {
            root.style.setProperty(variable, settings[setting]);
          }
        });

        // Apply spacing tokens
        const spacingMappings = [
          { setting: 'spacing_xs', variable: '--spacing-xs' },
          { setting: 'spacing_sm', variable: '--spacing-sm' },
          { setting: 'spacing_md', variable: '--spacing-md' },
          { setting: 'spacing_lg', variable: '--spacing-lg' },
          { setting: 'spacing_xl', variable: '--spacing-xl' },
          { setting: 'spacing_2xl', variable: '--spacing-2xl' },
          { setting: 'spacing_3xl', variable: '--spacing-3xl' },
          { setting: 'spacing_4xl', variable: '--spacing-4xl' }
        ];

        spacingMappings.forEach(({ setting, variable }) => {
          if (settings[setting]) {
            root.style.setProperty(variable, settings[setting]);
          }
        });

        // Apply font family
        if (settings.font_family) {
          const fontMap: Record<string, string> = {
            'inter': 'Inter, system-ui, sans-serif',
            'tahoma': 'Tahoma, Arial, sans-serif',
            'jetbrains-mono': 'JetBrains Mono, monospace'
          };
          
          const fontFamily = fontMap[settings.font_family] || fontMap.inter;
          root.style.setProperty('--font-sans', fontFamily);
          root.style.setProperty('--font-family', fontFamily);
        }

        // Apply base font size
        if (settings.base_font_size) {
          root.style.setProperty('--font-size-body-md', `${settings.base_font_size}px`);
          root.style.setProperty('--font-size-base', `${settings.base_font_size}px`);
        }

      } catch (error) {
        console.error('Error applying design system settings:', error);
      }
    };

    applyDesignSystemSettings();

    // Listen for settings changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'design-system-settings-updated') {
        applyDesignSystemSettings();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
};