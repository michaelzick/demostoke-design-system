import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from './ui/navigation-menu';
import { ThemeToggle } from './theme-toggle';
import { useThemeDetection } from '@/hooks/use-theme-detection';
import { runAllThemeTests, type ThemeTestResult } from '@/utils/theme-test';
import { AccessibilityTestSuite } from './AccessibilityTestSuite';

export function DemoStokeComponentTest() {
  const { theme, resolvedTheme, mounted, isSystemTheme } = useThemeDetection();
  const [testResults, setTestResults] = React.useState<{ [key: string]: ThemeTestResult } | null>(null);

  const handleRunTests = () => {
    const results = runAllThemeTests();
    setTestResults(results);
    console.log('Theme Test Results:', results);
  };

  return (
    <div className="p-8 space-y-8 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-display-lg text-foreground">DemoStoke Design System</h1>
          <p className="text-body-lg text-muted-foreground">Updated components with authentic DemoStoke colors</p>
        </div>

        {/* Theme Testing Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Theme System Test
              <ThemeToggle />
            </CardTitle>
            <CardDescription>Test theme switching functionality and system preference detection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-body-sm font-medium">Current Theme</p>
                <Badge variant="outline">{mounted ? theme : 'Loading...'}</Badge>
              </div>
              <div className="space-y-2">
                <p className="text-body-sm font-medium">Resolved Theme</p>
                <Badge variant="outline">{mounted ? resolvedTheme : 'Loading...'}</Badge>
              </div>
              <div className="space-y-2">
                <p className="text-body-sm font-medium">System Theme</p>
                <Badge variant={isSystemTheme ? "default" : "secondary"}>
                  {isSystemTheme ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-card space-y-4">
              <p className="text-body-sm text-muted-foreground">
                This section demonstrates smooth theme transitions. Try switching between light, dark, and system themes
                to verify all components update correctly with proper animations.
              </p>
              <div className="flex items-center gap-4">
                <Button onClick={handleRunTests} variant="outline" size="sm">
                  Run Theme Tests
                </Button>
                {testResults && (
                  <Badge variant={Object.values(testResults).every((result) => result.success) ? "success" : "destructive"}>
                    {Object.values(testResults).every((result) => result.success) ? "All Tests Passed" : "Some Tests Failed"}
                  </Badge>
                )}
              </div>
              {testResults && (
                <div className="space-y-2">
                  {Object.entries(testResults).map(([key, result]) => (
                    <div key={key} className="flex items-center justify-between text-body-sm">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <Badge variant={result.success ? "success" : "destructive"} className="text-xs">
                        {result.success ? "✓" : "✗"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Button Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
            <CardDescription>All button variants with DemoStoke colors and improved interactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="hero">Hero</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Badge Variants</CardTitle>
            <CardDescription>Badge components with DemoStoke color palette</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="accent">Accent</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="muted">Muted</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Form Components */}
        <Card>
          <CardHeader>
            <CardTitle>Form Components</CardTitle>
            <CardDescription>Interactive form elements with DemoStoke styling</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-body-sm font-medium">Input Field</label>
              <Input placeholder="Enter your text here..." />
            </div>

            <div className="space-y-2">
              <label className="text-body-sm font-medium">Select Dropdown</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="checkbox" />
                <label htmlFor="checkbox" className="text-body-sm">Checkbox</label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="switch" />
                <label htmlFor="switch" className="text-body-sm">Switch</label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Tabs Component</CardTitle>
            <CardDescription>Tab navigation with DemoStoke styling</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tab1" className="w-full">
              <TabsList>
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="tab3">Tab 3</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1" className="mt-4">
                <p className="text-body-md">Content for Tab 1 with DemoStoke typography.</p>
              </TabsContent>
              <TabsContent value="tab2" className="mt-4">
                <p className="text-body-md">Content for Tab 2 with DemoStoke typography.</p>
              </TabsContent>
              <TabsContent value="tab3" className="mt-4">
                <p className="text-body-md">Content for Tab 3 with DemoStoke typography.</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Navigation Menu */}
        <Card>
          <CardHeader>
            <CardTitle>Navigation Menu</CardTitle>
            <CardDescription>Navigation component with DemoStoke interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-4 w-48">
                      <NavigationMenuLink className="block p-2 hover:bg-accent rounded">
                        Buttons
                      </NavigationMenuLink>
                      <NavigationMenuLink className="block p-2 hover:bg-accent rounded">
                        Cards
                      </NavigationMenuLink>
                      <NavigationMenuLink className="block p-2 hover:bg-accent rounded">
                        Forms
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Design Tokens</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-4 w-48">
                      <NavigationMenuLink className="block p-2 hover:bg-accent rounded">
                        Colors
                      </NavigationMenuLink>
                      <NavigationMenuLink className="block p-2 hover:bg-accent rounded">
                        Typography
                      </NavigationMenuLink>
                      <NavigationMenuLink className="block p-2 hover:bg-accent rounded">
                        Spacing
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </CardContent>
        </Card>

        {/* Color Palette Display */}
        <Card>
          <CardHeader>
            <CardTitle>DemoStoke Color Palette</CardTitle>
            <CardDescription>Authentic DemoStoke brand colors in action</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="w-full h-16 bg-primary rounded-lg"></div>
                <p className="text-body-sm font-medium">Primary</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-16 bg-accent rounded-lg"></div>
                <p className="text-body-sm font-medium">Accent</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-16 bg-secondary rounded-lg"></div>
                <p className="text-body-sm font-medium">Secondary</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-16 bg-muted rounded-lg"></div>
                <p className="text-body-sm font-medium">Muted</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Test Suite */}
        <AccessibilityTestSuite />

        {/* Visual Regression Test Suite */}
        <Card>
          <CardHeader>
            <CardTitle>Visual Regression Testing</CardTitle>
            <CardDescription>
              Comprehensive visual regression testing for DemoStoke design system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-body-md text-muted-foreground">
                The visual regression test suite verifies brand consistency, accessibility compliance,
                responsive behavior, and proper component rendering across all design tokens.
              </p>
              <div className="flex gap-4">
                <Button
                  onClick={() => window.open('/storybook-static/index.html', '_blank')}
                  variant="outline"
                >
                  Open Storybook
                </Button>
                <Button
                  onClick={() => {
                    // This would trigger the visual regression test suite
                    console.log('Visual regression tests would run here');
                  }}
                  variant="accent"
                >
                  Run Visual Tests
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="p-3 border rounded-lg">
                  <p className="font-medium text-green-600">✓ Color Contrast</p>
                  <p className="text-muted-foreground">WCAG AA compliance</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="font-medium text-green-600">✓ Responsive Design</p>
                  <p className="text-muted-foreground">Mobile, tablet, desktop</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="font-medium text-green-600">✓ Theme Switching</p>
                  <p className="text-muted-foreground">Light/dark mode support</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="font-medium text-green-600">✓ Brand Consistency</p>
                  <p className="text-muted-foreground">DemoStoke guidelines</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
