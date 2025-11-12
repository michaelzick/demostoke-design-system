import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Grid, List, Filter, MoreHorizontal, Eye, Download, Copy, Plus, Code, PlayCircle, StopCircle, BookOpen, Loader2, AlertCircle, RefreshCw, RotateCw } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { componentService } from "@/services/componentService";
import { DesignSystemComponent } from "@/types/component";
import { toast } from "@/hooks/use-toast";
import { copyComponentCode, viewInStorybook, exportComponentSpec, viewComponentCode, registerCodeModal } from "@/utils/componentActions";
import { CodeModal } from "@/components/ui/code-modal";
import { NewComponentButton } from "@/components/common/NewComponentButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Components() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [components, setComponents] = useState<DesignSystemComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [codeModal, setCodeModal] = useState({ isOpen: false, componentName: "", code: "" });

  // Storybook tab state
  const [activeTab, setActiveTab] = useState<"components" | "storybook">("components");
  const [isStorybookRunning, setIsStorybookRunning] = useState(false);
  const [isStorybookLoading, setIsStorybookLoading] = useState(false);
  const [storybookError, setStorybookError] = useState<string | null>(null);
  const [showRebuildModal, setShowRebuildModal] = useState(false);

  // Register code modal handler
  useEffect(() => {
    registerCodeModal(setCodeModal);
  }, []);

  // Fetch components on mount
  useEffect(() => {
    const fetchComponents = async () => {
      try {
        setLoading(true);
        setError(null);
        const userComponents = await componentService.getUserComponents();
        const publicComponents = await componentService.getPublicComponents();

        // Combine user's components with public components, removing duplicates
        const allComponents = [...userComponents, ...publicComponents.filter(
          pc => !userComponents.some(uc => uc.id === pc.id)
        )];

        setComponents(allComponents);
      } catch (err) {
        console.error('Failed to fetch components:', err);
        setError('Failed to load components');
        toast({
          title: 'Error',
          description: 'Failed to load components. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchComponents();
  }, []);

  // Extract categories from real data
  const categories = useMemo(() => {
    const uniqueCategories = new Set(components.map(c => c.category));
    return ["all", ...Array.from(uniqueCategories).sort()];
  }, [components]);

  // Helper function to format date
  const formatLastModified = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`;
  };

  const filteredComponents = useMemo(() => {
    return components.filter(component => {
      const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           component.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || component.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [components, searchTerm, selectedCategory]);

  const ComponentCard = ({ component }: { component: DesignSystemComponent }) => (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-heading-md">{component.name}</CardTitle>
            <CardDescription className="mt-1">{component.description || 'No description'}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => viewInStorybook(component.name)}>
                <Eye className="h-4 w-4 mr-2" />
                View in Storybook
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => viewComponentCode(component.name)}>
                <Code className="h-4 w-4 mr-2" />
                View Code
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => copyComponentCode(component.name)}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Code
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportComponentSpec(component.name)}>
                <Download className="h-4 w-4 mr-2" />
                Export Spec
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{component.category}</Badge>
          </div>

          <div className="flex flex-wrap gap-1">
            {component.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="text-sm text-muted-foreground">
              Updated: {formatLastModified(component.updated_at)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ComponentListItem = ({ component }: { component: DesignSystemComponent }) => (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-heading-sm truncate">{component.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{component.description || 'No description'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Badge variant="outline">{component.category}</Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => viewInStorybook(component.name)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View in Storybook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => viewComponentCode(component.name)}>
                  <Code className="h-4 w-4 mr-2" />
                  View Code
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => copyComponentCode(component.name)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportComponentSpec(component.name)}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Spec
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Storybook handlers
  const handleRunStorybook = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    setIsStorybookLoading(true);
    setStorybookError(null);
    // Simulate a small delay for better UX
    setTimeout(() => {
      setIsStorybookRunning(true);
      setIsStorybookLoading(false);
    }, 500);
  };

  const handleStopStorybook = () => {
    setIsStorybookRunning(false);
    setStorybookError(null);
  };

  const handleStorybookLoad = () => {
    setIsStorybookLoading(false);
    setStorybookError(null);
  };

  const handleStorybookError = () => {
    setIsStorybookLoading(false);
    setStorybookError("Failed to load Storybook. Make sure the Storybook build exists.");
  };

  const handleCopyCommand = async () => {
    try {
      await navigator.clipboard.writeText('npm run build-storybook');
      toast({
        title: "Copied!",
        description: "Command copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the command manually",
        variant: "destructive",
      });
    }
  };

  const handleRefreshStorybook = () => {
    setIsStorybookLoading(true);
    const iframe = document.querySelector('iframe[title="Storybook Viewer"]') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src.split('?')[0] + '?t=' + Date.now();
    }
    setTimeout(() => setIsStorybookLoading(false), 1000);
  };

  const handleRefreshAfterBuild = () => {
    setShowRebuildModal(false);
    handleRefreshStorybook();
    toast({
      title: "Refreshing Storybook",
      description: "Loading your updated components...",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-md">Component Library</h1>
          <p className="text-body-lg text-muted-foreground">
            Browse and manage your design system components
          </p>
        </div>
        <NewComponentButton>
          Add Component
        </NewComponentButton>
      </div>

      {/* Main Tabs: Components and Storybook */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "components" | "storybook")} className="space-y-6">
        <TabsList>
          <TabsTrigger value="components">
            <Grid className="h-4 w-4 mr-2" />
            Components
          </TabsTrigger>
          <TabsTrigger value="storybook">
            <BookOpen className="h-4 w-4 mr-2" />
            Storybook
          </TabsTrigger>
        </TabsList>

        {/* Components Tab Content */}
        <TabsContent value="components" className="space-y-4 mt-0">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>

            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={loading}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "list")}>
                <TabsList>
                  <TabsTrigger value="grid" disabled={loading}>
                    <Grid className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="list" disabled={loading}>
                    <List className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Components Display */}
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Loading components...</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <div className="flex gap-2 mb-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                      <Skeleton className="h-4 w-1/2" />
                    </Card>
                  ))}
                </div>
              </div>
            ) : error ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </Card>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {filteredComponents.length} component{filteredComponents.length !== 1 ? 's' : ''} found
                  </p>
                </div>

                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredComponents.map((component) => (
                      <ComponentCard key={component.id} component={component} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredComponents.map((component) => (
                      <ComponentListItem key={component.id} component={component} />
                    ))}
                  </div>
                )}

                {filteredComponents.length === 0 && !loading && (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground mb-4">
                      {components.length === 0
                        ? "No components found. Create your first component!"
                        : "No components found matching your criteria."
                      }
                    </p>
                    {components.length > 0 ? (
                      <Button variant="link" onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }}>
                        Clear filters
                      </Button>
                    ) : (
                      <NewComponentButton>
                        Create Component
                      </NewComponentButton>
                    )}
                  </Card>
                )}
              </>
            )}
          </div>
        </TabsContent>

        {/* Storybook Tab Content */}
        <TabsContent value="storybook" className="space-y-4 mt-0">
          {!isStorybookRunning && !isStorybookLoading ? (
            // Placeholder State
            <Card className="border-2 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-6">
                <div className="rounded-full bg-primary/10 p-6">
                  <BookOpen className="h-12 w-12 text-primary" />
                </div>

                <div className="space-y-2 max-w-md">
                  <h2 className="text-2xl font-semibold">View Your Components in Storybook</h2>
                  <p className="text-muted-foreground">
                    Storybook provides an interactive environment to view and test your components in isolation.
                  </p>
                </div>

                <div className="grid gap-3 text-left max-w-md w-full">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Interactive Component Explorer</p>
                      <p className="text-sm text-muted-foreground">Browse and interact with all your components</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Full Documentation</p>
                      <p className="text-sm text-muted-foreground">View props, usage examples, and stories</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Theme Preview</p>
                      <p className="text-sm text-muted-foreground">Test components in dark and light modes</p>
                    </div>
                  </div>
                </div>

                <Button size="lg" onClick={handleRunStorybook} className="gap-2 text-[color:hsl(var(--hero-button-foreground))]">
                  <PlayCircle className="h-5 w-5" />
                  Run Storybook
                </Button>

                <p className="text-xs text-muted-foreground hidden md:block">
                  Best viewed on desktop devices
                </p>
              </CardContent>
            </Card>
          ) : isStorybookLoading ? (
            // Loading State
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <div className="text-center space-y-2">
                  <p className="font-medium">Loading Storybook...</p>
                  <p className="text-sm text-muted-foreground">This may take a few seconds</p>
                </div>
              </CardContent>
            </Card>
          ) : storybookError ? (
            // Error State
            <Card className="border-destructive">
              <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <div className="text-center space-y-2">
                  <p className="font-medium">Failed to Load Storybook</p>
                  <p className="text-sm text-muted-foreground max-w-md">{storybookError}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleStopStorybook}>
                    Go Back
                  </Button>
                  <Button onClick={handleRunStorybook}>
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Active Storybook View
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span>Storybook is running</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowRebuildModal(true)} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Rebuild Storybook
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleRefreshStorybook} title="Refresh Storybook view" className="gap-2">
                    <RotateCw className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleStopStorybook} className="gap-2">
                    <StopCircle className="h-4 w-4" />
                    Stop Storybook
                  </Button>
                </div>
              </div>

              <Card className="overflow-hidden">
                <iframe
                  src="/storybook-static/index.html"
                  className="w-full h-[calc(100vh-280px)] md:h-[calc(100vh-250px)] border-0"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
                  title="Storybook Viewer"
                  onLoad={handleStorybookLoad}
                  onError={handleStorybookError}
                />
              </Card>

              <div className="text-xs text-muted-foreground text-center md:hidden">
                <AlertCircle className="h-4 w-4 inline mr-1" />
                For the best experience, view Storybook on a desktop device
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CodeModal
        isOpen={codeModal.isOpen}
        onClose={() => setCodeModal({ ...codeModal, isOpen: false })}
        componentName={codeModal.componentName}
        code={codeModal.code}
      />

      <Dialog open={showRebuildModal} onOpenChange={setShowRebuildModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Rebuild Storybook</DialogTitle>
            <DialogDescription>
              To update the Storybook view with your latest changes, run this command in your terminal:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
              <code className="text-sm">npm run build-storybook</code>
              <Button size="sm" variant="ghost" onClick={handleCopyCommand}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>This command will:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Build your Storybook with the latest components</li>
                <li>Generate updated static files</li>
                <li>Include any new stories you've added</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRebuildModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleRefreshAfterBuild}>
              Done - Refresh View
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
