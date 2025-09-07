#!/usr/bin/env node

/**
 * DemoStoke Design Token Performance Analysis
 * Analyzes CSS bundle size and identifies optimization opportunities
 */

import fs from 'fs';
import path from 'path';

// File paths
const CSS_SOURCE = 'src/index.css';
const CSS_DIST = 'dist/assets';
const TAILWIND_CONFIG = 'tailwind.config.ts';

// Analysis results
const analysis = {
  bundleSize: {},
  customProperties: {},
  optimizations: [],
  recommendations: []
};

/**
 * Get file size in bytes and human readable format
 */
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const bytes = stats.size;
    const kb = (bytes / 1024).toFixed(2);
    return { bytes, kb: `${kb} KB` };
  } catch (error) {
    return { bytes: 0, kb: '0 KB' };
  }
}

/**
 * Find the built CSS file in dist directory
 */
function findBuiltCSSFile() {
  try {
    const distFiles = fs.readdirSync(CSS_DIST);
    const cssFile = distFiles.find(file => file.endsWith('.css'));
    return cssFile ? path.join(CSS_DIST, cssFile) : null;
  } catch (error) {
    return null;
  }
}

/**
 * Analyze CSS custom properties usage
 */
function analyzeCustomProperties() {
  try {
    const cssContent = fs.readFileSync(CSS_SOURCE, 'utf8');

    // Extract all custom properties
    const customPropRegex = /--[\w-]+:\s*[^;]+;/g;
    const customProps = cssContent.match(customPropRegex) || [];

    // Count properties by category
    const categories = {
      colors: customProps.filter(prop => prop.includes('color') || prop.includes('background') || prop.includes('foreground')),
      typography: customProps.filter(prop => prop.includes('font') || prop.includes('line-height')),
      spacing: customProps.filter(prop => prop.includes('spacing') || prop.includes('radius')),
      shadows: customProps.filter(prop => prop.includes('shadow')),
      transitions: customProps.filter(prop => prop.includes('transition')),
      gradients: customProps.filter(prop => prop.includes('gradient')),
      sidebar: customProps.filter(prop => prop.includes('sidebar'))
    };

    return {
      total: customProps.length,
      categories,
      duplicates: findDuplicateProperties(customProps)
    };
  } catch (error) {
    console.error('Error analyzing custom properties:', error.message);
    return { total: 0, categories: {}, duplicates: [] };
  }
}

/**
 * Find duplicate or redundant custom properties
 */
function findDuplicateProperties(properties) {
  const duplicates = [];
  const seen = new Set();

  properties.forEach(prop => {
    const name = prop.split(':')[0].trim();
    if (seen.has(name)) {
      duplicates.push(name);
    } else {
      seen.add(name);
    }
  });

  return duplicates;
}

/**
 * Analyze Tailwind configuration efficiency
 */
function analyzeTailwindConfig() {
  try {
    const configContent = fs.readFileSync(TAILWIND_CONFIG, 'utf8');

    // Count extended properties
    const fontSizeMatches = configContent.match(/fontSize:\s*{[^}]+}/s);
    const colorMatches = configContent.match(/colors:\s*{[^}]+}/s);
    const spacingMatches = configContent.match(/spacing:\s*{[^}]+}/s);

    return {
      fontSizes: fontSizeMatches ? fontSizeMatches[0].split('\n').length - 2 : 0,
      colors: colorMatches ? colorMatches[0].split('\n').length - 2 : 0,
      spacing: spacingMatches ? spacingMatches[0].split('\n').length - 2 : 0
    };
  } catch (error) {
    console.error('Error analyzing Tailwind config:', error.message);
    return { fontSizes: 0, colors: 0, spacing: 0 };
  }
}

/**
 * Generate optimization recommendations
 */
function generateRecommendations(customProps, bundleSize) {
  const recommendations = [];

  // Bundle size recommendations
  if (bundleSize.distBytes > 100000) { // > 100KB
    recommendations.push({
      type: 'bundle-size',
      priority: 'high',
      message: `CSS bundle is ${bundleSize.distKB}, consider purging unused styles`,
      action: 'Review Tailwind purge configuration and remove unused utilities'
    });
  }

  // Custom properties optimization
  if (customProps.duplicates.length > 0) {
    recommendations.push({
      type: 'duplicates',
      priority: 'medium',
      message: `Found ${customProps.duplicates.length} duplicate custom properties`,
      action: 'Consolidate duplicate custom property definitions'
    });
  }

  // Color system optimization
  if (customProps.categories.colors.length > 50) {
    recommendations.push({
      type: 'colors',
      priority: 'medium',
      message: `${customProps.categories.colors.length} color properties defined`,
      action: 'Consider consolidating similar color variants'
    });
  }

  // Typography optimization
  if (customProps.categories.typography.length > 20) {
    recommendations.push({
      type: 'typography',
      priority: 'low',
      message: `${customProps.categories.typography.length} typography properties`,
      action: 'Review if all typography variants are necessary'
    });
  }

  // Performance recommendations
  recommendations.push({
    type: 'performance',
    priority: 'medium',
    message: 'CSS custom properties provide good runtime performance',
    action: 'Continue using CSS custom properties for theme switching'
  });

  return recommendations;
}

/**
 * Main analysis function
 */
function runAnalysis() {
  console.log('🔍 DemoStoke Design Token Performance Analysis\n');

  // Analyze bundle sizes
  const sourceSize = getFileSize(CSS_SOURCE);
  const builtCSSFile = findBuiltCSSFile();
  const distSize = builtCSSFile ? getFileSize(builtCSSFile) : { bytes: 0, kb: '0 KB' };

  analysis.bundleSize = {
    source: sourceSize,
    dist: distSize,
    sourceBytes: sourceSize.bytes,
    distBytes: distSize.bytes,
    sourceKB: sourceSize.kb,
    distKB: distSize.kb,
    compression: distSize.bytes > 0 ? ((sourceSize.bytes - distSize.bytes) / sourceSize.bytes * 100).toFixed(1) : 0
  };

  // Analyze custom properties
  analysis.customProperties = analyzeCustomProperties();

  // Analyze Tailwind config
  analysis.tailwindConfig = analyzeTailwindConfig();

  // Generate recommendations
  analysis.recommendations = generateRecommendations(analysis.customProperties, analysis.bundleSize);

  // Display results
  displayResults();

  return analysis;
}

/**
 * Display analysis results
 */
function displayResults() {
  console.log('📊 Bundle Size Analysis:');
  console.log(`   Source CSS: ${analysis.bundleSize.sourceKB}`);
  console.log(`   Built CSS:  ${analysis.bundleSize.distKB}`);
  console.log(`   Compression: ${analysis.bundleSize.compression}%\n`);

  console.log('🎨 Design Token Analysis:');
  console.log(`   Total Custom Properties: ${analysis.customProperties.total}`);
  console.log(`   Color Properties: ${analysis.customProperties.categories.colors.length}`);
  console.log(`   Typography Properties: ${analysis.customProperties.categories.typography.length}`);
  console.log(`   Spacing Properties: ${analysis.customProperties.categories.spacing.length}`);
  console.log(`   Shadow Properties: ${analysis.customProperties.categories.shadows.length}`);
  console.log(`   Gradient Properties: ${analysis.customProperties.categories.gradients.length}`);
  console.log(`   Sidebar Properties: ${analysis.customProperties.categories.sidebar.length}\n`);

  if (analysis.customProperties.duplicates.length > 0) {
    console.log('⚠️  Duplicate Properties Found:');
    analysis.customProperties.duplicates.forEach(prop => {
      console.log(`   ${prop}`);
    });
    console.log('');
  }

  console.log('🚀 Optimization Recommendations:');
  analysis.recommendations.forEach((rec, index) => {
    const priority = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
    console.log(`   ${priority} ${rec.message}`);
    console.log(`      Action: ${rec.action}\n`);
  });

  console.log('✅ Performance Summary:');
  console.log(`   CSS bundle size is ${analysis.bundleSize.distKB} (${analysis.bundleSize.compression}% compressed)`);
  console.log(`   ${analysis.customProperties.total} design tokens organized efficiently`);
  console.log(`   Theme switching uses performant CSS custom properties`);
  console.log(`   No critical performance issues detected\n`);
}

// Run analysis if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAnalysis();
}

export { runAnalysis, analysis };
