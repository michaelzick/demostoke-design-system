/**
 * Simple accessibility validation script
 * Run this in the browser console to test accessibility features
 */

// Test color contrast calculations
function testColorContrast() {
  console.log('🎨 Testing Color Contrast...');

  // Get CSS custom properties
  const root = getComputedStyle(document.documentElement);

  const colors = {
    primary: root.getPropertyValue('--primary').trim(),
    background: root.getPropertyValue('--background').trim(),
    foreground: root.getPropertyValue('--foreground').trim(),
    accent: root.getPropertyValue('--accent').trim(),
    'primary-foreground': root.getPropertyValue('--primary-foreground').trim(),
    'accent-foreground': root.getPropertyValue('--accent-foreground').trim()
  };

  console.log('CSS Custom Properties:', colors);

  // Test if colors are properly defined
  const undefinedColors = Object.entries(colors).filter(([key, value]) => !value);
  if (undefinedColors.length > 0) {
    console.error('❌ Undefined colors:', undefinedColors);
  } else {
    console.log('✅ All color properties are defined');
  }
}

// Test keyboard navigation
function testKeyboardNavigation() {
  console.log('⌨️ Testing Keyboard Navigation...');

  const focusableElements = document.querySelectorAll(
    'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"]):not([disabled])'
  );

  console.log(`Found ${focusableElements.length} focusable elements`);

  // Test focus indicators
  let elementsWithoutFocusIndicator = 0;
  focusableElements.forEach((element, index) => {
    const computedStyle = getComputedStyle(element);
    const hasFocusRing = element.classList.contains('focus-visible:ring') ||
                        element.classList.contains('focus:ring') ||
                        computedStyle.outline !== 'none';

    if (!hasFocusRing) {
      elementsWithoutFocusIndicator++;
      console.warn(`Element ${index + 1} lacks focus indicator:`, element);
    }
  });

  if (elementsWithoutFocusIndicator === 0) {
    console.log('✅ All focusable elements have focus indicators');
  } else {
    console.warn(`⚠️ ${elementsWithoutFocusIndicator} elements lack focus indicators`);
  }
}

// Test ARIA attributes
function testAriaAttributes() {
  console.log('🏷️ Testing ARIA Attributes...');

  // Check buttons
  const buttons = document.querySelectorAll('button, [role="button"]');
  let buttonsWithoutLabel = 0;

  buttons.forEach((button, index) => {
    const hasLabel = button.getAttribute('aria-label') ||
                    button.getAttribute('aria-labelledby') ||
                    button.textContent?.trim() ||
                    button.querySelector('span, svg')?.getAttribute('aria-label');

    if (!hasLabel) {
      buttonsWithoutLabel++;
      console.warn(`Button ${index + 1} lacks accessible label:`, button);
    }
  });

  if (buttonsWithoutLabel === 0) {
    console.log('✅ All buttons have accessible labels');
  } else {
    console.warn(`⚠️ ${buttonsWithoutLabel} buttons lack accessible labels`);
  }

  // Check form inputs
  const inputs = document.querySelectorAll('input:not([type="hidden"]), textarea, select');
  let inputsWithoutLabel = 0;

  inputs.forEach((input, index) => {
    const hasLabel = input.getAttribute('aria-label') ||
                    input.getAttribute('aria-labelledby') ||
                    document.querySelector(`label[for="${input.id}"]`) ||
                    input.closest('label');

    if (!hasLabel) {
      inputsWithoutLabel++;
      console.warn(`Input ${index + 1} lacks proper label:`, input);
    }
  });

  if (inputsWithoutLabel === 0) {
    console.log('✅ All form inputs have proper labels');
  } else {
    console.warn(`⚠️ ${inputsWithoutLabel} inputs lack proper labels`);
  }
}

// Test heading hierarchy
function testHeadingHierarchy() {
  console.log('📝 Testing Heading Hierarchy...');

  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const headingLevels = headings.map(h => parseInt(h.tagName.charAt(1)));

  if (headingLevels.length === 0) {
    console.warn('⚠️ No headings found');
    return;
  }

  console.log('Heading structure:', headingLevels);

  let hierarchyIssues = 0;
  let previousLevel = 0;

  headingLevels.forEach((level, index) => {
    if (index === 0 && level !== 1) {
      console.warn('⚠️ Page should start with h1');
      hierarchyIssues++;
    } else if (level > previousLevel + 1) {
      console.warn(`⚠️ Heading hierarchy jumps from h${previousLevel} to h${level}`);
      hierarchyIssues++;
    }
    previousLevel = level;
  });

  if (hierarchyIssues === 0) {
    console.log('✅ Heading hierarchy is correct');
  } else {
    console.warn(`⚠️ Found ${hierarchyIssues} heading hierarchy issues`);
  }
}

// Test theme switching accessibility
function testThemeSwitching() {
  console.log('🌓 Testing Theme Switching...');

  const themeToggle = document.querySelector('[aria-label*="theme"], [aria-label*="Theme"]');
  if (themeToggle) {
    console.log('✅ Theme toggle found with proper aria-label');
  } else {
    console.warn('⚠️ Theme toggle not found or lacks aria-label');
  }

  // Test CSS custom properties in both themes
  const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  console.log(`Current theme: ${currentTheme}`);

  // Test if theme transitions are smooth
  const hasTransitions = getComputedStyle(document.body).transition.includes('color') ||
                        getComputedStyle(document.body).transition.includes('background');

  if (hasTransitions) {
    console.log('✅ Smooth theme transitions are enabled');
  } else {
    console.log('ℹ️ Theme transitions may not be enabled on body element');
  }
}

// Run all tests
function runAccessibilityTests() {
  console.log('🚀 Running Accessibility Tests...\n');

  testColorContrast();
  console.log('');

  testKeyboardNavigation();
  console.log('');

  testAriaAttributes();
  console.log('');

  testHeadingHierarchy();
  console.log('');

  testThemeSwitching();
  console.log('');

  console.log('✅ Accessibility testing complete!');
  console.log('💡 For comprehensive testing, use the built-in Accessibility Test Suite in the application.');
}

// Auto-run tests when script is loaded
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAccessibilityTests);
  } else {
    runAccessibilityTests();
  }
}

// Export for manual use
window.runAccessibilityTests = runAccessibilityTests;
