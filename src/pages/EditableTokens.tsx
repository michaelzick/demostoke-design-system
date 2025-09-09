import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, Palette, Type, SquareStack } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { designSystemSettingsService } from "@/services/designSystemSettingsService";

export default function EditableTokens() {
  const { toast } = useToast();
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    primaryColor: "#3b82f6",
    secondaryColor: "#6b7280", 
    accentColor: "#f59e0b",
    successColor: "#10b981",
    fontFamily: "inter",
    baseFontSize: "16",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const userSettings = await designSystemSettingsService.getCurrentSettings();
      if (userSettings) {
        setSettings({
          primaryColor: userSettings.primary_color,
          secondaryColor: userSettings.secondary_color,
          accentColor: userSettings.accent_color,
          successColor: userSettings.success_color,
          fontFamily: userSettings.font_family,
          baseFontSize: userSettings.base_font_size,
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedItem(value);
      setTimeout(() => setCopiedItem(null), 2000);
      toast({
        title: "Copied to clipboard",
        description: `"${value}" has been copied to your clipboard.`,
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const updateToken = async (key: string, value: string) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    try {
      await designSystemSettingsService.updateSettings({
        primary_color: newSettings.primaryColor,
        secondary_color: newSettings.secondaryColor,
        accent_color: newSettings.accentColor,
        success_color: newSettings.successColor,
        font_family: newSettings.fontFamily,
        base_font_size: newSettings.baseFontSize,
      });

      // Trigger settings update event
      localStorage.setItem('design-system-settings-updated', Date.now().toString());
      window.dispatchEvent(new StorageEvent('storage', { key: 'design-system-settings-updated' }));
    } catch (error) {
      console.error('Error updating token:', error);
    }
  };

  const colorTokens = [
    {
      name: "Primary",
      cssVar: "--primary",
      value: settings.primaryColor,
      key: "primaryColor",
      description: "Main brand color for primary actions"
    },
    {
      name: "Secondary", 
      cssVar: "--secondary",
      value: settings.secondaryColor,
      key: "secondaryColor",
      description: "Secondary color for supporting elements"
    },
    {
      name: "Accent",
      cssVar: "--accent", 
      value: settings.accentColor,
      key: "accentColor",
      description: "Accent color for highlights and CTAs"
    },
    {
      name: "Success",
      cssVar: "--success",
      value: settings.successColor,
      key: "successColor", 
      description: "Success state and positive feedback"
    }
  ];

  const typographyTokens = [
    {
      name: "Font Family",
      cssVar: "--font-sans",
      value: settings.fontFamily,
      key: "fontFamily",
      description: "Primary font family for the design system"
    },
    {
      name: "Base Font Size",
      cssVar: "--font-size-body-md",
      value: `${settings.baseFontSize}px`,
      key: "baseFontSize",
      description: "Base font size for body text"
    }
  ];

  const spacingTokens = [
    { name: "Extra Small", value: "0.25rem", cssVar: "--spacing-xs", description: "4px spacing" },
    { name: "Small", value: "0.5rem", cssVar: "--spacing-sm", description: "8px spacing" },
    { name: "Medium", value: "1rem", cssVar: "--spacing-md", description: "16px spacing" },
    { name: "Large", value: "1.5rem", cssVar: "--spacing-lg", description: "24px spacing" },
    { name: "Extra Large", value: "2rem", cssVar: "--spacing-xl", description: "32px spacing" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-display-md font-display">Design Tokens</h1>
        <p className="text-body-lg text-muted-foreground">
          View and edit your design system tokens. Changes are applied instantly.
        </p>
      </div>

      {/* Color Tokens */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {colorTokens.map((token) => (
              <div key={token.name} className="space-y-3 p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-heading-sm font-medium">{token.name}</h3>
                    <p className="text-body-sm text-muted-foreground">{token.description}</p>
                  </div>
                  <div 
                    className="w-12 h-12 rounded-lg border border-border" 
                    style={{ backgroundColor: token.value }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Hex Value</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={token.value}
                      onChange={(e) => updateToken(token.key, e.target.value)}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={token.value}
                      onChange={(e) => updateToken(token.key, e.target.value)}
                      className="font-mono"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(token.value)}
                    >
                      {copiedItem === token.value ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-body-sm text-muted-foreground">CSS Variable</p>
                  <div className="flex items-center gap-2">
                    <code className="text-code bg-muted px-2 py-1 rounded text-sm">{token.cssVar}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(`var(${token.cssVar})`)}
                    >
                      {copiedItem === `var(${token.cssVar})` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Typography Tokens */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Typography Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {typographyTokens.map((token) => (
              <div key={token.name} className="space-y-3 p-4 border border-border rounded-lg">
                <div>
                  <h3 className="text-heading-sm font-medium">{token.name}</h3>
                  <p className="text-body-sm text-muted-foreground">{token.description}</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Value</Label>
                  <div className="flex gap-2">
                    {token.key === 'fontFamily' ? (
                      <select
                        value={token.value}
                        onChange={(e) => updateToken(token.key, e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="inter">Inter</option>
                        <option value="tahoma">Tahoma</option>
                        <option value="roboto">Roboto</option>
                        <option value="system">System</option>
                      </select>
                    ) : (
                      <Input
                        value={token.key === 'baseFontSize' ? settings.baseFontSize : token.value}
                        onChange={(e) => updateToken(token.key, e.target.value)}
                        className="font-mono"
                      />
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(token.value)}
                    >
                      {copiedItem === token.value ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-body-sm text-muted-foreground">CSS Variable</p>
                  <div className="flex items-center gap-2">
                    <code className="text-code bg-muted px-2 py-1 rounded text-sm">{token.cssVar}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(`var(${token.cssVar})`)}
                    >
                      {copiedItem === `var(${token.cssVar})` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Spacing Tokens */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SquareStack className="h-5 w-5" />
            Spacing Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {spacingTokens.map((token) => (
              <div key={token.name} className="space-y-3 p-4 border border-border rounded-lg">
                <div>
                  <h3 className="text-heading-sm font-medium">{token.name}</h3>
                  <p className="text-body-sm text-muted-foreground">{token.description}</p>
                </div>
                
                <div className="space-y-2">
                  <div 
                    className="bg-primary rounded h-4"
                    style={{ width: token.value }}
                  />
                  <p className="text-body-sm font-mono">{token.value}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <code className="text-code bg-muted px-2 py-1 rounded text-sm flex-1">{token.cssVar}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(`var(${token.cssVar})`)}
                  >
                    {copiedItem === `var(${token.cssVar})` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}