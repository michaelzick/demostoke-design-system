import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, Users, Shield, Palette, Code, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { designSystemSettingsService } from "@/services/designSystemSettingsService";

export default function Settings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    projectName: "DemoStoke Design System",
    projectDescription: "",
    projectVersion: "1.0.0",
    defaultTheme: "light",
    autoPublish: true,
    notifications: true,
    publicComponents: false,
    codeGeneration: "typescript",
    storybookPort: "6006",
    buildCommand: "",
    testCommand: "",
    fontFamily: "inter",
    baseFontSize: "16",
    primaryColor: "#3b82f6",
    secondaryColor: "#6b7280",
    accentColor: "#f59e0b",
    successColor: "#10b981",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const userSettings = await designSystemSettingsService.getCurrentSettings();
      if (userSettings) {
        setSettings({
          projectName: userSettings.project_name,
          projectDescription: userSettings.project_description || "",
          projectVersion: userSettings.project_version,
          defaultTheme: userSettings.default_theme,
          autoPublish: userSettings.auto_publish,
          notifications: userSettings.notifications,
          publicComponents: userSettings.public_components,
          codeGeneration: userSettings.code_generation,
          storybookPort: userSettings.storybook_port,
          buildCommand: userSettings.build_command || "",
          testCommand: userSettings.test_command || "",
          fontFamily: userSettings.font_family,
          baseFontSize: userSettings.base_font_size,
          primaryColor: userSettings.primary_color,
          secondaryColor: userSettings.secondary_color,
          accentColor: userSettings.accent_color,
          successColor: userSettings.success_color,
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const success = await designSystemSettingsService.updateSettings({
        project_name: settings.projectName,
        project_description: settings.projectDescription,
        project_version: settings.projectVersion,
        default_theme: settings.defaultTheme,
        auto_publish: settings.autoPublish,
        notifications: settings.notifications,
        public_components: settings.publicComponents,
        code_generation: settings.codeGeneration,
        storybook_port: settings.storybookPort,
        build_command: settings.buildCommand,
        test_command: settings.testCommand,
        font_family: settings.fontFamily,
        base_font_size: settings.baseFontSize,
        primary_color: settings.primaryColor,
        secondary_color: settings.secondaryColor,
        accent_color: settings.accentColor,
        success_color: settings.successColor,
      });

      if (success) {
        // Trigger settings update event for theme provider
        localStorage.setItem('design-system-settings-updated', Date.now().toString());
        window.dispatchEvent(new StorageEvent('storage', { key: 'design-system-settings-updated' }));
        
        toast({
          title: "Settings saved",
          description: "Your preferences have been updated successfully.",
        });
      } else {
        toast({
          title: "Error saving settings",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error saving settings",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-display-md">Settings</h1>
        <p className="text-body-lg text-muted-foreground">
          Configure your design system preferences and project settings
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="collaboration" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="development" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Development
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    value={settings.projectName}
                    onChange={(e) => updateSetting('projectName', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-description">Description</Label>
                  <Input
                    id="project-description"
                    placeholder="A comprehensive design system for modern web applications"
                    value={settings.projectDescription}
                    onChange={(e) => updateSetting('projectDescription', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-version">Version</Label>
                  <Input
                    id="project-version"
                    placeholder="1.0.0"
                    value={settings.projectVersion}
                    onChange={(e) => updateSetting('projectVersion', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-publish components</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically publish components when they're created or updated
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoPublish}
                    onCheckedChange={(checked) => updateSetting('autoPublish', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Public component library</Label>
                    <p className="text-sm text-muted-foreground">
                      Make your components publicly discoverable
                    </p>
                  </div>
                  <Switch
                    checked={settings.publicComponents}
                    onCheckedChange={(checked) => updateSetting('publicComponents', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appearance">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Default theme</Label>
                  <Select value={settings.defaultTheme} onValueChange={(value) => updateSetting('defaultTheme', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Color Palette</Label>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { name: "Primary", color: settings.primaryColor, key: "primaryColor" },
                      { name: "Secondary", color: settings.secondaryColor, key: "secondaryColor" },
                      { name: "Accent", color: settings.accentColor, key: "accentColor" },
                      { name: "Success", color: settings.successColor, key: "successColor" },
                    ].map((item) => (
                      <div key={item.name} className="space-y-2">
                        <Label className="text-sm">{item.name}</Label>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded border"
                            style={{ backgroundColor: item.color }}
                          />
                          <Input
                            value={item.color}
                            className="font-mono text-sm"
                            onChange={(e) => updateSetting(item.key, e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Typography</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Font Family</Label>
                  <Select value={settings.fontFamily} onValueChange={(value) => updateSetting('fontFamily', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="tahoma">Tahoma</SelectItem>
                      <SelectItem value="roboto">Roboto</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Base Font Size</Label>
                  <Select value={settings.baseFontSize} onValueChange={(value) => updateSetting('baseFontSize', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="14">14px</SelectItem>
                      <SelectItem value="16">16px</SelectItem>
                      <SelectItem value="18">18px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="collaboration">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { name: "John Doe", email: "john@example.com", role: "Admin" },
                    { name: "Jane Smith", email: "jane@example.com", role: "Editor" },
                    { name: "Mike Johnson", email: "mike@example.com", role: "Viewer" },
                  ].map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select defaultValue={member.role.toLowerCase()}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm">Remove</Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full">Invite Team Member</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Permissions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Component creation</Label>
                      <p className="text-sm text-muted-foreground">Who can create new components</p>
                    </div>
                    <Select defaultValue="editors">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admins">Admins only</SelectItem>
                        <SelectItem value="editors">Editors and above</SelectItem>
                        <SelectItem value="all">All members</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Component publishing</Label>
                      <p className="text-sm text-muted-foreground">Who can publish components</p>
                    </div>
                    <Select defaultValue="admins">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admins">Admins only</SelectItem>
                        <SelectItem value="editors">Editors and above</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="development">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Code Generation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Preferred language</Label>
                  <Select value={settings.codeGeneration} onValueChange={(value) => updateSetting('codeGeneration', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>CSS Framework</Label>
                  <Select defaultValue="tailwind">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tailwind">Tailwind CSS</SelectItem>
                      <SelectItem value="styled-components">Styled Components</SelectItem>
                      <SelectItem value="css-modules">CSS Modules</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Development Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storybook-port">Storybook Port</Label>
                  <Input
                    id="storybook-port"
                    value={settings.storybookPort}
                    onChange={(e) => updateSetting('storybookPort', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="build-command">Build Command</Label>
                  <Input
                    id="build-command"
                    placeholder="npm run build"
                    value={settings.buildCommand}
                    onChange={(e) => updateSetting('buildCommand', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="test-command">Test Command</Label>
                  <Input
                    id="test-command"
                    placeholder="npm test"
                    value={settings.testCommand}
                    onChange={(e) => updateSetting('testCommand', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email updates about component changes
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => updateSetting('notifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Component updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when components are updated or published
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Team activity</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about team member actions
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>System updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Important updates about the design system platform
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Loading..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
