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
import { useAuth } from "@/contexts/AuthContext";
import { AuthRequiredCard } from "@/components/common/AuthRequiredCard";


export default function Settings() {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [settings, setSettings] = useState({
    projectName: "DemoStoke Design System",
    projectDescription: "",
    projectVersion: "1.0.0",
    autoPublish: true,
    notifications: true,
    publicComponents: false,
    codeGeneration: "typescript",
    storybookPort: "6006",
    buildCommand: "",
    testCommand: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    loadSettings();
  }, [isAuthenticated]);

  const loadSettings = async () => {
    if (!isAuthenticated) return;

    try {
      const userSettings = await designSystemSettingsService.getCurrentSettings();
      if (userSettings) {
        setSettings({
          projectName: userSettings.project_name,
          projectDescription: userSettings.project_description || "",
          projectVersion: userSettings.project_version,
          autoPublish: userSettings.auto_publish,
          notifications: userSettings.notifications,
          publicComponents: userSettings.public_components,
          codeGeneration: userSettings.code_generation,
          storybookPort: userSettings.storybook_port,
          buildCommand: userSettings.build_command || "",
          testCommand: userSettings.test_command || "",
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) return;

    try {
      const success = await designSystemSettingsService.updateSettings({
        project_name: settings.projectName,
        project_description: settings.projectDescription,
        project_version: settings.projectVersion,
        auto_publish: settings.autoPublish,
        notifications: settings.notifications,
        public_components: settings.publicComponents,
        code_generation: settings.codeGeneration,
        storybook_port: settings.storybookPort,
        build_command: settings.buildCommand,
        test_command: settings.testCommand,
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

  if (!isAuthenticated) {
    return <AuthRequiredCard />;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-display-md">Settings</h1>
        <p className="text-body-lg text-muted-foreground">
          Configure your design system preferences and project settings
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            General
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
