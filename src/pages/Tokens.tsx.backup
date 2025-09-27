import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Palette, Type, Grid, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Tokens() {
  const { toast } = useToast();

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied to clipboard",
      description: `Token value: ${value}`,
    });
  };

  const colorTokens = [
    {
      name: "Primary",
      value: "hsl(var(--primary))",
      css: "--primary",
      lightHsl: "186 100% 48%",
      darkHsl: "199 89% 48%",
      description: "DemoStoke Cyan Blue - Main brand color"
    },
    {
      name: "Secondary",
      value: "hsl(var(--secondary))",
      css: "--secondary",
      lightHsl: "39 71% 84%",
      darkHsl: "39 30% 76%",
      description: "DemoStoke Warm Yellow - Secondary brand color"
    },
    {
      name: "Accent",
      value: "hsl(var(--accent))",
      css: "--accent",
      lightHsl: "210 40% 96.1%",
      darkHsl: "217.2 32.6% 17.5%",
      description: "Neutral Gray - Subtle accent color"
    },
    {
      name: "Background",
      value: "hsl(var(--background))",
      css: "--background",
      lightHsl: "0 0% 100%",
      darkHsl: "222.2 84% 4.9%",
      description: "Main background color"
    },
    {
      name: "Foreground",
      value: "hsl(var(--foreground))",
      css: "--foreground",
      lightHsl: "222.2 84% 4.9%",
      darkHsl: "210 40% 98%",
      description: "Main text color"
    },
    {
      name: "Muted",
      value: "hsl(var(--muted))",
      css: "--muted",
      lightHsl: "210 40% 96.1%",
      darkHsl: "217.2 32.6% 17.5%",
      description: "Muted background for cards and surfaces"
    },
    {
      name: "Border",
      value: "hsl(var(--border))",
      css: "--border",
      lightHsl: "214.3 31.8% 91.4%",
      darkHsl: "217.2 32.6% 17.5%",
      description: "Border color for components"
    },
    {
      name: "Ring",
      value: "hsl(var(--ring))",
      css: "--ring",
      lightHsl: "199 89% 48%",
      darkHsl: "224.3 76.3% 48%",
      description: "Focus ring color for accessibility"
    },
    {
      name: "Destructive",
      value: "hsl(var(--destructive))",
      css: "--destructive",
      lightHsl: "0 84.2% 60.2%",
      darkHsl: "0 62.8% 30.6%",
      description: "Error and destructive actions"
    },
    {
      name: "Success",
      value: "hsl(var(--success))",
      css: "--success",
      lightHsl: "142 70% 45%",
      darkHsl: "142 70% 50%",
      description: "Success and positive actions"
    },
    {
      name: "Warning",
      value: "hsl(var(--warning))",
      css: "--warning",
      lightHsl: "38 95% 55%",
      darkHsl: "38 90% 60%",
      description: "Warning and caution states"
    },
  ];

  const typographyTokens = [
    { name: "Display Large", value: "text-display-lg", fontSize: "3.5rem (56px)", lineHeight: "1.2" },
    { name: "Display Medium", value: "text-display-md", fontSize: "2.75rem (44px)", lineHeight: "1.2" },
    { name: "Display Small", value: "text-display-sm", fontSize: "2.25rem (36px)", lineHeight: "1.2" },
    { name: "Heading Large", value: "text-heading-lg", fontSize: "1.875rem (30px)", lineHeight: "1.2" },
    { name: "Heading Medium", value: "text-heading-md", fontSize: "1.5rem (24px)", lineHeight: "1.2" },
    { name: "Heading Small", value: "text-heading-sm", fontSize: "1.25rem (20px)", lineHeight: "1.5" },
    { name: "Body Large", value: "text-body-lg", fontSize: "1.125rem (18px)", lineHeight: "1.75" },
    { name: "Body Medium", value: "text-body-md", fontSize: "1rem (16px)", lineHeight: "1.5" },
    { name: "Body Small", value: "text-body-sm", fontSize: "0.875rem (14px)", lineHeight: "1.5" },
    { name: "Caption", value: "text-caption", fontSize: "0.75rem (12px)", lineHeight: "1.5" },
  ];

  const spacingTokens = [
    { name: "Extra Small", value: "4px", class: "space-xs", css: "--spacing-xs", description: "Minimal spacing" },
    { name: "Small", value: "8px", class: "space-sm", css: "--spacing-sm", description: "Small spacing" },
    { name: "Medium", value: "16px", class: "space-md", css: "--spacing-md", description: "Default spacing" },
    { name: "Large", value: "24px", class: "space-lg", css: "--spacing-lg", description: "Large spacing" },
    { name: "Extra Large", value: "32px", class: "space-xl", css: "--spacing-xl", description: "Extra large spacing" },
    { name: "2X Large", value: "48px", class: "space-2xl", css: "--spacing-2xl", description: "Section spacing" },
    { name: "3X Large", value: "64px", class: "space-3xl", css: "--spacing-3xl", description: "Large sections" },
    { name: "4X Large", value: "96px", class: "space-4xl", css: "--spacing-4xl", description: "Hero sections" },
  ];

  const sidebarTokens = [
    {
      name: "Sidebar Background",
      css: "--sidebar-background",
      lightHsl: "0 0% 98%",
      darkHsl: "240 5.9% 10%",
      description: "Main sidebar background"
    },
    {
      name: "Sidebar Foreground",
      css: "--sidebar-foreground",
      lightHsl: "240 5.3% 26.1%",
      darkHsl: "240 4.8% 95.9%",
      description: "Sidebar text color"
    },
    {
      name: "Sidebar Primary",
      css: "--sidebar-primary",
      lightHsl: "240 5.9% 10%",
      darkHsl: "224.3 76.3% 48%",
      description: "Sidebar primary elements"
    },
    {
      name: "Sidebar Accent",
      css: "--sidebar-accent",
      lightHsl: "240 4.8% 95.9%",
      darkHsl: "240 3.7% 15.9%",
      description: "Sidebar accent elements"
    },
    {
      name: "Sidebar Border",
      css: "--sidebar-border",
      lightHsl: "220 13% 91%",
      darkHsl: "240 3.7% 15.9%",
      description: "Sidebar borders and dividers"
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-display-md">DemoStoke Design Tokens</h1>
        <p className="text-body-lg text-muted-foreground">
          Authentic DemoStoke brand colors, typography, and spacing tokens with light and dark mode values
        </p>
      </div>

      {/* Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {colorTokens.map((token) => (
              <div key={token.name} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{token.name}</span>
                    <p className="text-xs text-muted-foreground mt-1">{token.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <div
                      className="w-8 h-8 rounded border border-border"
                      style={{ backgroundColor: `hsl(${token.lightHsl})` }}
                      title="Light mode"
                    />
                    <div
                      className="w-8 h-8 rounded border border-border"
                      style={{ backgroundColor: `hsl(${token.darkHsl})` }}
                      title="Dark mode"
                    />
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-muted-foreground">CSS Variable:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(token.css)}
                        className="h-auto p-1"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <code className="text-xs bg-muted px-2 py-1 rounded block">{token.css}</code>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-muted-foreground">Light Mode HSL:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(token.lightHsl)}
                        className="h-auto p-1"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <code className="text-xs bg-muted px-2 py-1 rounded block">{token.lightHsl}</code>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-muted-foreground">Dark Mode HSL:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(token.darkHsl)}
                        className="h-auto p-1"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <code className="text-xs bg-muted px-2 py-1 rounded block">{token.darkHsl}</code>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-muted-foreground">Tailwind Usage:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(token.value)}
                        className="h-auto p-1"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <code className="text-xs bg-muted px-2 py-1 rounded block">{token.value}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Typography Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {typographyTokens.map((token) => (
              <div key={token.name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">{token.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(token.value)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className={token.value}>Sample Text</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Class: <code className="bg-muted px-1 rounded">{token.value}</code> •
                  Size: {token.fontSize} •
                  Line Height: {token.lineHeight}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sidebar Tokens */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Square className="h-5 w-5" />
            Sidebar Component Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sidebarTokens.map((token) => (
              <div key={token.name} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{token.name}</span>
                    <p className="text-xs text-muted-foreground mt-1">{token.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <div
                      className="w-8 h-8 rounded border border-border"
                      style={{ backgroundColor: `hsl(${token.lightHsl})` }}
                      title="Light mode"
                    />
                    <div
                      className="w-8 h-8 rounded border border-border"
                      style={{ backgroundColor: `hsl(${token.darkHsl})` }}
                      title="Dark mode"
                    />
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-muted-foreground">CSS Variable:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(token.css)}
                        className="h-auto p-1"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <code className="text-xs bg-muted px-2 py-1 rounded block">{token.css}</code>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-muted-foreground">Light Mode HSL:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(token.lightHsl)}
                        className="h-auto p-1"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <code className="text-xs bg-muted px-2 py-1 rounded block">{token.lightHsl}</code>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-muted-foreground">Dark Mode HSL:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(token.darkHsl)}
                        className="h-auto p-1"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <code className="text-xs bg-muted px-2 py-1 rounded block">{token.darkHsl}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Spacing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid className="h-5 w-5" />
            Spacing Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {spacingTokens.map((token) => (
              <div key={token.name} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{token.name}</span>
                    <p className="text-xs text-muted-foreground mt-1">{token.description}</p>
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">{token.value}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className="bg-primary rounded"
                    style={{ width: token.value, height: '12px' }}
                  />
                  <span className="text-xs text-muted-foreground">Visual representation</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-muted-foreground">CSS Variable:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(token.css)}
                        className="h-auto p-1"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <code className="text-xs bg-muted px-2 py-1 rounded block">{token.css}</code>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-muted-foreground">Tailwind Class:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(token.class)}
                        className="h-auto p-1"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <code className="text-xs bg-muted px-2 py-1 rounded block">{token.class}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
