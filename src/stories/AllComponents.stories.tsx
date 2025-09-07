import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Slider } from '../components/ui/slider';
import { Textarea } from '../components/ui/textarea';
import { ThemeToggle } from '../components/theme-toggle';
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Info,
  Mail,
  Download,
  Plus,
  User,
  Settings,
  Home
} from 'lucide-react';

const AllComponentsShowcase = () => {
  return (
    <div className="p-8 space-y-8 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-display-lg text-foreground">DemoStoke Design System</h1>
          <p className="text-body-lg text-muted-foreground">Complete component showcase with authentic DemoStoke colors</p>
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
        </div>

        {/* Buttons Section */}
        <Card>
          <CardHeader>
            <CardTitle>Button Components</CardTitle>
            <CardDescription>All button variants with DemoStoke brand colors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Variants</h4>
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
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Sizes</h4>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon"><Plus className="h-4 w-4" /></Button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">With Icons</h4>
              <div className="flex flex-wrap gap-4">
                <Button><Mail className="h-4 w-4 mr-2" />Email</Button>
                <Button variant="outline"><Download className="h-4 w-4 mr-2" />Download</Button>
                <Button variant="accent"><Plus className="h-4 w-4 mr-2" />Add New</Button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">States</h4>
              <div className="flex flex-wrap gap-4">
                <Button disabled>Disabled</Button>
                <Button variant="outline" disabled>Disabled Outline</Button>
                <Button>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Loading
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges Section */}
        <Card>
          <CardHeader>
            <CardTitle>Badge Components</CardTitle>
            <CardDescription>Status and label badges with DemoStoke colors</CardDescription>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-body-sm font-medium">Input Field</label>
                  <Input placeholder="Enter your text here..." />
                </div>

                <div className="space-y-2">
                  <label className="text-body-sm font-medium">Textarea</label>
                  <Textarea placeholder="Enter your message..." />
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
              </div>

              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="checkbox1" />
                    <label htmlFor="checkbox1" className="text-body-sm">Checkbox Option 1</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="checkbox2" defaultChecked />
                    <label htmlFor="checkbox2" className="text-body-sm">Checkbox Option 2 (Checked)</label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="switch1" />
                    <label htmlFor="switch1" className="text-body-sm">Switch Option 1</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="switch2" defaultChecked />
                    <label htmlFor="switch2" className="text-body-sm">Switch Option 2 (On)</label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-body-sm font-medium">Slider</label>
                  <Slider defaultValue={[50]} max={100} step={1} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards and Layouts */}
        <Card>
          <CardHeader>
            <CardTitle>Card Layouts</CardTitle>
            <CardDescription>Various card layouts and compositions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    User Profile
                  </CardTitle>
                  <CardDescription>User information card</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">John Doe</p>
                      <p className="text-sm text-muted-foreground">john@example.com</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">Admin</Badge>
                    <Badge variant="accent">Active</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Notifications</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Dark Mode</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto Save</span>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 bg-muted rounded">
                      <p className="text-lg font-bold">24</p>
                      <p className="text-xs text-muted-foreground">Tasks</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <p className="text-lg font-bold">8</p>
                      <p className="text-xs text-muted-foreground">Done</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Component */}
        <Card>
          <CardHeader>
            <CardTitle>Tabs Navigation</CardTitle>
            <CardDescription>Tab component with DemoStoke styling</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-heading-md">Overview Content</h3>
                  <p className="text-body-md text-muted-foreground">
                    This is the overview tab content with DemoStoke typography and spacing.
                  </p>
                  <div className="flex gap-4">
                    <Button>Primary Action</Button>
                    <Button variant="outline">Secondary Action</Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="analytics" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-heading-md">Analytics Content</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-primary">1,234</p>
                        <p className="text-sm text-muted-foreground">Total Users</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-accent">567</p>
                        <p className="text-sm text-muted-foreground">Active Sessions</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-secondary">89%</p>
                        <p className="text-sm text-muted-foreground">Satisfaction</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="reports" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-heading-md">Reports Content</h3>
                  <p className="text-body-md text-muted-foreground">
                    Generate and view reports with the DemoStoke design system.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="settings" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-heading-md">Settings Content</h3>
                  <p className="text-body-md text-muted-foreground">
                    Configure your preferences and settings.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Alerts and Status */}
        <Card>
          <CardHeader>
            <CardTitle>Alerts and Status</CardTitle>
            <CardDescription>Alert components and status indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>
                This is an informational alert with DemoStoke colors.
              </AlertDescription>
            </Alert>

            <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800 dark:text-green-200">Success</AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-300">
                Operation completed successfully with DemoStoke success colors.
              </AlertDescription>
            </Alert>

            <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-800 dark:text-yellow-200">Warning</AlertTitle>
              <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                Please review this warning message with DemoStoke warning colors.
              </AlertDescription>
            </Alert>

            <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800 dark:text-red-200">Error</AlertTitle>
              <AlertDescription className="text-red-700 dark:text-red-300">
                An error occurred. Please check the details with DemoStoke error colors.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Typography Showcase */}
        <Card>
          <CardHeader>
            <CardTitle>Typography System</CardTitle>
            <CardDescription>DemoStoke typography scale and hierarchy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <p className="text-display-lg">Display Large</p>
                <p className="text-xs text-muted-foreground">text-display-lg</p>
              </div>
              <div>
                <p className="text-display-md">Display Medium</p>
                <p className="text-xs text-muted-foreground">text-display-md</p>
              </div>
              <div>
                <p className="text-display-sm">Display Small</p>
                <p className="text-xs text-muted-foreground">text-display-sm</p>
              </div>
              <Separator />
              <div>
                <p className="text-heading-lg">Heading Large</p>
                <p className="text-xs text-muted-foreground">text-heading-lg</p>
              </div>
              <div>
                <p className="text-heading-md">Heading Medium</p>
                <p className="text-xs text-muted-foreground">text-heading-md</p>
              </div>
              <div>
                <p className="text-heading-sm">Heading Small</p>
                <p className="text-xs text-muted-foreground">text-heading-sm</p>
              </div>
              <Separator />
              <div>
                <p className="text-body-lg">Body Large - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <p className="text-xs text-muted-foreground">text-body-lg</p>
              </div>
              <div>
                <p className="text-body-md">Body Medium - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <p className="text-xs text-muted-foreground">text-body-md</p>
              </div>
              <div>
                <p className="text-body-sm">Body Small - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <p className="text-xs text-muted-foreground">text-body-sm</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle>DemoStoke Color Palette</CardTitle>
            <CardDescription>Authentic brand colors in light and dark modes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="space-y-2">
                <div className="w-full h-16 bg-primary rounded-lg border"></div>
                <p className="text-xs font-medium text-center">Primary</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-16 bg-accent rounded-lg border"></div>
                <p className="text-xs font-medium text-center">Accent</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-16 bg-secondary rounded-lg border"></div>
                <p className="text-xs font-medium text-center">Secondary</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-16 bg-muted rounded-lg border"></div>
                <p className="text-xs font-medium text-center">Muted</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-16 bg-card rounded-lg border"></div>
                <p className="text-xs font-medium text-center">Card</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-16 bg-background rounded-lg border"></div>
                <p className="text-xs font-medium text-center">Background</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const meta: Meta<typeof AllComponentsShowcase> = {
  title: 'Testing/All Components Showcase',
  component: AllComponentsShowcase,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete showcase of all components with DemoStoke design tokens for visual regression testing.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const LightMode: Story = {
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const MobileViewport: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const TabletViewport: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

export const DesktopViewport: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};
