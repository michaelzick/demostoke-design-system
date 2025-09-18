import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, ExternalLink, Download, Upload, Figma, Zap, AlertCircle, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { figmaService } from "@/services/figmaService";
import { FigmaConnection, FigmaFileRecord, FigmaComponentRecord } from "@/types/figma";
import { useAuth } from "@/contexts/AuthContext";

export default function FigmaSync() {
  const { toast } = useToast();
  const { user } = useAuth();
  const accessTokenRef = useRef<HTMLInputElement>(null);
  
  const [isConnected, setIsConnected] = useState(false);
  const [connection, setConnection] = useState<FigmaConnection | null>(null);
  const [figmaFiles, setFigmaFiles] = useState<FigmaFileRecord[]>([]);
  const [figmaComponents, setFigmaComponents] = useState<FigmaComponentRecord[]>([]);
  const [syncProgress, setSyncProgress] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load existing connection on mount
  useEffect(() => {
    loadConnection();
  }, [user]);

  const loadConnection = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const existingConnection = await figmaService.getConnection();
      if (existingConnection) {
        setConnection(existingConnection);
        setIsConnected(true);
        await loadFiles();
      }
    } catch (error) {
      console.error('Failed to load connection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFiles = async () => {
    try {
      const files = await figmaService.getFiles();
      setFigmaFiles(files);
    } catch (error) {
      console.error('Failed to load files:', error);
      setError('Failed to load Figma files');
    }
  };

  const loadComponents = async (fileId: string) => {
    try {
      const components = await figmaService.getComponents(fileId);
      setFigmaComponents(components);
    } catch (error) {
      console.error('Failed to load components:', error);
    }
  };

  const handleConnect = async () => {
    const accessToken = accessTokenRef.current?.value?.trim();
    if (!accessToken) {
      toast({
        title: "Access Token Required",
        description: "Please enter your Figma access token to connect.",
        variant: "destructive"
      });
      return;
    }

    setIsSyncing(true);
    setSyncProgress(0);
    setError(null);

    try {
      // Validate token and get user info
      setSyncProgress(25);
      const userInfo = await figmaService.validateToken(accessToken);
      
      // Get user's teams to find a default team
      setSyncProgress(50);
      const teams = await figmaService.getUserTeams(accessToken);
      const defaultTeam = teams.length > 0 ? teams[0] : undefined;
      
      // Save connection
      setSyncProgress(75);
      const newConnection = await figmaService.saveConnection(
        accessToken,
        userInfo,
        defaultTeam?.id
      );
      
      setSyncProgress(100);
      setConnection(newConnection);
      setIsConnected(true);
      
      // Load files after connection
      await loadFiles();
      
      toast({
        title: "Connected to Figma",
        description: `Successfully connected as ${userInfo.handle}`,
      });
    } catch (error) {
      console.error('Connection failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect to Figma');
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : 'Failed to connect to Figma',
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
      setSyncProgress(0);
    }
  };

  const handleDisconnect = async () => {
    try {
      await figmaService.deleteConnection();
      setConnection(null);
      setIsConnected(false);
      setFigmaFiles([]);
      setFigmaComponents([]);
      toast({
        title: "Disconnected",
        description: "Successfully disconnected from Figma",
      });
    } catch (error) {
      console.error('Disconnect failed:', error);
      toast({
        title: "Disconnect Failed",
        description: "Failed to disconnect from Figma",
        variant: "destructive"
      });
    }
  };

  const handleSync = async (figmaFileId: string) => {
    setIsSyncing(true);
    setSyncProgress(0);

    try {
      setSyncProgress(25);
      await figmaService.syncFile(figmaFileId);
      setSyncProgress(75);
      
      // Reload files to get updated data
      await loadFiles();
      setSyncProgress(100);
      
      toast({
        title: "Sync completed",
        description: "Components have been synchronized with Figma.",
      });
    } catch (error) {
      console.error('Sync failed:', error);
      toast({
        title: "Sync Failed",
        description: error instanceof Error ? error.message : 'Failed to sync with Figma',
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
      setSyncProgress(0);
    }
  };

  const handleRefreshFiles = async () => {
    setIsSyncing(true);
    try {
      const files = await figmaService.refreshUserFiles();
      setFigmaFiles(files);
      toast({
        title: "Files Refreshed",
        description: "Figma files have been refreshed from your account.",
      });
    } catch (error) {
      console.error('Refresh failed:', error);
      toast({
        title: "Refresh Failed",
        description: error instanceof Error ? error.message : 'Failed to refresh files',
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      await figmaService.deleteFile(fileId);
      await loadFiles();
      toast({
        title: "File Removed",
        description: "Figma file has been removed from your project.",
      });
    } catch (error) {
      console.error('Delete failed:', error);
      toast({
        title: "Delete Failed", 
        description: "Failed to remove file",
        variant: "destructive"
      });
    }
  };

  const formatLastSync = (lastSync?: string) => {
    if (!lastSync) return 'Never';
    const date = new Date(lastSync);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  if (!user) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Authentication Required</h3>
            <p className="text-muted-foreground">Please sign in to access Figma integration.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <RefreshCw className="h-8 w-8 mx-auto animate-spin text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Loading Figma integration...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Error</span>
                </div>
                <p className="text-sm text-destructive/80 mt-1">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Figma Personal Access Token</label>
              <Input 
                ref={accessTokenRef}
                type="password" 
                placeholder="Enter your Figma access token"
                className="font-mono"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleConnect();
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">
                <a 
                  href="https://www.figma.com/developers/api#access-tokens" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  How to get your Figma access token
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
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Figma className="h-5 w-5" />
                  Connected as {connection?.user_info?.handle}
                </div>
                <Button variant="outline" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </CardTitle>
            </CardHeader>
          </Card>

          <Tabs defaultValue="files" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="files">Figma Files</TabsTrigger>
              <TabsTrigger value="components">Component Mapping</TabsTrigger>
              <TabsTrigger value="settings">Sync Settings</TabsTrigger>
            </TabsList>

          <TabsContent value="files">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-heading-md">Connected Figma Files</h2>
                <Button variant="outline" onClick={handleRefreshFiles} disabled={isSyncing}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                  Refresh Files
                </Button>
              </div>

              <div className="grid gap-4">
                {figmaFiles.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="p-8 text-center">
                      <Figma className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-medium mb-2">No Figma Files Found</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Click "Refresh Files" to load files from your Figma account, or add files manually.
                      </p>
                      <Button variant="outline" onClick={handleRefreshFiles} disabled={isSyncing}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                        Refresh Files
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  figmaFiles.map((file) => (
                    <Card key={file.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{file.name}</h3>
                              <Badge 
                                variant={
                                  file.sync_status === "synced" ? "default" :
                                  file.sync_status === "outdated" ? "secondary" :
                                  file.sync_status === "error" ? "destructive" :
                                  "outline"
                                }
                              >
                                {file.sync_status === "synced" ? "Synced" :
                                 file.sync_status === "outdated" ? "Outdated" :
                                 file.sync_status === "error" ? "Error" :
                                 "Not Synced"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {file.component_count} components • Last sync: {formatLastSync(file.last_sync)}
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
                              onClick={() => handleSync(file.figma_file_id)}
                              disabled={isSyncing}
                            >
                              {isSyncing ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <RefreshCw className="h-4 w-4" />
                              )}
                              Sync
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteFile(file.id)}
                              disabled={isSyncing}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {figmaFiles.length > 0 && (
                <Card className="border-dashed">
                  <CardContent className="p-6 text-center">
                    <div className="space-y-2">
                      <p className="font-medium">Need More Files?</p>
                      <p className="text-sm text-muted-foreground">
                        Refresh to discover more files from your Figma account
                      </p>
                      <Button variant="outline" onClick={handleRefreshFiles} disabled={isSyncing}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                        Refresh Files
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="components">
            <Card>
              <CardHeader>
                <CardTitle>Component Mapping</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Map Figma components to your design system components
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {figmaComponents.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-medium mb-2">No Components Found</h3>
                      <p className="text-sm text-muted-foreground">
                        Sync a Figma file to see component mappings here
                      </p>
                    </div>
                  ) : (
                    figmaComponents.map((component) => (
                      <div key={component.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-medium">{component.figma_component_name}</p>
                            <p className="text-sm text-muted-foreground">Figma Component</p>
                          </div>
                          <div className="text-muted-foreground">→</div>
                          <div>
                            <p className="font-medium">
                              {component.design_system_component_id ? 'Mapped Component' : 'No mapping'}
                            </p>
                            <p className="text-sm text-muted-foreground">Design System Component</p>
                          </div>
                        </div>
                        <Badge variant={component.mapping_status === "mapped" ? "default" : "secondary"}>
                          {component.mapping_status}
                        </Badge>
                      </div>
                    ))
                  )}
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
        </div>
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