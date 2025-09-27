import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Search, ExternalLink, Book, Code, Layers } from "lucide-react";
import { useState } from "react";

export default function Documentation() {
  const [searchTerm, setSearchTerm] = useState("");

  const docSections = [
    {
      title: "Getting Started",
      icon: Book,
      items: [
        { title: "Installation", description: "Set up the design system in your project", status: "Complete" },
        { title: "Quick Start Guide", description: "Get up and running in minutes", status: "Complete" },
        { title: "Configuration", description: "Customize tokens and settings", status: "In Progress" },
      ]
    },
    {
      title: "Components",
      icon: Layers,
      items: [
        { title: "Button Component", description: "Interactive buttons with variants", status: "Complete" },
        { title: "Card Component", description: "Flexible content containers", status: "Complete" },
        { title: "Form Components", description: "Input fields and form controls", status: "Complete" },
        { title: "Navigation", description: "Navigation patterns and components", status: "In Progress" },
      ]
    },
    {
      title: "Patterns",
      icon: Code,
      items: [
        { title: "Layout Patterns", description: "Common layout structures", status: "Complete" },
        { title: "Data Display", description: "Tables, lists, and data visualization", status: "In Progress" },
        { title: "User Feedback", description: "Modals, toasts, and alerts", status: "Draft" },
      ]
    }
  ];

  const resources = [
    {
      title: "Storybook",
      description: "Interactive component explorer",
      url: "http://localhost:6006",
      external: true
    },
    {
      title: "Figma Library",
      description: "Design files and components",
      url: "/figma",
      external: false
    },
    {
      title: "GitHub Repository",
      description: "Source code and contributions",
      url: "/demostoke-design-system",
      external: true
    }
  ];

  const filteredSections = docSections.map(section => ({
    ...section,
    items: section.items.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-display-md">Documentation</h1>
        <p className="text-body-lg text-muted-foreground">
          Comprehensive guides and API documentation for the design system
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search documentation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quick Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {resources.map((resource) => (
          <Card key={resource.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a 
                    href={resource.url} 
                    target={resource.external ? "_blank" : "_self"}
                    rel={resource.external ? "noopener noreferrer" : undefined}
                  >
                    {resource.external ? <ExternalLink className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Documentation Sections */}
      <div className="space-y-6">
        {filteredSections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <section.icon className="h-5 w-5" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <div key={item.title} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={
                          item.status === "Complete" ? "default" : 
                          item.status === "In Progress" ? "secondary" : 
                          "outline"
                        }
                      >
                        {item.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSections.length === 0 && searchTerm && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No documentation found matching your search.</p>
          <Button variant="link" onClick={() => setSearchTerm("")}>
            Clear search
          </Button>
        </Card>
      )}
    </div>
  );
}