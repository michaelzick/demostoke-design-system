import { toast } from "@/hooks/use-toast";

export const copyComponentCode = (componentName: string) => {
  const mockCode = `import { ${componentName} } from "@/components/ui/${componentName.toLowerCase()}";

export default function Example() {
  return (
    <${componentName}>
      Example ${componentName}
    </${componentName}>
  );
}`;

  navigator.clipboard.writeText(mockCode);
  toast({
    title: "Code copied",
    description: `${componentName} component code copied to clipboard.`,
  });
};

export const viewInStorybook = (componentName: string) => {
  const storybookUrl = `http://localhost:6006/?path=/story/ui-${componentName.toLowerCase()}--default`;
  window.open(storybookUrl, '_blank');
};

export const exportComponentSpec = (componentName: string) => {
  const spec = {
    name: componentName,
    description: `${componentName} component specification`,
    props: {
      variant: "string",
      size: "string", 
      children: "ReactNode"
    },
    examples: [`<${componentName}>Example</${componentName}>`]
  };

  const blob = new Blob([JSON.stringify(spec, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${componentName.toLowerCase()}-spec.json`;
  link.click();
  URL.revokeObjectURL(url);

  toast({
    title: "Spec exported",
    description: `${componentName} specification downloaded.`,
  });
};