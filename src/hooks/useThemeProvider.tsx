import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { designSystemDefaults } from '@/lib/designTokens';
import { designSystemTokensService } from '@/services/designSystemTokensService';

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

// Helper function to parse HSL color string
const parseHsl = (hsl: string): { h: number; s: number; l: number } | null => {
  if (!hsl || typeof hsl !== 'string') return null;
  
  // Handle both hsl() format and plain format
  const cleanHsl = hsl.replace(/hsl\(|\)/g, '').trim();
  const parts = cleanHsl.split(/[\s,]+/).map(p => p.replace('%', ''));
  
  if (parts.length !== 3) return null;
  
  const h = parseFloat(parts[0]);
  const s = parseFloat(parts[1]);
  const l = parseFloat(parts[2]);
  
  if (isNaN(h) || isNaN(s) || isNaN(l)) return null;
  
  return { h, s, l };
};

// Hook for applying design system settings to specific scoped areas only
export const useDesignSystemPreview = () => {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const applyDesignSystemSettings = async () => {
      try {
        if (!designSystemTokensService.isConnected()) {
          return;
        }

        const tokens = await designSystemTokensService.getCurrentTokens();
        if (!tokens) return;

        const root = document.documentElement;
        const isDark = resolvedTheme === 'dark';

        // Apply colors based on current theme using DS-prefixed variables
        if (isDark) {
          if (tokens.primary_color_dark) {
            root.style.setProperty('--ds-primary', hexToHsl(tokens.primary_color_dark));
          }
          if (tokens.secondary_color_dark) {
            root.style.setProperty('--ds-secondary', hexToHsl(tokens.secondary_color_dark));
          }
          if (tokens.accent_color_dark) {
            root.style.setProperty('--ds-accent', hexToHsl(tokens.accent_color_dark));
          }
          if (tokens.background_color_dark) {
            root.style.setProperty('--ds-background', hexToHsl(tokens.background_color_dark));
          }
          if (tokens.foreground_color_dark) {
            root.style.setProperty('--ds-foreground', hexToHsl(tokens.foreground_color_dark));
          }
          if (tokens.muted_color_dark) {
            root.style.setProperty('--ds-muted', hexToHsl(tokens.muted_color_dark));
          }
          if (tokens.border_color_dark) {
            root.style.setProperty('--ds-border', hexToHsl(tokens.border_color_dark));
          }
        } else {
          if (tokens.primary_color) {
            root.style.setProperty('--ds-primary', hexToHsl(tokens.primary_color));
          }
          if (tokens.secondary_color) {
            root.style.setProperty('--ds-secondary', hexToHsl(tokens.secondary_color));
          }
          if (tokens.accent_color) {
            root.style.setProperty('--ds-accent', hexToHsl(tokens.accent_color));
          }
          if (tokens.background_color) {
            root.style.setProperty('--ds-background', hexToHsl(tokens.background_color));
          }
          if (tokens.foreground_color) {
            root.style.setProperty('--ds-foreground', hexToHsl(tokens.foreground_color));
          }
          if (tokens.muted_color) {
            root.style.setProperty('--ds-muted', hexToHsl(tokens.muted_color));
          }
          if (tokens.border_color) {
            root.style.setProperty('--ds-border', hexToHsl(tokens.border_color));
          }
        }

        // Apply font family if specified
        if (tokens.font_family) {
          const fontMap: Record<string, string> = {
            'inter': 'Inter, system-ui, sans-serif',
            'tahoma': 'Tahoma, Arial, sans-serif',
            'jetbrains-mono': 'JetBrains Mono, monospace'
          };
          
          const fontFamily = fontMap[tokens.font_family] || fontMap.inter;
          root.style.setProperty('--ds-font-family-sans', fontFamily);
        }

        // Apply base font size
        if (tokens.base_font_size) {
          root.style.setProperty('--ds-text-base-size', `${tokens.base_font_size}px`);
        }

        // Dispatch custom event to notify components of theme change
        window.dispatchEvent(new CustomEvent('designSystemUpdated', { 
          detail: { tokens, theme: resolvedTheme } 
        }));

      } catch (error) {
        console.warn('Failed to apply design system tokens:', error);
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

export const useThemeProvider = () => {
  const { theme, resolvedTheme } = useTheme();
  const [userTokens, setUserTokens] = useState<any>(null);

  const loadUserTokens = async () => {
    try {
      const tokens = await designSystemTokensService.getCurrentTokens();
      if (tokens) {
        setUserTokens(tokens);
      }
    } catch (error) {
      console.error('Error loading user tokens for theme:', error);
    }
  };

  useEffect(() => {
    loadUserTokens();
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'design-system-tokens-updated') {
        loadUserTokens();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const resolvedTokens = { ...designSystemDefaults, ...userTokens };

  // Helper function to parse HSL and convert to string
  const hslToString = (hsl: { h: number; s: number; l: number } | null): string => {
    if (!hsl) return '0 0% 0%';
    return `${hsl.h} ${hsl.s}% ${hsl.l}%`;
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      
      // Define CSS variables based on theme
      const cssVariables = resolvedTheme === 'dark' ? {
        '--primary': hslToString(parseHsl(resolvedTokens.primary_color_dark) || parseHsl(designSystemDefaults.primary_color_dark)),
        '--primary-foreground': hslToString(parseHsl(resolvedTokens.primary_color_dark) || parseHsl(designSystemDefaults.primary_color_dark)),
        
        '--secondary': hslToString(parseHsl(resolvedTokens.secondary_color_dark) || parseHsl(designSystemDefaults.secondary_color_dark)),
        '--secondary-foreground': hslToString(parseHsl(resolvedTokens.secondary_color_dark) || parseHsl(designSystemDefaults.secondary_color_dark)),
        
        '--accent': hslToString(parseHsl(resolvedTokens.accent_color_dark) || parseHsl(designSystemDefaults.accent_color_dark)),
        '--accent-foreground': hslToString(parseHsl(resolvedTokens.accent_color_dark) || parseHsl(designSystemDefaults.accent_color_dark)),
        
        '--background': hslToString(parseHsl(resolvedTokens.background_color_dark) || parseHsl(designSystemDefaults.background_color_dark)),
        '--background-foreground': hslToString(parseHsl(resolvedTokens.background_color_dark) || parseHsl(designSystemDefaults.background_color_dark)),
        
        '--foreground': hslToString(parseHsl(resolvedTokens.foreground_color_dark) || parseHsl(designSystemDefaults.foreground_color_dark)),
        '--foreground-background': hslToString(parseHsl(resolvedTokens.foreground_color_dark) || parseHsl(designSystemDefaults.foreground_color_dark)),
        
        '--muted': hslToString(parseHsl(resolvedTokens.muted_color_dark) || parseHsl(designSystemDefaults.muted_color_dark)),
        '--muted-foreground': hslToString(parseHsl(resolvedTokens.muted_color_dark) || parseHsl(designSystemDefaults.muted_color_dark)),
        
        '--border': hslToString(parseHsl(resolvedTokens.border_color_dark) || parseHsl(designSystemDefaults.border_color_dark)),
        '--border-foreground': hslToString(parseHsl(resolvedTokens.border_color_dark) || parseHsl(designSystemDefaults.border_color_dark)),
      } : {
        '--primary': hslToString(parseHsl(resolvedTokens.primary_color) || parseHsl(designSystemDefaults.primary_color)),
        '--primary-foreground': hslToString(parseHsl(resolvedTokens.primary_color) || parseHsl(designSystemDefaults.primary_color)),
        
        '--secondary': hslToString(parseHsl(resolvedTokens.secondary_color) || parseHsl(designSystemDefaults.secondary_color)),
        '--secondary-foreground': hslToString(parseHsl(resolvedTokens.secondary_color) || parseHsl(designSystemDefaults.secondary_color)),
        
        '--accent': hslToString(parseHsl(resolvedTokens.accent_color) || parseHsl(designSystemDefaults.accent_color)),
        '--accent-foreground': hslToString(parseHsl(resolvedTokens.accent_color) || parseHsl(designSystemDefaults.accent_color)),
        
        '--background': hslToString(parseHsl(resolvedTokens.background_color) || parseHsl(designSystemDefaults.background_color)),
        '--background-foreground': hslToString(parseHsl(resolvedTokens.background_color) || parseHsl(designSystemDefaults.background_color)),
        
        '--foreground': hslToString(parseHsl(resolvedTokens.foreground_color) || parseHsl(designSystemDefaults.foreground_color)),
        '--foreground-background': hslToString(parseHsl(resolvedTokens.foreground_color) || parseHsl(designSystemDefaults.foreground_color)),
        
        '--muted': hslToString(parseHsl(resolvedTokens.muted_color) || parseHsl(designSystemDefaults.muted_color)),
        '--muted-foreground': hslToString(parseHsl(resolvedTokens.muted_color) || parseHsl(designSystemDefaults.muted_color)),
        
        '--border': hslToString(parseHsl(resolvedTokens.border_color) || parseHsl(designSystemDefaults.border_color)),
        '--border-foreground': hslToString(parseHsl(resolvedTokens.border_color) || parseHsl(designSystemDefaults.border_color)),
      };

    const fontFamily = resolvedTokens.font_family;
    const fontMap: Record<string, string> = {
      'inter': 'Inter, system-ui, sans-serif',
      'tahoma': 'Tahoma, Arial, sans-serif',
      'jetbrains-mono': 'JetBrains Mono, monospace'
    };
    
    const fontVariables = {
        '--font-family': `'${resolvedTokens.font_family}'`
      };

      // Apply font size variables
    const baseFontSize = resolvedTokens.base_font_size;
    const fontSizeInPx = `${baseFontSize}px`;
    
    const fontSizeVariables = {
      '--font-size-base': fontSizeInPx,
    };

    // Apply all variables
    Object.entries({ ...cssVariables, ...fontVariables, ...fontSizeVariables }).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    }
  }, [resolvedTheme, userTokens]);

  return {
    theme,
    resolvedTheme,
    userTokens,
    resolvedTokens,
  };
};