import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Grid, List, Filter, MoreHorizontal, Eye, Download, Copy, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { componentService } from "@/services/componentService";
import { DesignSystemComponent } from "@/types/component";
import { toast } from "@/hooks/use-toast";
import { copyComponentCode, viewInStorybook, exportComponentSpec } from "@/utils/componentActions";
import { NewComponentButton } from "@/components/common/NewComponentButton";

export default function Components() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [components, setComponents] = useState<DesignSystemComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    </div>
  );
}