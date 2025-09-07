/**
 * Accessibility Testing Utilities for DemoStoke Design System
 * Tests color contrast ratios, keyboard navigation, and WCAG compliance
 */

export interface ContrastTestResult {
  foreground: string;
  background: string;
  ratio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
  wcagAALarge: boolean;
  wcagAAALarge: boolean;
  status: 'pass' | 'fail' | 'warning';
  level: 'AA' | 'AAA' | 'AA Large' | 'AAA Large' | 'Fail';
}

export interface AccessibilityTestResult {
  testName: string;
  success: boolean;
  details: string;
  recommendations?: string[];
}

/**
 * Convert HSL color to RGB values
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h * 6) % 2 - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 1/6) {
    r = c; g = x; b = 0;
  } else if (1/6 <= h && h < 2/6) {
    r = x; g = c; b = 0;
  } else if (2/6 <= h && h < 3/6) {
    r = 0; g = c; b = x;
  } else if (3/6 <= h && h < 4/6) {
    r = 0; g = x; b = c;
  } else if (4/6 <= h && h < 5/6) {
    r = x; g = 0; b = c;
  } else if (5/6 <= h && h < 1) {
    r = c; g = 0; b = x;
  }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  ];
}

/**
 * Parse HSL string and convert to RGB
 */
function parseHslToRgb(hslString: string): [number, number, number] {
  // Remove 'hsl(' and ')' and split by spaces or commas
  const values = hslString
    .replace(/hsl\(|\)/g, '')
    .split(/[\s,]+/)
    .map(v => parseFloat(v.replace('%', '')));

  if (values.length !== 3) {
    throw new Error(`Invalid HSL string: ${hslString}`);
  }

  return hslToRgb(values[0], values[1], values[2]);
}

/**
 * Calculate relative luminance of a color
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
function calculateContrastRatio(color1: [number, number, number], color2: [number, number, number]): number {
  const l1 = getRelativeLuminance(...color1);
  const l2 = getRelativeLuminance(...color2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get computed CSS custom property value
 */
function getCSSCustomProperty(property: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(property).trim();
  return value;
}

/**
 * Test color contrast ratio for a given combination
 */
export function testColorContrast(
  foregroundProperty: string,
  backgroundProperty: string,
  description: string
): ContrastTestResult {
  try {
    const foregroundHsl = getCSSCustomProperty(foregroundProperty);
    const backgroundHsl = getCSSCustomProperty(backgroundProperty);

    if (!foregroundHsl || !backgroundHsl) {
      throw new Error(`Could not get CSS properties: ${foregroundProperty}, ${backgroundProperty}`);
    }

    // Convert HSL to RGB
    const foregroundRgb = parseHslToRgb(`hsl(${foregroundHsl})`);
    const backgroundRgb = parseHslToRgb(`hsl(${backgroundHsl})`);

    // Calculate contrast ratio
    const ratio = calculateContrastRatio(foregroundRgb, backgroundRgb);

    // WCAG compliance levels
    const wcagAA = ratio >= 4.5;
    const wcagAAA = ratio >= 7;
    const wcagAALarge = ratio >= 3;
    const wcagAAALarge = ratio >= 4.5;

    let level: ContrastTestResult['level'];
    let status: ContrastTestResult['status'];

    if (wcagAAA) {
      level = 'AAA';
      status = 'pass';
    } else if (wcagAA) {
      level = 'AA';
      status = 'pass';
    } else if (wcagAAALarge) {
      level = 'AAA Large';
      status = 'warning';
    } else if (wcagAALarge) {
      level = 'AA Large';
      status = 'warning';
    } else {
      level = 'Fail';
      status = 'fail';
    }

    return {
      foreground: `hsl(${foregroundHsl})`,
      background: `hsl(${backgroundHsl})`,
      ratio: Math.round(ratio * 100) / 100,
      wcagAA,
      wcagAAA,
      wcagAALarge,
      wcagAAALarge,
      status,
      level
    };
  } catch (error) {
    return {
      foreground: 'Error',
      background: 'Error',
      ratio: 0,
      wcagAA: false,
      wcagAAA: false,
      wcagAALarge: false,
      wcagAAALarge: false,
      status: 'fail',
      level: 'Fail'
    };
  }
}

/**
 * Test keyboard navigation for interactive elements
 */
export function testKeyboardNavigation(): AccessibilityTestResult {
  const interactiveElements = document.querySelectorAll(
    'button, [role="button"], input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
  );

  const issues: string[] = [];
  let focusableCount = 0;

  interactiveElements.forEach((element, index) => {
    const tabIndex = element.getAttribute('tabindex');
    const isHidden = element.getAttribute('aria-hidden') === 'true';
    const isDisabled = element.hasAttribute('disabled');

    // Check if element is focusable
    if (!isHidden && !isDisabled) {
      focusableCount++;

      // Check for proper focus indicators
      const computedStyle = getComputedStyle(element);
      const hasFocusOutline = computedStyle.outline !== 'none' ||
                             computedStyle.boxShadow.includes('ring') ||
                             element.classList.contains('focus-visible:ring');

      if (!hasFocusOutline) {
        issues.push(`Element ${index + 1} (${element.tagName}) lacks visible focus indicator`);
      }

      // Check for proper ARIA labels
      const hasLabel = element.getAttribute('aria-label') ||
                      element.getAttribute('aria-labelledby') ||
                      (element as HTMLElement).innerText?.trim() ||
                      element.getAttribute('title');

      if (!hasLabel && element.tagName !== 'INPUT') {
        issues.push(`Element ${index + 1} (${element.tagName}) lacks accessible label`);
      }
    }
  });

  return {
    testName: 'Keyboard Navigation',
    success: issues.length === 0,
    details: `Found ${focusableCount} focusable elements. ${issues.length} issues detected.`,
    recommendations: issues.length > 0 ? issues : undefined
  };
}

/**
 * Test focus management and tab order
 */
export function testFocusManagement(): AccessibilityTestResult {
  const focusableElements = Array.from(document.querySelectorAll(
    'button:not([disabled]), [role="button"]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"]):not([disabled])'
  )) as HTMLElement[];

  const issues: string[] = [];

  // Test tab order
  const tabIndexes = focusableElements.map(el => {
    const tabIndex = el.getAttribute('tabindex');
    return tabIndex ? parseInt(tabIndex) : 0;
  });

  // Check for positive tab indexes (anti-pattern)
  const positiveTabIndexes = tabIndexes.filter(index => index > 0);
  if (positiveTabIndexes.length > 0) {
    issues.push(`Found ${positiveTabIndexes.length} elements with positive tabindex (anti-pattern)`);
  }

  // Test focus trap in modals/dialogs
  const modals = document.querySelectorAll('[role="dialog"], [role="alertdialog"]');
  modals.forEach((modal, index) => {
    const modalFocusable = modal.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"]):not([disabled])'
    );

    if (modalFocusable.length === 0) {
      issues.push(`Modal ${index + 1} has no focusable elements`);
    }
  });

  return {
    testName: 'Focus Management',
    success: issues.length === 0,
    details: `Analyzed ${focusableElements.length} focusable elements and ${modals.length} modals.`,
    recommendations: issues.length > 0 ? issues : undefined
  };
}

/**
 * Test ARIA attributes and semantic markup
 */
export function testAriaCompliance(): AccessibilityTestResult {
  const issues: string[] = [];

  // Check for proper heading hierarchy
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  let previousLevel = 0;

  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    if (index === 0 && level !== 1) {
      issues.push('Page should start with h1 heading');
    } else if (level > previousLevel + 1) {
      issues.push(`Heading level jumps from h${previousLevel} to h${level} (should be sequential)`);
    }
    previousLevel = level;
  });

  // Check for images without alt text
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.getAttribute('alt') && img.getAttribute('alt') !== '') {
      issues.push(`Image ${index + 1} missing alt attribute`);
    }
  });

  // Check for form labels
  const inputs = document.querySelectorAll('input[type]:not([type="hidden"]), textarea, select');
  inputs.forEach((input, index) => {
    const hasLabel = input.getAttribute('aria-label') ||
                    input.getAttribute('aria-labelledby') ||
                    document.querySelector(`label[for="${input.id}"]`);

    if (!hasLabel) {
      issues.push(`Form input ${index + 1} lacks proper label`);
    }
  });

  // Check for proper button roles
  const buttons = document.querySelectorAll('[role="button"]:not(button)');
  buttons.forEach((button, index) => {
    if (!button.getAttribute('tabindex')) {
      issues.push(`Element ${index + 1} with button role lacks tabindex`);
    }
  });

  return {
    testName: 'ARIA Compliance',
    success: issues.length === 0,
    details: `Checked ${headings.length} headings, ${images.length} images, ${inputs.length} form inputs, and ${buttons.length} button roles.`,
    recommendations: issues.length > 0 ? issues : undefined
  };
}

/**
 * Run comprehensive accessibility tests
 */
export function runAccessibilityTests(): {
  contrastTests: { [key: string]: ContrastTestResult };
  behaviorTests: { [key: string]: AccessibilityTestResult };
  overallScore: number;
} {
  // Color contrast tests for both light and dark modes
  const contrastTests: { [key: string]: ContrastTestResult } = {};

  // Primary color combinations
  contrastTests.primaryOnBackground = testColorContrast('--primary', '--background', 'Primary on Background');
  contrastTests.primaryForegroundOnPrimary = testColorContrast('--primary-foreground', '--primary', 'Primary Foreground on Primary');
  contrastTests.accentOnBackground = testColorContrast('--accent', '--background', 'Accent on Background');
  contrastTests.accentForegroundOnAccent = testColorContrast('--accent-foreground', '--accent', 'Accent Foreground on Accent');

  // Text combinations
  contrastTests.foregroundOnBackground = testColorContrast('--foreground', '--background', 'Text on Background');
  contrastTests.foregroundOnCard = testColorContrast('--foreground', '--card', 'Text on Card');
  contrastTests.mutedForegroundOnBackground = testColorContrast('--muted-foreground', '--background', 'Muted Text on Background');
  contrastTests.mutedForegroundOnMuted = testColorContrast('--muted-foreground', '--muted', 'Muted Text on Muted Background');

  // Interactive elements
  contrastTests.secondaryForegroundOnSecondary = testColorContrast('--secondary-foreground', '--secondary', 'Secondary Text on Secondary');
  contrastTests.destructiveForegroundOnDestructive = testColorContrast('--destructive-foreground', '--destructive', 'Destructive Text on Destructive');
  contrastTests.successForegroundOnSuccess = testColorContrast('--success-foreground', '--success', 'Success Text on Success');

  // Border and subtle elements
  contrastTests.borderOnBackground = testColorContrast('--border', '--background', 'Border on Background');
  contrastTests.ringOnBackground = testColorContrast('--ring', '--background', 'Focus Ring on Background');

  // Behavioral tests
  const behaviorTests: { [key: string]: AccessibilityTestResult } = {};
  behaviorTests.keyboardNavigation = testKeyboardNavigation();
  behaviorTests.focusManagement = testFocusManagement();
  behaviorTests.ariaCompliance = testAriaCompliance();

  // Calculate overall score
  const contrastPassed = Object.values(contrastTests).filter(test => test.status === 'pass').length;
  const contrastTotal = Object.values(contrastTests).length;
  const behaviorPassed = Object.values(behaviorTests).filter(test => test.success).length;
  const behaviorTotal = Object.values(behaviorTests).length;

  const overallScore = Math.round(((contrastPassed + behaviorPassed) / (contrastTotal + behaviorTotal)) * 100);

  return {
    contrastTests,
    behaviorTests,
    overallScore
  };
}
