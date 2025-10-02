import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileCode, FileJson } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { componentService } from "@/services/componentService";
import { exportService } from "@/services/exportService";
import { DesignSystemComponent } from "@/types/component";
import { useQuery } from "@tanstack/react-query";

export default function Export() {
  const { toast } = useToast();
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<"figma" | "js" | "tsx">("tsx");
  const [isExporting, setIsExporting] = useState(false);

  // Fetch real components from database
  const { data: components = [], isLoading } = useQuery({
    queryKey: ['user-components'],
    queryFn: componentService.getUserComponents,
  });

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

    </div>
  );
}