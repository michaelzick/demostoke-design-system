import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Palette, Type, Ruler, Sun, Moon } from 'lucide-react';
import { designSystemSettingsService } from '@/services/designSystemSettingsService';
import { useToast } from '@/hooks/use-toast';

export default function EditableTokens() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>({});
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const currentSettings = await designSystemSettingsService.getCurrentSettings();
      if (currentSettings) {
        setSettings(currentSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedItem(value);
      toast({
        title: "Copied to clipboard",
        description: `${value} has been copied to your clipboard.`,
      });
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const updateToken = async (key: string, value: string) => {
    // Update local state immediately for responsive UI
    setSettings((prev: any) => ({ ...prev, [key]: value }));
    
    // Update in database
    try {
      await designSystemSettingsService.updateSettings({ [key]: value });
      
      // Trigger global settings update event
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'design-system-settings-updated',
        newValue: JSON.stringify({ [key]: value })
      }));
    } catch (error) {
      console.error('Error updating token:', error);
      toast({
        title: "Error",
        description: "Failed to save token value. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Define comprehensive token groups
  const colorTokens = [
    {
      name: 'Primary',
      variable: '--primary',
      value: settings.primary_color,
      darkValue: settings.primary_color_dark,
      key: 'primary_color',
      darkKey: 'primary_color_dark',
      description: 'Main brand color used for primary actions and highlights'
    },
    {
      name: 'Secondary',
      variable: '--secondary',
      value: settings.secondary_color,
      darkValue: settings.secondary_color_dark,
      key: 'secondary_color',
      darkKey: 'secondary_color_dark',
      description: 'Secondary color for less prominent elements'
    },
    {
      name: 'Accent',
      variable: '--accent',
      value: settings.accent_color,
      darkValue: settings.accent_color_dark,
      key: 'accent_color',
      darkKey: 'accent_color_dark',
      description: 'Accent color for special highlights and call-to-actions'
    },
    {
      name: 'Success',
      variable: '--success',
      value: settings.success_color,
      darkValue: settings.success_color_dark,
      key: 'success_color',
      darkKey: 'success_color_dark',
      description: 'Color for success states and positive feedback'
    },
    {
      name: 'Destructive',
      variable: '--destructive',
      value: settings.destructive_color,
      darkValue: settings.destructive_color_dark,
      key: 'destructive_color',
      darkKey: 'destructive_color_dark',
      description: 'Color for destructive actions and error states'
    },
    {
      name: 'Warning',
      variable: '--warning',
      value: settings.warning_color,
      darkValue: settings.warning_color_dark,
      key: 'warning_color',
      darkKey: 'warning_color_dark',
      description: 'Color for warning states and caution indicators'
    },
    {
      name: 'Background',
      variable: '--background',
      value: settings.background_color,
      darkValue: settings.background_color_dark,
      key: 'background_color',
      darkKey: 'background_color_dark',
      description: 'Primary background color'
    },
    {
      name: 'Foreground',
      variable: '--foreground',
      value: settings.foreground_color,
      darkValue: settings.foreground_color_dark,
      key: 'foreground_color',
      darkKey: 'foreground_color_dark',
      description: 'Primary text color'
    },
    {
      name: 'Muted',
      variable: '--muted',
      value: settings.muted_color,
      darkValue: settings.muted_color_dark,
      key: 'muted_color',
      darkKey: 'muted_color_dark',
      description: 'Muted background color for subtle elements'
    },
    {
      name: 'Border',
      variable: '--border',
      value: settings.border_color,
      darkValue: settings.border_color_dark,
      key: 'border_color',
      darkKey: 'border_color_dark',
      description: 'Default border color'
    },
    {
      name: 'Ring',
      variable: '--ring',
      value: settings.ring_color,
      darkValue: settings.ring_color_dark,
      key: 'ring_color',
      darkKey: 'ring_color_dark',
      description: 'Focus ring color for interactive elements'
    }
  ];

  const sidebarTokens = [
    {
      name: 'Sidebar Background',
      variable: '--sidebar-background',
      value: settings.sidebar_background,
      darkValue: settings.sidebar_background_dark,
      key: 'sidebar_background',
      darkKey: 'sidebar_background_dark',
      description: 'Background color for sidebar elements'
    },
    {
      name: 'Sidebar Foreground',
      variable: '--sidebar-foreground',
      value: settings.sidebar_foreground,
      darkValue: settings.sidebar_foreground_dark,
      key: 'sidebar_foreground',
      darkKey: 'sidebar_foreground_dark',
      description: 'Text color for sidebar elements'
    },
    {
      name: 'Sidebar Primary',
      variable: '--sidebar-primary',
      value: settings.sidebar_primary,
      darkValue: settings.sidebar_primary_dark,
      key: 'sidebar_primary',
      darkKey: 'sidebar_primary_dark',
      description: 'Primary color for sidebar elements'
    },
    {
      name: 'Sidebar Primary Foreground',
      variable: '--sidebar-primary-foreground',
      value: settings.sidebar_primary_foreground,
      darkValue: settings.sidebar_primary_foreground_dark,
      key: 'sidebar_primary_foreground',
      darkKey: 'sidebar_primary_foreground_dark',
      description: 'Text color on sidebar primary elements'
    },
    {
      name: 'Sidebar Accent',
      variable: '--sidebar-accent',
      value: settings.sidebar_accent,
      darkValue: settings.sidebar_accent_dark,
      key: 'sidebar_accent',
      darkKey: 'sidebar_accent_dark',
      description: 'Accent color for sidebar elements'
    },
    {
      name: 'Sidebar Border',
      variable: '--sidebar-border',
      value: settings.sidebar_border,
      darkValue: settings.sidebar_border_dark,
      key: 'sidebar_border',
      darkKey: 'sidebar_border_dark',
      description: 'Border color for sidebar elements'
    }
  ];

  const typographyTokens = [
    {
      name: 'Font Family',
      variable: '--font-family',
      value: settings.font_family,
      key: 'font_family',
      type: 'select',
      options: [
        { value: 'inter', label: 'Inter' },
        { value: 'tahoma', label: 'Tahoma' },
        { value: 'jetbrains-mono', label: 'JetBrains Mono' }
      ],
      description: 'Primary font family used throughout the design system'
    },
    {
      name: 'Base Font Size',
      variable: '--font-size-base',
      value: settings.base_font_size,
      key: 'base_font_size',
      type: 'text',
      description: 'Base font size in pixels for body text'
    },
    {
      name: 'Display Large',
      variable: '--font-size-display-lg',
      value: settings.font_display_lg,
      key: 'font_display_lg',
      type: 'text',
      description: 'Large display text size'
    },
    {
      name: 'Display Medium',
      variable: '--font-size-display-md',
      value: settings.font_display_md,
      key: 'font_display_md',
      type: 'text',
      description: 'Medium display text size'
    },
    {
      name: 'Display Small',
      variable: '--font-size-display-sm',
      value: settings.font_display_sm,
      key: 'font_display_sm',
      type: 'text',
      description: 'Small display text size'
    },
    {
      name: 'Heading Large',
      variable: '--font-size-heading-lg',
      value: settings.font_heading_lg,
      key: 'font_heading_lg',
      type: 'text',
      description: 'Large heading text size'
    },
    {
      name: 'Heading Medium',
      variable: '--font-size-heading-md',
      value: settings.font_heading_md,
      key: 'font_heading_md',
      type: 'text',
      description: 'Medium heading text size'
    },
    {
      name: 'Heading Small',
      variable: '--font-size-heading-sm',
      value: settings.font_heading_sm,
      key: 'font_heading_sm',
      type: 'text',
      description: 'Small heading text size'
    },
    {
      name: 'Body Large',
      variable: '--font-size-body-lg',
      value: settings.font_body_lg,
      key: 'font_body_lg',
      type: 'text',
      description: 'Large body text size'
    },
    {
      name: 'Body Medium',
      variable: '--font-size-body-md',
      value: settings.font_body_md,
      key: 'font_body_md',
      type: 'text',
      description: 'Medium body text size'
    },
    {
      name: 'Body Small',
      variable: '--font-size-body-sm',
      value: settings.font_body_sm,
      key: 'font_body_sm',
      type: 'text',
      description: 'Small body text size'
    },
    {
      name: 'Caption',
      variable: '--font-size-caption',
      value: settings.font_caption,
      key: 'font_caption',
      type: 'text',
      description: 'Caption text size'
    }
  ];

  const spacingTokens = [
    {
      name: 'Extra Small',
      variable: '--spacing-xs',
      value: settings.spacing_xs,
      key: 'spacing_xs',
      description: 'Extra small spacing'
    },
    {
      name: 'Small',
      variable: '--spacing-sm',
      value: settings.spacing_sm,
      key: 'spacing_sm',
      description: 'Small spacing'
    },
    {
      name: 'Medium',
      variable: '--spacing-md',
      value: settings.spacing_md,
      key: 'spacing_md',
      description: 'Medium spacing'
    },
    {
      name: 'Large',
      variable: '--spacing-lg',
      value: settings.spacing_lg,
      key: 'spacing_lg',
      description: 'Large spacing'
    },
    {
      name: 'Extra Large',
      variable: '--spacing-xl',
      value: settings.spacing_xl,
      key: 'spacing_xl',
      description: 'Extra large spacing'
    },
    {
      name: '2X Large',
      variable: '--spacing-2xl',
      value: settings.spacing_2xl,
      key: 'spacing_2xl',
      description: '2X large spacing'
    },
    {
      name: '3X Large',
      variable: '--spacing-3xl',
      value: settings.spacing_3xl,
      key: 'spacing_3xl',
      description: '3X large spacing'
    },
    {
      name: '4X Large',
      variable: '--spacing-4xl',
      value: settings.spacing_4xl,
      key: 'spacing_4xl',
      description: '4X large spacing'
    }
  ];

  const renderColorToken = (token: any, isDark = false) => (
    <div key={`${token.key}-${isDark ? 'dark' : 'light'}`} className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium">
            {token.name} {isDark && '(Dark)'}
          </Label>
          <p className="text-xs text-muted-foreground mt-1">{token.description}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(token.variable)}
          className="shrink-0"
        >
          <Copy className="h-3 w-3" />
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-lg border-2 border-border shrink-0"
          style={{ backgroundColor: isDark ? token.darkValue : token.value }}
        />
        <Input
          type="color"
          value={(isDark ? token.darkValue : token.value) || '#000000'}
          onChange={(e) => updateToken(isDark ? token.darkKey : token.key, e.target.value)}
          className="w-20 h-12 p-1 cursor-pointer"
        />
        <Input
          type="text"
          value={(isDark ? token.darkValue : token.value) || ''}
          onChange={(e) => updateToken(isDark ? token.darkKey : token.key, e.target.value)}
          className="font-mono text-sm"
          placeholder="#000000"
        />
      </div>
      <div className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded">
        {token.variable}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Design Tokens</h1>
        <p className="text-muted-foreground">
          Edit and customize your design system tokens. Changes are saved automatically and applied to the entire system.
        </p>
      </div>

      <Tabs defaultValue="colors" className="space-y-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="sidebar" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Sidebar
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Typography
          </TabsTrigger>
          <TabsTrigger value="spacing" className="flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            Spacing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors">
          <Card>
            <CardHeader>
              <CardTitle>Color Tokens</CardTitle>
              <CardDescription>
                Define your brand colors for both light and dark themes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="light" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="light" className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Light Mode
                  </TabsTrigger>
                  <TabsTrigger value="dark" className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Dark Mode
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="light" className="space-y-6">
                  {colorTokens.map((token) => renderColorToken(token, false))}
                </TabsContent>
                
                <TabsContent value="dark" className="space-y-6">
                  {colorTokens.map((token) => renderColorToken(token, true))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sidebar">
          <Card>
            <CardHeader>
              <CardTitle>Sidebar Tokens</CardTitle>
              <CardDescription>
                Configure sidebar-specific colors for both light and dark themes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="light" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="light" className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Light Mode
                  </TabsTrigger>
                  <TabsTrigger value="dark" className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Dark Mode
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="light" className="space-y-6">
                  {sidebarTokens.map((token) => renderColorToken(token, false))}
                </TabsContent>
                
                <TabsContent value="dark" className="space-y-6">
                  {sidebarTokens.map((token) => renderColorToken(token, true))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography">
          <Card>
            <CardHeader>
              <CardTitle>Typography Tokens</CardTitle>
              <CardDescription>
                Configure typography scale and font settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {typographyTokens.map((token) => (
                  <div key={token.key} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">{token.name}</Label>
                        <p className="text-xs text-muted-foreground mt-1">{token.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(token.variable)}
                        className="shrink-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    {token.type === 'select' ? (
                      <Select value={token.value} onValueChange={(value) => updateToken(token.key, value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {token.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type="text"
                        value={token.value || ''}
                        onChange={(e) => updateToken(token.key, e.target.value)}
                        className="font-mono text-sm"
                        placeholder="1rem"
                      />
                    )}
                    <div className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded">
                      {token.variable}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spacing">
          <Card>
            <CardHeader>
              <CardTitle>Spacing Tokens</CardTitle>
              <CardDescription>
                Define the spacing scale for consistent layouts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {spacingTokens.map((token) => (
                  <div key={token.key} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">{token.name}</Label>
                        <p className="text-xs text-muted-foreground mt-1">{token.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(token.variable)}
                        className="shrink-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="bg-primary h-4 rounded shrink-0"
                        style={{ width: token.value || '1rem' }}
                      />
                      <Input
                        type="text"
                        value={token.value || ''}
                        onChange={(e) => updateToken(token.key, e.target.value)}
                        className="font-mono text-sm"
                        placeholder="1rem"
                      />
                    </div>
                    <div className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded">
                      {token.variable}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}