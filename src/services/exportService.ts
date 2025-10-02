import { DesignSystemComponent } from "@/types/component";
import { colorTokens, typographyTokens, spacingTokens, radiusTokens, ColorToken, TypographyToken, SpacingToken, RadiusToken } from "@/lib/designTokens";
import JSZip from "jszip";

export const exportService = {
  /**
   * Export components in Figma-compatible JSON format
   */
  async exportToFigma(components: DesignSystemComponent[]): Promise<Blob> {
    const zip = new JSZip();
    
    const figmaData = {
      name: "Design System Export",
      version: "1.0.0",
      components: components.map(comp => ({
        key: comp.id,
        name: comp.name,
        description: comp.description,
        category: comp.category,
        props: comp.props_schema,
        code: comp.component_code,
        tags: comp.tags,
        version: comp.version,
        metadata: {
          created_at: comp.created_at,
          updated_at: comp.updated_at,
          status: comp.status
        }
      }))
    };

    zip.file("figma-components.json", JSON.stringify(figmaData, null, 2));
    
    // Add a README for Figma import instructions
    const readme = `# Figma Component Export

This export contains ${components.length} component(s) from your design system.

## Components Included:
${components.map(c => `- ${c.name} (${c.category})`).join('\n')}

## Import Instructions:
1. Open Figma
2. Use a plugin that can import component definitions
3. Load the figma-components.json file

Note: This is a JSON representation of your components. You may need additional tools
or plugins to fully integrate these components into Figma.
`;
    
    zip.file("README.md", readme);
    
    return await zip.generateAsync({ type: "blob" });
  },

  /**
   * Export components as JavaScript React components
   */
  async exportToJS(components: DesignSystemComponent[]): Promise<Blob> {
    const zip = new JSZip();
    const componentsFolder = zip.folder("components");
    
    if (!componentsFolder) {
      throw new Error("Failed to create components folder");
    }

    for (const component of components) {
      // Convert TypeScript to JavaScript
      let jsCode = this.convertTStoJS(component.component_code);
      
      // Add component metadata as comment
      const header = `/**
 * ${component.name}
 * ${component.description}
 * Category: ${component.category}
 * 
 * Generated from Design System
 */

`;
      jsCode = header + jsCode;
      
      componentsFolder.file(`${component.name}.jsx`, jsCode);
    }

    // Add package.json
    const packageJson = {
      name: "design-system-components",
      version: "1.0.0",
      description: "Exported components from design system",
      type: "module",
      dependencies: {
        "react": "^18.0.0",
        "react-dom": "^18.0.0"
      }
    };
    
    zip.file("package.json", JSON.stringify(packageJson, null, 2));

    // Add README
    const readme = `# Design System Components Export (JavaScript)

This export contains ${components.length} React component(s) in JavaScript format.

## Components:
${components.map(c => `- **${c.name}**: ${c.description}`).join('\n')}

## Installation:
\`\`\`bash
npm install
\`\`\`

## Usage:
\`\`\`javascript
import { Button } from './components/Button';

function App() {
  return <Button>Click me</Button>;
}
\`\`\`
`;
    
    zip.file("README.md", readme);
    
    return await zip.generateAsync({ type: "blob" });
  },

  /**
   * Export components as TypeScript React components
   */
  async exportToTSX(components: DesignSystemComponent[]): Promise<Blob> {
    const zip = new JSZip();
    const componentsFolder = zip.folder("components");
    const typesFolder = zip.folder("types");
    
    if (!componentsFolder || !typesFolder) {
      throw new Error("Failed to create folders");
    }

    for (const component of components) {
      // Add component metadata as comment
      const header = `/**
 * ${component.name}
 * ${component.description}
 * Category: ${component.category}
 * 
 * Generated from Design System
 */

`;
      const tsxCode = header + component.component_code;
      
      componentsFolder.file(`${component.name}.tsx`, tsxCode);
      
      // Generate type definitions from props_schema
      if (component.props_schema && Object.keys(component.props_schema).length > 0) {
        const propsInterface = this.generatePropsInterface(component.name, component.props_schema);
        typesFolder.file(`${component.name}.types.ts`, propsInterface);
      }
    }

    // Add index.ts for easy imports
    const indexContent = components.map(c => 
      `export { default as ${c.name} } from './components/${c.name}';`
    ).join('\n');
    zip.file("index.ts", indexContent);

    // Add package.json
    const packageJson = {
      name: "design-system-components",
      version: "1.0.0",
      description: "Exported components from design system",
      type: "module",
      dependencies: {
        "react": "^18.0.0",
        "react-dom": "^18.0.0"
      },
      devDependencies: {
        "@types/react": "^18.0.0",
        "@types/react-dom": "^18.0.0",
        "typescript": "^5.0.0"
      }
    };
    
    zip.file("package.json", JSON.stringify(packageJson, null, 2));

    // Add tsconfig.json
    const tsConfig = {
      compilerOptions: {
        target: "ES2020",
        useDefineForClassFields: true,
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        module: "ESNext",
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "react-jsx",
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true
      },
      include: ["components", "types"],
      references: [{ path: "./tsconfig.node.json" }]
    };
    
    zip.file("tsconfig.json", JSON.stringify(tsConfig, null, 2));

    // Add README
    const readme = `# Design System Components Export (TypeScript)

This export contains ${components.length} React component(s) in TypeScript format.

## Components:
${components.map(c => `- **${c.name}**: ${c.description}`).join('\n')}

## Installation:
\`\`\`bash
npm install
\`\`\`

## Usage:
\`\`\`typescript
import { Button } from './components/Button';

function App() {
  return <Button>Click me</Button>;
}
\`\`\`

## Type Safety:
All components include full TypeScript type definitions for props and interfaces.
`;
    
    zip.file("README.md", readme);
    
    return await zip.generateAsync({ type: "blob" });
  },

  /**
   * Convert TypeScript code to JavaScript
   */
  convertTStoJS(tsCode: string): string {
    // Simple conversion - remove type annotations
    let jsCode = tsCode;
    
    // Remove type imports
    jsCode = jsCode.replace(/import\s+type\s+\{[^}]+\}\s+from\s+['"][^'"]+['"];?\s*/g, '');
    
    // Remove interface definitions
    jsCode = jsCode.replace(/interface\s+\w+\s*\{[^}]*\}/g, '');
    jsCode = jsCode.replace(/type\s+\w+\s*=\s*[^;]+;/g, '');
    
    // Remove type annotations from parameters
    jsCode = jsCode.replace(/(\w+)\s*:\s*[^,)=]+/g, '$1');
    
    // Remove return type annotations
    jsCode = jsCode.replace(/\)\s*:\s*\w+\s*=>/g, ') =>');
    jsCode = jsCode.replace(/\)\s*:\s*JSX\.Element\s*\{/g, ') {');
    
    // Remove generic type parameters
    jsCode = jsCode.replace(/<[^>]+>/g, '');
    
    // Remove 'as' type assertions
    jsCode = jsCode.replace(/\s+as\s+\w+/g, '');
    
    // Change .tsx extensions to .jsx in imports
    jsCode = jsCode.replace(/from\s+['"](.+)\.tsx['"]/g, 'from \'$1.jsx\'');
    
    // Remove empty lines
    jsCode = jsCode.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    return jsCode.trim();
  },

  /**
   * Generate TypeScript interface from props schema
   */
  generatePropsInterface(componentName: string, propsSchema: any): string {
    const interfaceName = `${componentName}Props`;
    
    const props = Object.entries(propsSchema).map(([propName, propDef]: [string, any]) => {
      const optional = propDef.required ? '' : '?';
      let type = propDef.type || 'any';
      
      // Map common types
      if (type === 'array' && propDef.options) {
        type = `Array<${propDef.options.map((o: string) => `'${o}'`).join(' | ')}>`;
      } else if (propDef.options) {
        type = propDef.options.map((o: string) => `'${o}'`).join(' | ');
      }
      
      const comment = propDef.description ? `  /** ${propDef.description} */\n` : '';
      
      return `${comment}  ${propName}${optional}: ${type};`;
    }).join('\n');

    return `export interface ${interfaceName} {
${props}
}
`;
  },

  /**
   * Download blob as file
   */
  downloadFile(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Get base color tokens (excluding sidebar)
   */
  getBaseColorTokens(): ColorToken[] {
    return colorTokens.filter(token => !token.cssVariable.includes('sidebar'));
  },

  /**
   * Get sidebar color tokens
   */
  getSidebarColorTokens(): ColorToken[] {
    return colorTokens.filter(token => token.cssVariable.includes('sidebar'));
  },

  /**
   * Get tokens by category
   */
  getTokensByCategory(category: string): Array<ColorToken | TypographyToken | SpacingToken | RadiusToken> {
    switch (category) {
      case 'colors':
        return this.getBaseColorTokens();
      case 'sidebar':
        return this.getSidebarColorTokens();
      case 'typography':
        return typographyTokens;
      case 'spacing':
        return [...spacingTokens, ...radiusTokens];
      default:
        return [];
    }
  },

  /**
   * Convert hex to RGB object (0-1 range for Figma)
   */
  hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
      return { r: 0, g: 0, b: 0 };
    }
    return {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255,
    };
  },

  /**
   * Convert px to rem
   */
  pxToRem(px: string): string {
    const value = parseFloat(px.replace('px', ''));
    return `${value / 16}rem`;
  },

  /**
   * Export design tokens to Figma Variable Collection format
   */
  async exportTokensToFigmaVariables(categories: string[]): Promise<Blob> {
    const zip = new JSZip();

    categories.forEach(category => {
      const tokens = this.getTokensByCategory(category);
      
      if (category === 'colors' || category === 'sidebar') {
        const colorCollection = {
          name: category === 'colors' ? 'Colors' : 'Sidebar',
          modes: {
            light: 'Light Mode',
            dark: 'Dark Mode',
          },
          variables: (tokens as ColorToken[]).map(token => ({
            name: token.name,
            type: 'COLOR',
            valuesByMode: {
              light: this.hexToRgb(token.light.hex),
              dark: this.hexToRgb(token.dark.hex),
            },
          })),
          version: '1.0.0',
          generatedAt: new Date().toISOString(),
        };
        
        zip.file(`${category}-variables.json`, JSON.stringify(colorCollection, null, 2));
        
      } else if (category === 'typography') {
        const typCollection = {
          name: 'Typography',
          modes: {
            default: 'Default',
          },
          variables: (tokens as TypographyToken[]).map(token => ({
            name: token.name,
            type: 'FLOAT',
            valuesByMode: {
              default: parseFloat(token.fontSize.replace(/[^0-9.]/g, '')) || 16,
            },
            metadata: {
              fontSize: token.fontSize,
              lineHeight: token.lineHeight,
            },
          })),
          version: '1.0.0',
          generatedAt: new Date().toISOString(),
        };
        
        zip.file('typography-variables.json', JSON.stringify(typCollection, null, 2));
        
      } else if (category === 'spacing') {
        const spacingCollection = {
          name: 'Spacing',
          modes: {
            default: 'Default',
          },
          variables: (tokens as Array<SpacingToken | RadiusToken>).map(token => ({
            name: token.name,
            type: 'FLOAT',
            valuesByMode: {
              default: parseFloat(token.value.replace(/[^0-9.]/g, '')) || 0,
            },
          })),
          version: '1.0.0',
          generatedAt: new Date().toISOString(),
        };
        
        zip.file('spacing-variables.json', JSON.stringify(spacingCollection, null, 2));
      }
    });

    const readme = `# Design System Tokens - Figma Variable Collection

Import these tokens into Figma using the Variables feature.

## Import Instructions:
1. Open Figma
2. Go to Local Variables (⌥ ⌘ K on Mac, Ctrl Alt K on Windows)
3. Click the import button
4. Import each category file separately:
${categories.map(cat => `   - ${cat}-variables.json`).join('\n')}
5. Map the variable collections to your design

## Included Files:
${categories.map(cat => `- ${cat}-variables.json`).join('\n')}

Each file contains a complete Figma variable collection for that category.

Generated: ${new Date().toLocaleString()}
`;

    zip.file('README.md', readme);

    return await zip.generateAsync({ type: 'blob' });
  },

  /**
   * Export design tokens to simple JSON format
   */
  async exportTokensToFigmaSimple(categories: string[]): Promise<Blob> {
    const zip = new JSZip();

    categories.forEach(category => {
      const tokens = this.getTokensByCategory(category);
      let jsonData: any = {};

      if (category === 'colors' || category === 'sidebar') {
        (tokens as ColorToken[]).forEach(token => {
          const key = token.name.toLowerCase().replace(/\s+/g, '-');
          jsonData[key] = {
            light: token.light.hex,
            dark: token.dark.hex,
          };
        });
        zip.file(`${category}.json`, JSON.stringify(jsonData, null, 2));
      } else if (category === 'typography') {
        (tokens as TypographyToken[]).forEach(token => {
          const key = token.name.toLowerCase().replace(/\s+/g, '-');
          jsonData[key] = {
            fontSize: token.fontSize,
            lineHeight: token.lineHeight,
          };
        });
        zip.file('typography.json', JSON.stringify(jsonData, null, 2));
      } else if (category === 'spacing') {
        (tokens as Array<SpacingToken | RadiusToken>).forEach(token => {
          const key = token.name.toLowerCase().replace(/\s+/g, '-');
          jsonData[key] = token.value;
        });
        zip.file('spacing.json', JSON.stringify(jsonData, null, 2));
      }
    });

    const readme = `# Design System Tokens - Simple JSON

Easy-to-parse JSON format for custom integrations.

## Usage:
Import individual category files:

\`\`\`javascript
import colors from './colors.json';
import typography from './typography.json';
import spacing from './spacing.json';
\`\`\`

## Included Files:
${categories.map(cat => `- ${cat}.json`).join('\n')}

## Format Examples:

**Colors:**
\`\`\`json
{
  "primary": {
    "light": "#00dcf5",
    "dark": "#0da2e7"
  }
}
\`\`\`

**Typography:**
\`\`\`json
{
  "display-large": {
    "fontSize": "3.5rem (56px)",
    "lineHeight": "1.2"
  }
}
\`\`\`

**Spacing:**
\`\`\`json
{
  "medium": "16px",
  "large": "24px"
}
\`\`\`

Generated: ${new Date().toLocaleString()}
`;

    zip.file('README.md', readme);

    return await zip.generateAsync({ type: 'blob' });
  },

  /**
   * Export design tokens to CSS format
   */
  async exportTokensToCSS(
    categories: string[],
    darkModeOptions: { classSelector: boolean; mediaQuery: boolean }
  ): Promise<Blob> {
    const zip = new JSZip();

    categories.forEach(category => {
      const tokens = this.getTokensByCategory(category);
      let cssContent = '';

      if (category === 'colors' || category === 'sidebar') {
        // Light mode
        cssContent += `/* ${category.charAt(0).toUpperCase() + category.slice(1)} - Light Mode */\n`;
        cssContent += ':root {\n';
        (tokens as ColorToken[]).forEach(token => {
          cssContent += `  ${token.cssVariable}: ${token.light.hsl};\n`;
        });
        cssContent += '}\n\n';

        // Dark mode - class selector
        if (darkModeOptions.classSelector) {
          cssContent += `/* Dark Mode - Class Selector */\n`;
          cssContent += '.dark {\n';
          (tokens as ColorToken[]).forEach(token => {
            cssContent += `  ${token.cssVariable}: ${token.dark.hsl};\n`;
          });
          cssContent += '}\n\n';
        }

        // Dark mode - media query
        if (darkModeOptions.mediaQuery) {
          cssContent += `/* Dark Mode - Media Query */\n`;
          cssContent += '@media (prefers-color-scheme: dark) {\n';
          cssContent += '  :root {\n';
          (tokens as ColorToken[]).forEach(token => {
            cssContent += `    ${token.cssVariable}: ${token.dark.hsl};\n`;
          });
          cssContent += '  }\n';
          cssContent += '}\n';
        }

        zip.file(`${category}.css`, cssContent);
      } else if (category === 'typography') {
        cssContent += `/* Typography Tokens */\n`;
        cssContent += ':root {\n';
        (tokens as TypographyToken[]).forEach(token => {
          const varName = token.name.toLowerCase().replace(/\s+/g, '-');
          const fontSize = token.fontSize.split('(')[0].trim();
          cssContent += `  --font-${varName}: ${fontSize};\n`;
          cssContent += `  --line-height-${varName}: ${token.lineHeight};\n`;
        });
        cssContent += '}\n';

        zip.file('typography.css', cssContent);
      } else if (category === 'spacing') {
        cssContent += `/* Spacing & Radius Tokens */\n`;
        cssContent += ':root {\n';
        (tokens as Array<SpacingToken | RadiusToken>).forEach(token => {
          cssContent += `  ${token.cssVariable}: ${token.value};\n`;
        });
        cssContent += '}\n';

        zip.file('spacing.css', cssContent);
      }
    });

    const darkModeDescription = darkModeOptions.classSelector && darkModeOptions.mediaQuery
      ? 'Both `.dark` class selector and `@media (prefers-color-scheme: dark)` are included.'
      : darkModeOptions.classSelector
      ? 'Dark mode uses `.dark` class selector.'
      : darkModeOptions.mediaQuery
      ? 'Dark mode uses `@media (prefers-color-scheme: dark)` query.'
      : 'Light mode only.';

    const readme = `# Design System Tokens - CSS Variables

Ready-to-use CSS custom properties.

## Usage:
Import in your main CSS file:

\`\`\`css
@import './colors.css';
@import './typography.css';
@import './spacing.css';
\`\`\`

Or in JavaScript/TypeScript:

\`\`\`javascript
import './tokens/colors.css';
import './tokens/typography.css';
import './tokens/spacing.css';
\`\`\`

## Dark Mode:
${darkModeDescription}

## Included Files:
${categories.map(cat => `- ${cat}.css`).join('\n')}

## Usage Example:

\`\`\`css
.my-component {
  background-color: hsl(var(--primary));
  font-size: var(--font-heading-large);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
}
\`\`\`

Generated: ${new Date().toLocaleString()}
`;

    zip.file('README.md', readme);

    return await zip.generateAsync({ type: 'blob' });
  },
};
