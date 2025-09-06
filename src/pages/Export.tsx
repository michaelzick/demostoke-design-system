import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Package, FileText, Code, Archive } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Export() {
  const { toast } = useToast();
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState("zip");
  const [isExporting, setIsExporting] = useState(false);

  const components = [
    { id: "button", name: "Button", category: "Forms", size: "12kb" },
    { id: "card", name: "Card", category: "Layout", size: "8kb" },
    { id: "modal", name: "Modal", category: "Feedback", size: "15kb" },
    { id: "input", name: "Input", category: "Forms", size: "10kb" },
    { id: "navigation", name: "Navigation", category: "Navigation", size: "18kb" },
    { id: "table", name: "Table", category: "Data", size: "25kb" },
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
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Export successful",
        description: `${selectedComponents.length} component(s) exported as ${exportFormat.toUpperCase()}.`,
      });
    }, 2000);
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
                          <span>{component.size}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zip">
                      <div className="flex items-center gap-2">
                        <Archive className="h-4 w-4" />
                        ZIP Archive
                      </div>
                    </SelectItem>
                    <SelectItem value="npm">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        NPM Package
                      </div>
                    </SelectItem>
                    <SelectItem value="json">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        JSON Spec
                      </div>
                    </SelectItem>
                    <SelectItem value="storybook">
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        Storybook
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Include</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="include-types" defaultChecked />
                    <label htmlFor="include-types" className="text-sm">
                      TypeScript definitions
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="include-stories" defaultChecked />
                    <label htmlFor="include-stories" className="text-sm">
                      Storybook stories
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="include-tests" />
                    <label htmlFor="include-tests" className="text-sm">
                      Unit tests
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="include-docs" defaultChecked />
                    <label htmlFor="include-docs" className="text-sm">
                      Documentation
                    </label>
                  </div>
                </div>
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

      {/* Export History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Exports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Button + Card Components", format: "ZIP", date: "2 hours ago", size: "45kb" },
              { name: "Form Components Package", format: "NPM", date: "1 day ago", size: "120kb" },
              { name: "Complete Design System", format: "Storybook", date: "3 days ago", size: "2.5mb" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.format} • {item.size} • {item.date}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}