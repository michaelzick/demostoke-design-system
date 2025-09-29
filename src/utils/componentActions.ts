import { toast } from "@/hooks/use-toast";

// Global state for code modal
let codeModalState: {
  setModalData: ((data: { isOpen: boolean; componentName: string; code: string }) => void) | null;
} = {
  setModalData: null
};

export const registerCodeModal = (setModalData: (data: { isOpen: boolean; componentName: string; code: string }) => void) => {
  codeModalState.setModalData = setModalData;
};

export const viewComponentCode = (componentName: string) => {
  const mockCode = `import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const ${componentName.toLowerCase()}Variants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ${componentName}Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ${componentName.toLowerCase()}Variants> {
  asChild?: boolean;
}

const ${componentName} = React.forwardRef<HTMLButtonElement, ${componentName}Props>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? "span" : "button";
    return (
      <Comp
        className={cn(${componentName.toLowerCase()}Variants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

${componentName}.displayName = "${componentName}";

export { ${componentName}, ${componentName.toLowerCase()}Variants };

// Usage Example
export default function Example() {
  return (
    <div className="flex items-center gap-4">
      <${componentName}>Default</${componentName}>
      <${componentName} variant="outline">Outline</${componentName}>
      <${componentName} variant="secondary">Secondary</${componentName}>
      <${componentName} variant="ghost">Ghost</${componentName}>
      <${componentName} size="sm">Small</${componentName}>
      <${componentName} size="lg">Large</${componentName}>
    </div>
  );
}`;

  if (codeModalState.setModalData) {
    codeModalState.setModalData({
      isOpen: true,
      componentName,
      code: mockCode
    });
  } else {
    toast({
      title: "Error",
      description: "Code modal not initialized.",
      variant: "destructive",
    });
  }
};

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