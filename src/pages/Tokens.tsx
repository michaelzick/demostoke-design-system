import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Palette, Type, Grid, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  colorTokens,
  typographyTokens,
  spacingTokens,
  radiusTokens,
} from "@/lib/designTokens";

const baseColorTokens = colorTokens.filter(
  (token) => !token.cssVariable.startsWith("--sidebar-")
);

const sidebarColorTokens = colorTokens.filter((token) =>
  token.cssVariable.startsWith("--sidebar-")
);

const tailwindUsage = (cssVariable: string) => `hsl(var(${cssVariable}))`;

const scaledWidth = (value: string) => {
  const numeric = parseFloat(value);
  if (Number.isNaN(numeric)) {
    return "48px";
  }
  // Multiply to make the visual bar easier to compare
  const multiplier = numeric < 24 ? 8 : numeric < 48 ? 4 : 2;
  return `${numeric * multiplier}px`;
};

export default function Tokens() {
  const { toast } = useToast();

  const copyToClipboard = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied to clipboard",
      description: `${label}: ${value}`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-display-md">DemoStoke Design Tokens</h1>
        <p className="text-body-lg text-muted-foreground">
          Canonical color, typography, spacing, and sidebar tokens with light and dark mode values.
        </p>
      </div>

      {/* Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Core Color Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {baseColorTokens.map((token) => (
              <div key={token.cssVariable} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{token.name}</span>
                    <p className="text-xs text-muted-foreground mt-1">{token.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <div
                      className="w-8 h-8 rounded border border-border"
                      style={{ backgroundColor: `hsl(${token.light.hsl})` }}
                      title="Light mode"
                    />
                    <div
                      className="w-8 h-8 rounded border border-border"
                      style={{ backgroundColor: `hsl(${token.dark.hsl})` }}
                      title="Dark mode"
                    />
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-muted-foreground">CSS Variable</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard("CSS variable", token.cssVariable)}
                        className="h-auto p-1"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <code className="text-xs bg-muted px-2 py-1 rounded block">
                      {token.cssVariable}
                    </code>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Light HSL</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard("Light HSL", token.light.hsl)}
                          className="h-auto p-1"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <code className="text-xs bg-muted px-2 py-1 rounded block">
                        {token.light.hsl}
                      </code>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Light HEX</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard("Light HEX", token.light.hex)}
                          className="h-auto p-1"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <code className="text-xs bg-muted px-2 py-1 rounded block">
                        {token.light.hex}
                      </code>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Dark HSL</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard("Dark HSL", token.dark.hsl)}
                          className="h-auto p-1"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <code className="text-xs bg-muted px-2 py-1 rounded block">
                        {token.dark.hsl}
                      </code>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Dark HEX</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard("Dark HEX", token.dark.hex)}
                          className="h-auto p-1"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <code className="text-xs bg-muted px-2 py-1 rounded block">
                        {token.dark.hex}
                      </code>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-muted-foreground">Tailwind Usage</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard("Tailwind", tailwindUsage(token.cssVariable))}
                        className="h-auto p-1"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <code className="text-xs bg-muted px-2 py-1 rounded block">
                      {tailwindUsage(token.cssVariable)}
                    </code>
                  </div>
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
            {sidebarColorTokens.map((token) => (
              <div key={token.cssVariable} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{token.name}</span>
                    <p className="text-xs text-muted-foreground mt-1">{token.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <div
                      className="w-8 h-8 rounded border border-border"
                      style={{ backgroundColor: `hsl(${token.light.hsl})` }}
                      title="Light mode"
                    />
                    <div
                      className="w-8 h-8 rounded border border-border"
                      style={{ backgroundColor: `hsl(${token.dark.hsl})` }}
                      title="Dark mode"
                    />
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-muted-foreground">CSS Variable</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard("CSS variable", token.cssVariable)}
                        className="h-auto p-1"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <code className="text-xs bg-muted px-2 py-1 rounded block">
                      {token.cssVariable}
                    </code>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Light HEX</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard("Light HEX", token.light.hex)}
                          className="h-auto p-1"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <code className="text-xs bg-muted px-2 py-1 rounded block">
                        {token.light.hex}
                      </code>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Dark HEX</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard("Dark HEX", token.dark.hex)}
                          className="h-auto p-1"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <code className="text-xs bg-muted px-2 py-1 rounded block">
                        {token.dark.hex}
                      </code>
                    </div>
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
              <div key={token.tailwindClass} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{token.name}</span>
                    {token.description && (
                      <p className="text-xs text-muted-foreground mt-1">{token.description}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("Tailwind class", token.tailwindClass)}
                    className="h-auto p-1"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className={`${token.tailwindClass}`}>Sample Text</div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Font Size</span>
                    <code className="bg-muted px-2 py-1 rounded">{token.fontSize}</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Line Height</span>
                    <code className="bg-muted px-2 py-1 rounded">{token.lineHeight}</code>
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
            Spacing & Radii Tokens
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Spacing Scale
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {spacingTokens.map((token) => (
                <div key={token.cssVariable} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{token.name}</span>
                      {token.description && (
                        <p className="text-xs text-muted-foreground mt-1">{token.description}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard("Spacing value", token.value)}
                      className="h-auto p-1"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className="bg-primary/70 rounded"
                      style={{ width: scaledWidth(token.value), height: "12px" }}
                    />
                    <span className="text-xs text-muted-foreground">Visual scale</span>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center justify-between">
                      <span>CSS Variable</span>
                      <code className="bg-muted px-2 py-1 rounded">{token.cssVariable}</code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tailwind Class</span>
                      <code className="bg-muted px-2 py-1 rounded">{token.tailwindClass}</code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Border Radius
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {radiusTokens.map((token) => (
                <div key={token.cssVariable} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{token.name}</span>
                      {token.description && (
                        <p className="text-xs text-muted-foreground mt-1">{token.description}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard("Radius value", token.value)}
                      className="h-auto p-1"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className="bg-primary/70 border border-border"
                      style={{ width: "48px", height: "32px", borderRadius: token.value }}
                    />
                    <span className="text-xs text-muted-foreground">Corner preview</span>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center justify-between">
                      <span>CSS Variable</span>
                      <code className="bg-muted px-2 py-1 rounded">{token.cssVariable}</code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tailwind Class</span>
                      <code className="bg-muted px-2 py-1 rounded">{token.tailwindClass}</code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
