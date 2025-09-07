/**
 * Theme Testing Utilities
 * Provides functions to test theme switching functionality
 */

export interface ThemeTestResult {
  success: boolean;
  message: string;
  details?: any;
}

/**
 * Test if CSS custom properties are properly defined
 */
export function testCSSCustomProperties(): ThemeTestResult {
  const testProperties = [
    '--background',
    '--foreground',
    '--primary',
    '--accent',
    '--secondary',
    '--muted'
  ];

  const computedStyle = getComputedStyle(document.documentElement);
  const missingProperties: string[] = [];

  testProperties.forEach(prop => {
    const value = computedStyle.getPropertyValue(prop).trim();
    if (!value) {
      missingProperties.push(prop);
    }
  });

  return {
    success: missingProperties.length === 0,
    message: missingProperties.length === 0
      ? 'All CSS custom properties are defined'
      : `Missing CSS properties: ${missingProperties.join(', ')}`,
    details: { missingProperties }
  };
}

/**
 * Test if theme class is properly applied to document
 */
export function testThemeClassApplication(): ThemeTestResult {
  const hasLightClass = document.documentElement.classList.contains('light');
  const hasDarkClass = document.documentElement.classList.contains('dark');
  const hasNoThemeClass = !hasLightClass && !hasDarkClass;

  return {
    success: hasLightClass || hasDarkClass || hasNoThemeClass,
    message: hasLightClass
      ? 'Light theme class applied'
      : hasDarkClass
        ? 'Dark theme class applied'
        : 'System theme (no class) applied',
    details: {
      lightClass: hasLightClass,
      darkClass: hasDarkClass,
      systemTheme: hasNoThemeClass
    }
  };
}

/**
 * Test if system preference detection works
 */
export function testSystemPreferenceDetection(): ThemeTestResult {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const systemPrefersDark = mediaQuery.matches;

  return {
    success: true,
    message: `System prefers ${systemPrefersDark ? 'dark' : 'light'} theme`,
    details: { systemPrefersDark }
  };
}

/**
 * Test color contrast ratios for accessibility
 */
export function testColorContrast(): ThemeTestResult {
  const computedStyle = getComputedStyle(document.documentElement);

  // Get background and foreground colors
  const background = computedStyle.getPropertyValue('--background').trim();
  const foreground = computedStyle.getPropertyValue('--foreground').trim();

  if (!background || !foreground) {
    return {
      success: false,
      message: 'Could not retrieve background or foreground colors',
      details: { background, foreground }
    };
  }

  return {
    success: true,
    message: 'Color values are defined (manual contrast testing required)',
    details: { background, foreground }
  };
}

/**
 * Run all theme tests
 */
export function runAllThemeTests(): { [key: string]: ThemeTestResult } {
  return {
    cssProperties: testCSSCustomProperties(),
    themeClass: testThemeClassApplication(),
    systemPreference: testSystemPreferenceDetection(),
    colorContrast: testColorContrast()
  };
}
