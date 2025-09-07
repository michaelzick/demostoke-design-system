/**
 * Keyboard Navigation Testing Utilities
 * Tests keyboard accessibility and focus management
 */

export interface KeyboardTestResult {
  testName: string;
  success: boolean;
  details: string;
  issues: string[];
  recommendations: string[];
}

/**
 * Test if element has visible focus indicator
 */
function hasVisibleFocusIndicator(element: Element): boolean {
  const computedStyle = getComputedStyle(element);

  // Check for various focus indicator styles
  const hasOutline = computedStyle.outline !== 'none' && computedStyle.outline !== '0px';
  const hasBoxShadow = computedStyle.boxShadow !== 'none' && computedStyle.boxShadow.includes('ring');
  const hasFocusVisibleClass = element.classList.contains('focus-visible:ring') ||
                              element.classList.contains('focus-visible:outline');

  return hasOutline || hasBoxShadow || hasFocusVisibleClass;
}

/**
 * Test tab order and focus management
 */
export function testTabOrder(): KeyboardTestResult {
  const focusableElements = Array.from(document.querySelectorAll(
    'button:not([disabled]):not([tabindex="-1"]), ' +
    '[role="button"]:not([disabled]):not([tabindex="-1"]), ' +
    'input:not([disabled]):not([tabindex="-1"]), ' +
    'select:not([disabled]):not([tabindex="-1"]), ' +
    'textarea:not([disabled]):not([tabindex="-1"]), ' +
    'a[href]:not([tabindex="-1"]), ' +
    '[tabindex]:not([tabindex="-1"]):not([disabled])'
  )) as HTMLElement[];

  const issues: string[] = [];
  const recommendations: string[] = [];

  // Test for positive tabindex values (anti-pattern)
  const positiveTabIndexElements = focusableElements.filter(el => {
    const tabIndex = el.getAttribute('tabindex');
    return tabIndex && parseInt(tabIndex) > 0;
  });

  if (positiveTabIndexElements.length > 0) {
    issues.push(`Found ${positiveTabIndexElements.length} elements with positive tabindex values`);
    recommendations.push('Remove positive tabindex values and use natural DOM order or tabindex="0"');
  }

  // Test for missing focus indicators
  const elementsWithoutFocusIndicator = focusableElements.filter(el =>
    !hasVisibleFocusIndicator(el)
  );

  if (elementsWithoutFocusIndicator.length > 0) {
    issues.push(`Found ${elementsWithoutFocusIndicator.length} focusable elements without visible focus indicators`);
    recommendations.push('Add focus-visible:ring or similar focus indicator classes to all interactive elements');
  }

  // Test for logical tab order
  const elementsWithTabIndex = focusableElements
    .map(el => ({
      element: el,
      tabIndex: parseInt(el.getAttribute('tabindex') || '0'),
      rect: el.getBoundingClientRect()
    }))
    .filter(item => item.rect.width > 0 && item.rect.height > 0) // Only visible elements
    .sort((a, b) => {
      if (a.tabIndex !== b.tabIndex) {
        return a.tabIndex - b.tabIndex;
      }
      // For same tabindex, sort by position (top to bottom, left to right)
      if (Math.abs(a.rect.top - b.rect.top) > 10) {
        return a.rect.top - b.rect.top;
      }
      return a.rect.left - b.rect.left;
    });

  // Check for elements that might be out of logical order
  let logicalOrderIssues = 0;
  for (let i = 1; i < elementsWithTabIndex.length; i++) {
    const current = elementsWithTabIndex[i];
    const previous = elementsWithTabIndex[i - 1];

    // If current element is significantly above the previous one, it might be out of order
    if (current.rect.top < previous.rect.top - 50) {
      logicalOrderIssues++;
    }
  }

  if (logicalOrderIssues > 0) {
    issues.push(`Detected ${logicalOrderIssues} potential tab order issues`);
    recommendations.push('Review tab order to ensure it follows a logical reading sequence');
  }

  return {
    testName: 'Tab Order and Focus Management',
    success: issues.length === 0,
    details: `Analyzed ${focusableElements.length} focusable elements. Found ${issues.length} issues.`,
    issues,
    recommendations
  };
}

/**
 * Test keyboard event handling
 */
export function testKeyboardEventHandling(): KeyboardTestResult {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Test for elements with click handlers but no keyboard handlers
  const clickableElements = Array.from(document.querySelectorAll('*')).filter(el => {
    const events = (el as any)._events || {};
    return events.click || el.getAttribute('onclick');
  });

  const elementsWithoutKeyboardSupport = clickableElements.filter(el => {
    const events = (el as any)._events || {};
    const hasKeyboardEvents = events.keydown || events.keyup || events.keypress;
    const isNativelyKeyboardAccessible = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName);
    const hasTabIndex = el.hasAttribute('tabindex');
    const hasRole = el.getAttribute('role') === 'button' || el.getAttribute('role') === 'link';

    return !hasKeyboardEvents && !isNativelyKeyboardAccessible && !hasTabIndex && !hasRole;
  });

  if (elementsWithoutKeyboardSupport.length > 0) {
    issues.push(`Found ${elementsWithoutKeyboardSupport.length} clickable elements without keyboard support`);
    recommendations.push('Add keyboard event handlers (Enter/Space) to all clickable elements that are not natively keyboard accessible');
  }

  // Test for proper ARIA roles on custom interactive elements
  const customInteractiveElements = Array.from(document.querySelectorAll('[onclick], [role="button"]')).filter(el => {
    return !['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName);
  });

  const elementsWithoutProperRole = customInteractiveElements.filter(el => {
    const role = el.getAttribute('role');
    return !role || !['button', 'link', 'menuitem', 'tab'].includes(role);
  });

  if (elementsWithoutProperRole.length > 0) {
    issues.push(`Found ${elementsWithoutProperRole.length} custom interactive elements without proper ARIA roles`);
    recommendations.push('Add appropriate ARIA roles (button, link, etc.) to custom interactive elements');
  }

  return {
    testName: 'Keyboard Event Handling',
    success: issues.length === 0,
    details: `Analyzed ${clickableElements.length} clickable elements and ${customInteractiveElements.length} custom interactive elements.`,
    issues,
    recommendations
  };
}

/**
 * Test focus trap functionality in modals and overlays
 */
export function testFocusTrap(): KeyboardTestResult {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Find modal and overlay elements
  const modals = Array.from(document.querySelectorAll(
    '[role="dialog"], [role="alertdialog"], .modal, [data-modal], [aria-modal="true"]'
  ));

  const overlays = Array.from(document.querySelectorAll(
    '.overlay, [data-overlay], .dropdown-content, .popover-content'
  ));

  const allOverlayElements = [...modals, ...overlays];

  allOverlayElements.forEach((overlay, index) => {
    const focusableInOverlay = overlay.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"]):not([disabled])'
    );

    if (focusableInOverlay.length === 0) {
      issues.push(`Overlay ${index + 1} has no focusable elements`);
      recommendations.push('Ensure all modals and overlays contain at least one focusable element');
    }

    // Check for close button or escape functionality
    const hasCloseButton = overlay.querySelector('[aria-label*="close"], [data-close], .close-button');
    const hasEscapeHandler = overlay.hasAttribute('data-escape') ||
                           overlay.getAttribute('role') === 'dialog' ||
                           overlay.getAttribute('role') === 'alertdialog';

    if (!hasCloseButton && !hasEscapeHandler) {
      issues.push(`Overlay ${index + 1} lacks clear close mechanism`);
      recommendations.push('Add close button or Escape key handler to all overlays');
    }
  });

  return {
    testName: 'Focus Trap Functionality',
    success: issues.length === 0,
    details: `Analyzed ${modals.length} modals and ${overlays.length} overlays.`,
    issues,
    recommendations
  };
}

/**
 * Test skip links and navigation landmarks
 */
export function testNavigationAccessibility(): KeyboardTestResult {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check for skip links
  const skipLinks = document.querySelectorAll('a[href^="#"], [data-skip-link]');
  const visibleSkipLinks = Array.from(skipLinks).filter(link => {
    const computedStyle = getComputedStyle(link);
    return computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden';
  });

  if (visibleSkipLinks.length === 0) {
    issues.push('No skip links found for keyboard navigation');
    recommendations.push('Add skip-to-content links for keyboard users');
  }

  // Check for navigation landmarks
  const landmarks = {
    main: document.querySelectorAll('main, [role="main"]').length,
    nav: document.querySelectorAll('nav, [role="navigation"]').length,
    banner: document.querySelectorAll('header, [role="banner"]').length,
    contentinfo: document.querySelectorAll('footer, [role="contentinfo"]').length,
    complementary: document.querySelectorAll('aside, [role="complementary"]').length
  };

  if (landmarks.main === 0) {
    issues.push('No main landmark found');
    recommendations.push('Add <main> element or role="main" to identify main content area');
  }

  if (landmarks.nav === 0) {
    issues.push('No navigation landmarks found');
    recommendations.push('Add <nav> elements or role="navigation" to identify navigation areas');
  }

  // Check for heading structure
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const headingLevels = headings.map(h => parseInt(h.tagName.charAt(1)));

  if (headingLevels.length === 0) {
    issues.push('No headings found for content structure');
    recommendations.push('Add proper heading hierarchy (h1-h6) to structure content');
  } else {
    // Check for proper heading hierarchy
    let previousLevel = 0;
    headingLevels.forEach((level, index) => {
      if (index === 0 && level !== 1) {
        issues.push('Page should start with h1 heading');
        recommendations.push('Use h1 for the main page title');
      } else if (level > previousLevel + 1) {
        issues.push(`Heading hierarchy jumps from h${previousLevel} to h${level}`);
        recommendations.push('Use sequential heading levels (don\'t skip levels)');
      }
      previousLevel = level;
    });
  }

  return {
    testName: 'Navigation Accessibility',
    success: issues.length === 0,
    details: `Found ${skipLinks.length} skip links, ${Object.values(landmarks).reduce((a, b) => a + b, 0)} landmarks, and ${headings.length} headings.`,
    issues,
    recommendations
  };
}

/**
 * Run all keyboard navigation tests
 */
export function runAllKeyboardTests(): { [key: string]: KeyboardTestResult } {
  return {
    tabOrder: testTabOrder(),
    keyboardEvents: testKeyboardEventHandling(),
    focusTrap: testFocusTrap(),
    navigation: testNavigationAccessibility()
  };
}
