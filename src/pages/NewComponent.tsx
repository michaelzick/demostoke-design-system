import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, Wand2, AlertTriangle, Loader2, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { componentService } from "@/services/componentService";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function NewComponent() {
  const [prompt, setPrompt] = useState("");
  const [componentName, setComponentName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const checkConnection = async () => {
      setIsConnected(componentService.isConnected());
    };
    checkConnection();
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim() || !componentName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both component name and description.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to generate components.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const response = await componentService.generateComponent({
        componentName,
        prompt,
        userId: user.id
      });

      if (response.success && response.component) {
        toast({
          title: "Component Generated!",
          description: `${componentName} has been created successfully.`,
        });
        
        // Navigate to components page to show the new component
        navigate("/components");
      } else {
        throw new Error(response.error || "Failed to generate component");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const examplePrompts = [
    "A modern pricing card with three tiers, featuring gradient backgrounds and hover animations",
    "A sleek navigation menu with dropdown functionality and mobile responsiveness",
    "A testimonial carousel with autoplay and manual navigation controls",
    "A feature showcase grid with icons, descriptions, and call-to-action buttons",
    "A contact form with validation, error states, and success feedback"
  ];

  return (
    <ProtectedRoute>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-display-md">Create New Component</h1>
          <p className="text-body-lg text-muted-foreground">
            Use AI to generate React components based on your description, or create them manually.
          </p>
        </div>

      {/* Connection Status */}
      {isConnected ? (
        isAuthenticated ? (
          <Alert className="border-success/20 bg-success/5">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertDescription className="text-success">
              <strong>Ready to Generate:</strong> AI component generation is enabled and you're signed in.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-warning/20 bg-warning/5">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-warning">
              <strong>Sign In Required:</strong> Please sign in to generate and save components.
            </AlertDescription>
          </Alert>
        )
      ) : (
        <Alert className="border-warning/20 bg-warning/5">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertDescription className="text-warning">
            <strong>Backend Integration Required:</strong> Connect to Supabase to enable AI component generation with GPT-4o.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Generation Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Component Generator
            </CardTitle>
            <CardDescription>
              Describe the component you want to create and let AI build it for you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="component-name">Component Name</Label>
              <Input
                id="component-name"
                placeholder="e.g., PricingCard, NavigationMenu"
                value={componentName}
                onChange={(e) => setComponentName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt">Describe your component</Label>
              <Textarea
                id="prompt"
                placeholder="Describe the component you want to create. Be specific about styling, functionality, and behavior..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={8}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {prompt.length}/500 characters
              </p>
            </div>

            <Button 
              onClick={handleGenerate}
              disabled={!prompt.trim() || !componentName.trim() || isGenerating || !isConnected || !isAuthenticated}
              className="w-full btn-hero"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Component...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Component
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Example Prompts */}
        <Card>
          <CardHeader>
            <CardTitle>Example Prompts</CardTitle>
            <CardDescription>
              Get inspired by these example component descriptions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {examplePrompts.map((example, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => setPrompt(example)}
              >
                <p className="text-sm">{example}</p>
              </div>
            ))}
            
            <div className="pt-4 border-t">
              <h4 className="text-heading-sm mb-2">Pro Tips:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Be specific about styling and colors</li>
                <li>• Mention interactive behaviors</li>
                <li>• Include responsive requirements</li>
                <li>• Specify accessibility needs</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manual Creation Options */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Creation</CardTitle>
          <CardDescription>
            Create components manually using traditional methods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold">{"</>"}</span>
              </div>
              <span>Start from Code</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col gap-2">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <span className="text-accent font-bold">📐</span>
              </div>
              <span>Import from Figma</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col gap-2">
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                <span className="text-success font-bold">📋</span>
              </div>
              <span>Use Template</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Component Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Component Categories</CardTitle>
          <CardDescription>
            Browse by component type to find inspiration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {["Navigation", "Forms", "Cards", "Buttons", "Modals", "Tables", "Charts", "Media", "Feedback", "Layout"].map((category) => (
              <Badge key={category} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </ProtectedRoute>
  );
}