import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Grid, List, Filter, MoreHorizontal, Eye, Download, Copy } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { copyComponentCode, viewInStorybook, exportComponentSpec } from "@/utils/componentActions";

export default function Components() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock component data
  const components = [
    {
      id: 1,
      name: "Button",
      description: "Interactive button component with multiple variants",
      category: "Forms",
      variants: ["Primary", "Secondary", "Outline", "Ghost"],
      lastModified: "2 hours ago",
      status: "Published",
      downloads: 45,
    },
    {
      id: 2,
      name: "Card",
      description: "Flexible container for displaying content",
      category: "Layout",
      variants: ["Default", "Elevated", "Outlined"],
      lastModified: "1 day ago",
      status: "Draft",
      downloads: 23,
    },
    {
      id: 3,
      name: "Modal",
      description: "Overlay dialog for focused interactions",
      category: "Feedback",
      variants: ["Small", "Medium", "Large", "Fullscreen"],
      lastModified: "3 days ago",
      status: "Published",
      downloads: 67,
    },
    {
      id: 4,
      name: "Navigation",
      description: "Top navigation bar with responsive behavior",
      category: "Navigation",
      variants: ["Horizontal", "Sidebar", "Mobile"],
      lastModified: "1 week ago",
      status: "Published",
      downloads: 89,
    },
    {
      id: 5,
      name: "Input",
      description: "Text input field with validation states",
      category: "Forms",
      variants: ["Text", "Email", "Password", "Search"],
      lastModified: "2 weeks ago",
      status: "Published",
      downloads: 156,
    },
    {
      id: 6,
      name: "Table",
      description: "Data table with sorting and filtering",
      category: "Data",
      variants: ["Basic", "Sortable", "Filterable", "Paginated"],
      lastModified: "3 weeks ago",
      status: "Published",
      downloads: 34,
    },
  ];

  const categories = ["all", "Forms", "Layout", "Navigation", "Feedback", "Data", "Media"];

  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const ComponentCard = ({ component }: { component: typeof components[0] }) => (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-heading-md">{component.name}</CardTitle>
            <CardDescription className="mt-1">{component.description}</CardDescription>
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
            <Badge variant={component.status === "Published" ? "default" : "secondary"}>
              {component.status}
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {component.variants.map((variant) => (
              <Badge key={variant} variant="secondary" className="text-xs">
                {variant}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="text-sm text-muted-foreground">
              Status: {component.status}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ComponentListItem = ({ component }: { component: typeof components[0] }) => (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-heading-sm truncate">{component.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{component.description}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Badge variant="outline">{component.category}</Badge>
            <Badge variant={component.status === "Published" ? "default" : "secondary"}>
              {component.status}
            </Badge>
            
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
        <Button className="btn-hero">
          Add Component
        </Button>
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
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
              <TabsTrigger value="grid">
                <Grid className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Components Display */}
      <div className="space-y-4">
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

        {filteredComponents.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No components found matching your criteria.</p>
            <Button variant="link" onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }}>
              Clear filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}