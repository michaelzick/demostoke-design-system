import { DesignSystemComponent } from "@/types/component";
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
  }
};
