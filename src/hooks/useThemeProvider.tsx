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

        // Apply color settings
        if (settings.primary_color) {
          root.style.setProperty('--primary', hexToHsl(settings.primary_color));
        }
        if (settings.secondary_color) {
          root.style.setProperty('--secondary', hexToHsl(settings.secondary_color));
        }
        if (settings.accent_color) {
          root.style.setProperty('--accent', hexToHsl(settings.accent_color));
        }
        if (settings.success_color) {
          root.style.setProperty('--success', hexToHsl(settings.success_color));
        }

        // Apply font settings
        if (settings.font_family) {
          const fontMap: Record<string, string> = {
            'inter': 'Inter, system-ui, sans-serif',
            'tahoma': 'Tahoma, Arial, sans-serif',
            'roboto': 'Roboto, system-ui, sans-serif',
            'system': 'system-ui, sans-serif'
          };
          
          const fontFamily = fontMap[settings.font_family] || fontMap.inter;
          root.style.setProperty('--font-sans', fontFamily);
        }

        // Apply font size
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