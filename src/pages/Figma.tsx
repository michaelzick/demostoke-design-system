import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, ExternalLink, Download, Upload, Figma, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function FigmaSync() {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const figmaFiles = [
    {
      id: "1",
      name: "Design System Components",
      url: "https://figma.com/file/abc123",
      lastSync: "2 hours ago",
      components: 24,
      status: "synced"
    },
    {
      id: "2", 
      name: "Mobile App Components",
      url: "https://figma.com/file/def456",
      lastSync: "1 day ago",
      components: 18,
      status: "outdated"
    },
    {
      id: "3",
      name: "Marketing Website",
      url: "https://figma.com/file/ghi789",
      lastSync: "Never",
      components: 0,
      status: "not-synced"
    }
  ];

  const handleConnect = async () => {
    setIsSyncing(true);
    // Simulate connection process
    for (let i = 0; i <= 100; i += 10) {
      setSyncProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    setIsConnected(true);
    setIsSyncing(false);
    setSyncProgress(0);
    toast({
      title: "Connected to Figma",
      description: "Successfully connected to your Figma account.",
    });
  };

  const handleSync = async (fileId: string) => {
    setIsSyncing(true);
    // Simulate sync process
    for (let i = 0; i <= 100; i += 20) {
      setSyncProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    setIsSyncing(false);
    setSyncProgress(0);
    toast({
      title: "Sync completed",
      description: "Components have been synchronized with Figma.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-display-md">Figma Integration</h1>
        <p className="text-body-lg text-muted-foreground">
          Sync your design system components with Figma design files
        </p>
      </div>

      {!isConnected ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Figma className="h-5 w-5" />
              Connect to Figma
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <Figma className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium">Connect your Figma account</p>
                <p className="text-sm text-muted-foreground">
                  Authorize access to sync components between your design system and Figma files
                </p>
              </div>
            </div>

            {isSyncing && (
              <div className="space-y-2">
                <p className="text-sm text-center">Connecting to Figma...</p>
                <Progress value={syncProgress} className="w-full" />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Figma Personal Access Token</label>
              <Input 
                type="password" 
                placeholder="Enter your Figma access token"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                <a 
                  href="https://www.figma.com/developers/api#access-tokens" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  How to get your access token
                </a>
              </p>
            </div>

            <Button onClick={handleConnect} disabled={isSyncing} className="w-full">
              <Figma className="h-4 w-4 mr-2" />
              {isSyncing ? "Connecting..." : "Connect to Figma"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="files" className="space-y-6">
          <TabsList>
            <TabsTrigger value="files">Figma Files</TabsTrigger>
            <TabsTrigger value="components">Component Mapping</TabsTrigger>
            <TabsTrigger value="settings">Sync Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="files">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-heading-md">Connected Figma Files</h2>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Files
                </Button>
              </div>

              <div className="grid gap-4">
                {figmaFiles.map((file) => (
                  <Card key={file.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{file.name}</h3>
                            <Badge 
                              variant={
                                file.status === "synced" ? "default" :
                                file.status === "outdated" ? "secondary" :
                                "outline"
                              }
                            >
                              {file.status === "synced" ? "Synced" :
                               file.status === "outdated" ? "Outdated" :
                               "Not Synced"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {file.components} components • Last sync: {file.lastSync}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <a href={file.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSync(file.id)}
                            disabled={isSyncing}
                          >
                            {isSyncing ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <RefreshCw className="h-4 w-4" />
                            )}
                            Sync
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-dashed">
                <CardContent className="p-6 text-center">
                  <div className="space-y-2">
                    <p className="font-medium">Add New Figma File</p>
                    <p className="text-sm text-muted-foreground">
                      Connect additional Figma files to sync components
                    </p>
                    <Button variant="outline">
                      <Figma className="h-4 w-4 mr-2" />
                      Add Figma File
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="components">
            <Card>
              <CardHeader>
                <CardTitle>Component Mapping</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { figma: "Button/Primary", code: "Button", status: "mapped" },
                    { figma: "Card/Default", code: "Card", status: "mapped" },
                    { figma: "Modal/Large", code: "Dialog", status: "mapped" },
                    { figma: "Input/Text", code: "Input", status: "mapped" },
                    { figma: "Navigation/Horizontal", code: "Navigation", status: "unmapped" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">{item.figma}</p>
                          <p className="text-sm text-muted-foreground">Figma Component</p>
                        </div>
                        <div className="text-muted-foreground">→</div>
                        <div>
                          <p className="font-medium">{item.code}</p>
                          <p className="text-sm text-muted-foreground">Code Component</p>
                        </div>
                      </div>
                      <Badge variant={item.status === "mapped" ? "default" : "secondary"}>
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Sync Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-sync</p>
                      <p className="text-sm text-muted-foreground">
                        Automatically sync when Figma files are updated
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Zap className="h-4 w-4 mr-2" />
                      Enable
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Import assets</p>
                      <p className="text-sm text-muted-foreground">
                        Download and include image assets from Figma
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Export to Figma</p>
                      <p className="text-sm text-muted-foreground">
                        Push component changes back to Figma
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Setup
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {isSyncing && syncProgress > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Syncing components...</span>
                <span className="text-sm text-muted-foreground">{syncProgress}%</span>
              </div>
              <Progress value={syncProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}