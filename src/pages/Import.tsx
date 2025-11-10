import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, Code, Link, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Import() {
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    
    // Simulate import process
    setTimeout(() => {
      setIsImporting(false);
      toast({
        title: "Import successful",
        description: `${file.name} has been imported successfully.`,
      });
    }, 2000);
  };

  const handleUrlImport = async (url: string) => {
    if (!url) return;

    setIsImporting(true);
    
    // Simulate URL import
    setTimeout(() => {
      setIsImporting(false);
      toast({
        title: "Import successful",
        description: "Components imported from URL successfully.",
      });
    }, 2000);
  };

  const handleCodeImport = async (code: string) => {
    if (!code.trim()) return;

    setIsImporting(true);
    
    // Simulate code parsing and import
    setTimeout(() => {
      setIsImporting(false);
      toast({
        title: "Import successful",
        description: "Component parsed and imported successfully.",
      });
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-display-md">Import Components</h1>
        <p className="text-body-lg text-muted-foreground">
          Import components from various sources into your design system
        </p>
      </div>

      <Tabs defaultValue="file" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="file" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            File Upload
          </TabsTrigger>
          <TabsTrigger value="url" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            From URL
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Paste Code
          </TabsTrigger>
          <TabsTrigger value="npm" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            NPM Package
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Component Files
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <div className="space-y-4">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-lg font-medium">Drop files here or click to browse</p>
                    <p className="text-sm text-muted-foreground">
                      Supports .tsx, .jsx, .json, .zip files
                    </p>
                  </div>
                  <Input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".tsx,.jsx,.json,.zip"
                    onChange={handleFileImport}
                    className="hidden"
                  />
                  <div className="pt-4">
                    <Label htmlFor="file-upload" className="cursor-pointer inline-block">
                      <Button variant="outline" disabled={isImporting} asChild>
                        <span>
                          {isImporting ? "Importing..." : "Choose Files"}
                        </span>
                      </Button>
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Import Options</Label>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="auto-publish" defaultChecked />
                  <Label htmlFor="auto-publish" className="text-sm">
                    Automatically publish imported components
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="overwrite" />
                  <Label htmlFor="overwrite" className="text-sm">
                    Overwrite existing components with same name
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="url">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Import from URL
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="component-url">Component URL</Label>
                <Input
                  id="component-url"
                  placeholder="https://example.com/components/Button.tsx"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUrlImport((e.target as HTMLInputElement).value);
                    }
                  }}
                />
                <p className="text-sm text-muted-foreground">
                  Import components directly from GitHub, CodePen, or other sources
                </p>
              </div>

              <div className="space-y-2">
                <Label>Supported Sources</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    GitHub raw files
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    CodePen exports
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    JSFiddle exports
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Direct file URLs
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => {
                  const input = document.getElementById('component-url') as HTMLInputElement;
                  handleUrlImport(input.value);
                }}
                disabled={isImporting}
                className="w-full"
              >
                {isImporting ? "Importing..." : "Import from URL"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Paste Component Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="component-code">Component Code</Label>
                <Textarea
                  id="component-code"
                  placeholder="Paste your React component code here..."
                  rows={12}
                  className="font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground">
                  Paste TypeScript/JavaScript React component code
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="component-name">Component Name</Label>
                <Input
                  id="component-name"
                  placeholder="ButtonComponent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="component-category">Category</Label>
                <Input
                  id="component-category"
                  placeholder="Forms"
                />
              </div>

              <Button 
                onClick={() => {
                  const code = (document.getElementById('component-code') as HTMLTextAreaElement).value;
                  handleCodeImport(code);
                }}
                disabled={isImporting}
                className="w-full"
              >
                {isImporting ? "Parsing..." : "Parse and Import"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="npm">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Import from NPM Package
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="package-name">Package Name</Label>
                <Input
                  id="package-name"
                  placeholder="@radix-ui/react-button"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="package-version">Version (optional)</Label>
                <Input
                  id="package-version"
                  placeholder="latest"
                />
              </div>

              <div className="space-y-2">
                <Label>Popular Packages</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    "@radix-ui/react-button",
                    "@headlessui/react",
                    "react-hook-form",
                    "@tanstack/react-table"
                  ].map((pkg) => (
                    <Button
                      key={pkg}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        (document.getElementById('package-name') as HTMLInputElement).value = pkg;
                      }}
                    >
                      {pkg}
                    </Button>
                  ))}
                </div>
              </div>

              <Button disabled={isImporting} className="w-full">
                {isImporting ? "Installing..." : "Install and Import"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}