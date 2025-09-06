import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    { name: "Primary", value: "hsl(var(--primary))", css: "--primary", hex: "#3b82f6" },
    { name: "Secondary", value: "hsl(var(--secondary))", css: "--secondary", hex: "#6b7280" },
    { name: "Accent", value: "hsl(var(--accent))", css: "--accent", hex: "#f59e0b" },
    { name: "Background", value: "hsl(var(--background))", css: "--background", hex: "#ffffff" },
    { name: "Foreground", value: "hsl(var(--foreground))", css: "--foreground", hex: "#0f172a" },
  ];

  const typographyTokens = [
    { name: "Display Large", value: "text-display-lg", fontSize: "4rem", lineHeight: "1.1" },
    { name: "Display Medium", value: "text-display-md", fontSize: "3rem", lineHeight: "1.2" },
    { name: "Heading Large", value: "text-heading-lg", fontSize: "2rem", lineHeight: "1.3" },
    { name: "Heading Medium", value: "text-heading-md", fontSize: "1.5rem", lineHeight: "1.4" },
    { name: "Body Large", value: "text-body-lg", fontSize: "1.125rem", lineHeight: "1.6" },
    { name: "Body Medium", value: "text-body-md", fontSize: "1rem", lineHeight: "1.5" },
  ];

  const spacingTokens = [
    { name: "Space 1", value: "4px", class: "space-1" },
    { name: "Space 2", value: "8px", class: "space-2" },
    { name: "Space 3", value: "12px", class: "space-3" },
    { name: "Space 4", value: "16px", class: "space-4" },
    { name: "Space 6", value: "24px", class: "space-6" },
    { name: "Space 8", value: "32px", class: "space-8" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-display-md">Design Tokens</h1>
        <p className="text-body-lg text-muted-foreground">
          Foundational design elements for consistent styling
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {colorTokens.map((token) => (
              <div key={token.name} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{token.name}</span>
                  <div 
                    className="w-8 h-8 rounded border border-border"
                    style={{ backgroundColor: token.hex }}
                  />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
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
                  <code className="text-xs bg-muted px-2 py-1 rounded">{token.css}</code>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tailwind:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(token.value)}
                      className="h-auto p-1"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <code className="text-xs bg-muted px-2 py-1 rounded">{token.value}</code>
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

      {/* Spacing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid className="h-5 w-5" />
            Spacing Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {spacingTokens.map((token) => (
              <div key={token.name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">{token.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(token.class)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="bg-primary"
                    style={{ width: token.value, height: '16px' }}
                  />
                  <span className="text-sm text-muted-foreground">{token.value}</span>
                </div>
                <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">{token.class}</code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}