import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, Palette, FileText, Download, Upload, Sparkles, TrendingUp } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Dashboard() {
  const recentComponents = [
    { name: "Button", variant: "Primary", lastModified: "2 hours ago", status: "Published" },
    { name: "Card", variant: "Default", lastModified: "1 day ago", status: "Draft" },
    { name: "Modal", variant: "Large", lastModified: "3 days ago", status: "Published" },
    { name: "Input", variant: "Search", lastModified: "1 week ago", status: "Published" },
  ];

  const stats = [
    { label: "Total Components", value: "24", icon: Package, color: "text-primary" },
    { label: "Design Tokens", value: "156", icon: Palette, color: "text-accent" },
    { label: "Documentation Pages", value: "8", icon: FileText, color: "text-success" },
    { label: "Team Members", value: "12", icon: TrendingUp, color: "text-warning" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-primary p-8 text-primary-foreground">
        <div className="relative z-10">
          <h1 className="text-display-lg mb-4">Welcome to DemoStoke Design System</h1>
          <p className="text-body-lg mb-6 opacity-90">
            Create, manage, and scale your design components with enterprise-grade tools
          </p>
          <div className="flex gap-3">
            <Button asChild variant="secondary" size="lg">
              <NavLink to="/new-component">
                <Plus className="h-4 w-4 mr-2" />
                New Component
              </NavLink>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <NavLink to="/components">
                View Library
              </NavLink>
            </Button>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10 opacity-20"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Components */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Recent Components
            </CardTitle>
            <CardDescription>
              Components you've been working on recently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentComponents.map((component) => (
                <div key={`${component.name}-${component.variant}`} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div>
                    <div className="font-medium">{component.name}</div>
                    <div className="text-sm text-muted-foreground">{component.variant} • {component.lastModified}</div>
                  </div>
                  <Badge variant={component.status === "Published" ? "default" : "secondary"}>
                    {component.status}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button asChild variant="ghost" className="w-full">
                <NavLink to="/components">View All Components</NavLink>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and tools for your design system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start">
              <NavLink to="/new-component">
                <Plus className="h-4 w-4 mr-2" />
                Create New Component
              </NavLink>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <NavLink to="/ai-generate">
                <Sparkles className="h-4 w-4 mr-2" />
                AI Generate Component
              </NavLink>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <NavLink to="/import">
                <Upload className="h-4 w-4 mr-2" />
                Import from Figma
              </NavLink>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <NavLink to="/export">
                <Download className="h-4 w-4 mr-2" />
                Export Design Tokens
              </NavLink>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <NavLink to="/tokens">
                <Palette className="h-4 w-4 mr-2" />
                Manage Design Tokens
              </NavLink>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <NavLink to="/docs">
                <FileText className="h-4 w-4 mr-2" />
                View Documentation
              </NavLink>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Notice about Supabase */}
      <Card className="border-warning/20 bg-warning/5">
        <CardHeader>
          <CardTitle className="text-warning">Backend Integration Required</CardTitle>
          <CardDescription>
            To enable AI component generation, Figma sync, and component storage, connect your project to Supabase.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Click the green Supabase button in the top right to connect your project and unlock advanced features like:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mb-4">
            <li>AI-powered component generation with GPT-4o</li>
            <li>Component storage and versioning</li>
            <li>Figma integration and sync</li>
            <li>Team collaboration features</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}