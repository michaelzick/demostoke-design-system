import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, Palette, FileText, Download, Upload, Sparkles, TrendingUp } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useRecentComponents } from "@/hooks/useRecentComponents";
import { viewComponentCode, registerCodeModal } from "@/utils/componentActions";
import { CodeModal } from "@/components/ui/code-modal";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { data: dashboardStats, isLoading } = useDashboardStats();
  const { data: recentComponents = [], isLoading: isLoadingComponents } = useRecentComponents();
  const [codeModal, setCodeModal] = useState({ isOpen: false, componentName: "", code: "" });

  // Register code modal handler
  useEffect(() => {
    registerCodeModal(setCodeModal);
  }, []);

  const stats = [
    {
      label: "Total Components",
      value: isLoading ? "..." : (dashboardStats?.totalComponents?.toString() || "0"),
      icon: Package,
      color: "text-primary"
    },
    {
      label: "Design Tokens",
      value: isLoading ? "..." : (dashboardStats?.designTokens?.toString() || "0"),
      icon: Palette,
      color: "text-accent"
    },
    {
      label: "Documentation Pages",
      value: isLoading ? "..." : (dashboardStats?.documentationPages?.toString() || "0"),
      icon: FileText,
      color: "text-success"
    },
    {
      label: "Team Members",
      value: isLoading ? "..." : (dashboardStats?.teamMembers?.toString() || "0"),
      icon: TrendingUp,
      color: "text-warning"
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-background p-8">
        {/* Right-side decorative slanted bars */}
        <div
          className="pointer-events-none absolute -inset-y-8 right-8 mr-[1em] z-0 flex w-1/2 items-center justify-end gap-0 pr-0"
          aria-hidden="true"
        >
          <div className="h-full w-[65px] rotate-12 bg-primary/90" />
          <div className="h-full w-[65px] rotate-12 bg-orange-400/90" />
          <div className="h-full w-[65px] rotate-12 bg-lime-300/90" />
          <div className="h-full w-[65px] rotate-12 bg-rose-500/90" />
        </div>
        <div className="relative z-10">
          <h1 className="mb-4 text-display-lg text-foreground">DemoStoke Design System</h1>
          <p className="mb-6 text-body-lg text-muted-foreground">
            Create, manage, and scale your design components with enterprise-grade tools
          </p>
          <div className="flex gap-3">
            {/* Use a semantic button that navigates so the button element receives the variant classes */}
            <HeroNewComponent />
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-foreground/20 bg-foreground/10 text-foreground hover:bg-foreground/20"
            >
              <NavLink to="/components">View Library</NavLink>
            </Button>
          </div>
        </div>
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
              {isLoadingComponents ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                      </div>
                      <div className="h-6 w-16 bg-muted rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : recentComponents.length > 0 ? (
                recentComponents.map((component, index) => (
                  <div 
                    key={`${component.name}-${component.variant}-${index}`} 
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => viewComponentCode(component.name)}
                  >
                    <div>
                      <div className="font-medium">{component.name}</div>
                      <div className="text-sm text-muted-foreground">{component.variant} • {component.lastModified}</div>
                    </div>
                    <Badge variant={component.status === "Published" ? "default" : "secondary"}>
                      {component.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No components created yet</p>
                  <Button asChild variant="link" size="sm" className="mt-2">
                    <NavLink to="/new-component">Create your first component</NavLink>
                  </Button>
                </div>
              )}
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

      <CodeModal
        isOpen={codeModal.isOpen}
        onClose={() => setCodeModal({ ...codeModal, isOpen: false })}
        componentName={codeModal.componentName}
        code={codeModal.code}
      />
    </div>
  );
}

function HeroNewComponent() {
  const navigate = useNavigate();

  return (
    <Button size="lg" variant="on-surface" className="text-[color:hsl(var(--hero-button-foreground))]" onClick={() => navigate("/new-component")}>
      <Plus className="mr-2 h-4 w-4" />
      New Component
    </Button>
  );
}
