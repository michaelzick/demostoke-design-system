import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { designSystemSettingsService } from '../services/designSystemSettingsService';

// Helper function to convert hex to HSL
const hexToHsl = (hex: string): string => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

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

  // Convert to HSL format that CSS expects
  const hslH = Math.round(h * 360);
  const hslS = Math.round(s * 100);
  const hslL = Math.round(l * 100);
  
  return `${hslH} ${hslS}% ${hslL}%`;
};

// Hook for applying design system settings to specific scoped areas only
export const useDesignSystemPreview = () => {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const applyDesignSystemSettings = async () => {
      try {
        if (!designSystemSettingsService.isConnected()) {
          return;
        }

        const settings = await designSystemSettingsService.getCurrentSettings();
        if (!settings) return;

        const root = document.documentElement;
        const isDark = resolvedTheme === 'dark';

        // Apply colors based on current theme using DS-prefixed variables
        if (isDark) {
          if (settings.primary_color_dark) {
            root.style.setProperty('--ds-primary', hexToHsl(settings.primary_color_dark));
          }
          if (settings.secondary_color_dark) {
            root.style.setProperty('--ds-secondary', hexToHsl(settings.secondary_color_dark));
          }
          if (settings.accent_color_dark) {
            root.style.setProperty('--ds-accent', hexToHsl(settings.accent_color_dark));
          }
          if (settings.background_color_dark) {
            root.style.setProperty('--ds-background', hexToHsl(settings.background_color_dark));
          }
          if (settings.foreground_color_dark) {
            root.style.setProperty('--ds-foreground', hexToHsl(settings.foreground_color_dark));
          }
          if (settings.muted_color_dark) {
            root.style.setProperty('--ds-muted', hexToHsl(settings.muted_color_dark));
          }
          if (settings.border_color_dark) {
            root.style.setProperty('--ds-border', hexToHsl(settings.border_color_dark));
          }
        } else {
          if (settings.primary_color) {
            root.style.setProperty('--ds-primary', hexToHsl(settings.primary_color));
          }
          if (settings.secondary_color) {
            root.style.setProperty('--ds-secondary', hexToHsl(settings.secondary_color));
          }
          if (settings.accent_color) {
            root.style.setProperty('--ds-accent', hexToHsl(settings.accent_color));
          }
          if (settings.background_color) {
            root.style.setProperty('--ds-background', hexToHsl(settings.background_color));
          }
          if (settings.foreground_color) {
            root.style.setProperty('--ds-foreground', hexToHsl(settings.foreground_color));
          }
          if (settings.muted_color) {
            root.style.setProperty('--ds-muted', hexToHsl(settings.muted_color));
          }
          if (settings.border_color) {
            root.style.setProperty('--ds-border', hexToHsl(settings.border_color));
          }
        }

        // Apply font family if specified
        if (settings.font_family) {
          const fontMap: Record<string, string> = {
            'inter': 'Inter, system-ui, sans-serif',
            'tahoma': 'Tahoma, Arial, sans-serif',
            'jetbrains-mono': 'JetBrains Mono, monospace'
          };
          
          const fontFamily = fontMap[settings.font_family] || fontMap.inter;
          root.style.setProperty('--ds-font-family-sans', fontFamily);
        }

        // Apply base font size
        if (settings.base_font_size) {
          root.style.setProperty('--ds-text-base-size', `${settings.base_font_size}px`);
        }

        // Dispatch custom event to notify components of theme change
        window.dispatchEvent(new CustomEvent('designSystemUpdated', { 
          detail: { settings, theme: resolvedTheme } 
        }));

      } catch (error) {
        console.warn('Failed to apply design system settings:', error);
      }
    };

    // Apply settings when theme changes
    applyDesignSystemSettings();

    // Listen for storage changes (when settings are updated in another tab)
    const handleStorageChange = () => {
      applyDesignSystemSettings();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [resolvedTheme]);
};