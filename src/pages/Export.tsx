import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileCode, FileJson, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { componentService } from "@/services/componentService";
import { exportService } from "@/services/exportService";
import { DesignSystemComponent } from "@/types/component";
import { useQuery } from "@tanstack/react-query";
import { typographyTokens, spacingTokens, radiusTokens } from "@/lib/designTokens";
import { useAuth } from "@/contexts/AuthContext";
import { AuthRequiredCard } from "@/components/common/AuthRequiredCard";

export default function Export() {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<"figma" | "js" | "tsx">("figma");
  const [isExporting, setIsExporting] = useState(false);

  // Token export states
  const [selectedTokenCategories, setSelectedTokenCategories] = useState<string[]>([]);
  const [tokenExportFormat, setTokenExportFormat] = useState<"figma-variables" | "figma-simple" | "css">("figma-variables");
  const [darkModeFormat, setDarkModeFormat] = useState({
    classSelector: true,
    mediaQuery: false,
  });
  const [isExportingTokens, setIsExportingTokens] = useState(false);

  // Fetch real components from database
  const { data: components = [], isLoading } = useQuery({
    queryKey: ['user-components'],
    queryFn: componentService.getUserComponents,
    enabled: isAuthenticated,
  });

  // Token categories
  const tokenCategories = [
    { 
      id: 'colors', 
      label: 'Colors', 
      description: 'Core color tokens',
      count: exportService.getBaseColorTokens().length 
    },
    { 
      id: 'sidebar', 
      label: 'Sidebar', 
      description: 'Sidebar component colors',
      count: exportService.getSidebarColorTokens().length 
    },
    { 
      id: 'typography', 
      label: 'Typography', 
      description: 'Typography scale',
      count: typographyTokens.length 
    },
    { 
      id: 'spacing', 
      label: 'Spacing', 
      description: 'Spacing and radius',
      count: spacingTokens.length + radiusTokens.length 
    },
  ];

  const handleComponentSelect = (componentId: string, checked: boolean) => {
    if (checked) {
      setSelectedComponents([...selectedComponents, componentId]);
    } else {
      setSelectedComponents(selectedComponents.filter(id => id !== componentId));
    }
  };

  const handleSelectAll = () => {
    if (selectedComponents.length === components.length) {
      setSelectedComponents([]);
    } else {
      setSelectedComponents(components.map(c => c.id));
    }
  };

  const handleExport = async () => {
    if (selectedComponents.length === 0) {
      toast({
        title: "No components selected",
        description: "Please select at least one component to export.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    
    try {
      // Get selected component objects
      const componentsToExport = components.filter(c => 
        selectedComponents.includes(c.id)
      );

      let blob: Blob;
      let filename: string;

      // Export based on selected format
      switch (exportFormat) {
        case "figma":
          blob = await exportService.exportToFigma(componentsToExport);
          filename = `design-system-figma-${Date.now()}.zip`;
          break;
        case "js":
          blob = await exportService.exportToJS(componentsToExport);
          filename = `design-system-js-${Date.now()}.zip`;
          break;
        case "tsx":
          blob = await exportService.exportToTSX(componentsToExport);
          filename = `design-system-tsx-${Date.now()}.zip`;
          break;
        default:
          throw new Error("Invalid export format");
      }

      // Download the file
      exportService.downloadFile(blob, filename);

      toast({
        title: "Export successful",
        description: `${selectedComponents.length} component(s) exported as ${exportFormat.toUpperCase()}.`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "An error occurred during export.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleTokenCategorySelect = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedTokenCategories([...selectedTokenCategories, categoryId]);
    } else {
      setSelectedTokenCategories(selectedTokenCategories.filter(id => id !== categoryId));
    }
  };

  const handleTokenSelectAll = () => {
    if (selectedTokenCategories.length === tokenCategories.length) {
      setSelectedTokenCategories([]);
    } else {
      setSelectedTokenCategories(tokenCategories.map(c => c.id));
    }
  };

  const handleTokenExport = async () => {
    if (selectedTokenCategories.length === 0) {
      toast({
        title: "No categories selected",
        description: "Please select at least one token category to export.",
        variant: "destructive",
      });
      return;
    }

    setIsExportingTokens(true);
    
    try {
      let blob: Blob;
      let filename: string;

      switch (tokenExportFormat) {
        case "figma-variables":
          blob = await exportService.exportTokensToFigmaVariables(selectedTokenCategories);
          filename = `design-tokens-figma-variables-${Date.now()}.zip`;
          break;
        case "figma-simple":
          blob = await exportService.exportTokensToFigmaSimple(selectedTokenCategories);
          filename = `design-tokens-figma-simple-${Date.now()}.zip`;
          break;
        case "css":
          blob = await exportService.exportTokensToCSS(selectedTokenCategories, darkModeFormat);
          filename = `design-tokens-css-${Date.now()}.zip`;
          break;
        default:
          throw new Error("Invalid token export format");
      }

      exportService.downloadFile(blob, filename);

      toast({
        title: "Export successful",
        description: `${selectedTokenCategories.length} token category(s) exported.`,
      });
    } catch (error) {
      console.error("Token export error:", error);
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "An error occurred during export.",
        variant: "destructive",
      });
    } finally {
      setIsExportingTokens(false);
    }
  };

  if (!isAuthenticated) {
    return <AuthRequiredCard />;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-display-md">Export Components</h1>
        <p className="text-body-lg text-muted-foreground">
          Export your design system components in various formats
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Component Selection */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Select Components</CardTitle>
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  {selectedComponents.length === components.length ? "Deselect All" : "Select All"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-muted-foreground">Loading components...</div>
                </div>
              ) : components.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-muted-foreground mb-2">No components found</p>
                  <p className="text-sm text-muted-foreground">Create components first to export them</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {components.map((component) => (
                    <div
                      key={component.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={selectedComponents.includes(component.id)}
                          onCheckedChange={(checked) => 
                            handleComponentSelect(component.id, checked as boolean)
                          }
                        />
                        <div>
                          <p className="font-medium">{component.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {component.category}
                            </Badge>
                            <Badge variant={component.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                              {component.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Export Options */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Export Format</label>
                <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as "figma" | "js" | "tsx")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="figma">
                      <div className="flex items-center gap-2">
                        <FileJson className="h-4 w-4" />
                        Figma (JSON)
                      </div>
                    </SelectItem>
                    <SelectItem value="js">
                      <div className="flex items-center gap-2">
                        <FileCode className="h-4 w-4" />
                        JavaScript (JSX)
                      </div>
                    </SelectItem>
                    <SelectItem value="tsx">
                      <div className="flex items-center gap-2">
                        <FileCode className="h-4 w-4" />
                        TypeScript (TSX)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {exportFormat === "figma" && "Export as Figma-compatible JSON format"}
                  {exportFormat === "js" && "Export as JavaScript React components"}
                  {exportFormat === "tsx" && "Export as TypeScript React components with full type definitions"}
                </p>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground mb-2">
                  Selected: {selectedComponents.length} component(s)
                </div>
                <Button 
                  onClick={handleExport}
                  disabled={isExporting || selectedComponents.length === 0}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? "Exporting..." : "Export Components"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Export Design Tokens Section */}
      <div className="mt-8">
        <div className="mb-6">
          <h2 className="text-display-md flex items-center gap-2">
            <Palette className="h-8 w-8" />
            Export Design Tokens
          </h2>
          <p className="text-body-lg text-muted-foreground">
            Export your design system tokens in various formats
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Token Selection */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Select Tokens</CardTitle>
                  <Button variant="outline" size="sm" onClick={handleTokenSelectAll}>
                    {selectedTokenCategories.length === tokenCategories.length ? "Deselect All" : "Select All"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tokenCategories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={selectedTokenCategories.includes(category.id)}
                          onCheckedChange={(checked) => 
                            handleTokenCategorySelect(category.id, checked as boolean)
                          }
                        />
                        <div>
                          <p className="font-medium">{category.label}</p>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {category.count} tokens
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Token Export Options */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Export Format</label>
                  <Select 
                    value={tokenExportFormat} 
                    onValueChange={(value) => setTokenExportFormat(value as "figma-variables" | "figma-simple" | "css")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="figma-variables">
                        <div className="flex items-center gap-2">
                          <FileJson className="h-4 w-4" />
                          Figma (Variable Collection)
                        </div>
                      </SelectItem>
                      <SelectItem value="figma-simple">
                        <div className="flex items-center gap-2">
                          <FileJson className="h-4 w-4" />
                          Figma (Simple JSON)
                        </div>
                      </SelectItem>
                      <SelectItem value="css">
                        <div className="flex items-center gap-2">
                          <FileCode className="h-4 w-4" />
                          CSS Variables
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {tokenExportFormat === "figma-variables" && "Export as Figma's official variable collection format"}
                    {tokenExportFormat === "figma-simple" && "Export as simple, easy-to-parse JSON files"}
                    {tokenExportFormat === "css" && "Export as CSS custom properties"}
                  </p>
                </div>

                {/* Dark Mode Options for CSS */}
                {tokenExportFormat === "css" && (
                  <div className="space-y-2 pt-2 border-t">
                    <label className="text-sm font-medium">Dark Mode Format</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="dark-class"
                          checked={darkModeFormat.classSelector}
                          onCheckedChange={(checked) => 
                            setDarkModeFormat(prev => ({ ...prev, classSelector: checked as boolean }))
                          }
                        />
                        <label 
                          htmlFor="dark-class"
                          className="text-sm cursor-pointer"
                        >
                          .dark class selector
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="dark-media"
                          checked={darkModeFormat.mediaQuery}
                          onCheckedChange={(checked) => 
                            setDarkModeFormat(prev => ({ ...prev, mediaQuery: checked as boolean }))
                          }
                        />
                        <label 
                          htmlFor="dark-media"
                          className="text-sm cursor-pointer"
                        >
                          @media prefers-color-scheme
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-2">
                    Selected: {selectedTokenCategories.length} category(s)
                  </div>
                  <Button 
                    onClick={handleTokenExport}
                    disabled={isExportingTokens || selectedTokenCategories.length === 0}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isExportingTokens ? "Exporting..." : "Export Tokens"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

    </div>
  );
}
