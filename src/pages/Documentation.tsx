import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Search, 
  ExternalLink, 
  Book, 
  Code, 
  Layers, 
  Package, 
  Palette,
  Upload,
  Download,
  Figma,
  ChevronRight,
  CheckCircle2,
  Copy,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";

export default function Documentation() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openSections, setOpenSections] = useState<string[]>(["getting-started"]);

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const resources = [
    {
      title: "Storybook",
      description: "Interactive component explorer",
      url: "http://localhost:6006",
      external: true,
      icon: Book
    },
    {
      title: "Figma Sync",
      description: "Connect and sync with Figma",
      url: "/figma",
      external: false,
      icon: Figma
    },
    {
      title: "Component Library",
      description: "Browse all components",
      url: "/components",
      external: false,
      icon: Package
    }
  ];

  const docContent = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: Book,
      sections: [
        {
          title: "What is DemoStoke Design System?",
          content: `DemoStoke is a comprehensive design system built to streamline the creation and management of consistent, accessible, and scalable user interfaces. It provides a unified set of design tokens, reusable components, and tools for seamless collaboration between designers and developers.`,
          features: [
            "Centralized component library with React/TypeScript",
            "Design token management for colors, typography, spacing, and more",
            "Figma integration for design-to-code synchronization",
            "Import/Export capabilities for flexible workflows",
            "Built-in accessibility and responsive design patterns"
          ]
        },
        {
          title: "Quick Start Guide",
          content: `Get up and running with DemoStoke in minutes:`,
          steps: [
            "Navigate to the Dashboard to view system statistics and recent activity",
            "Explore Components to browse and use pre-built UI elements",
            "Visit Tokens to customize your design system's visual language",
            "Use Import to add external components or specifications",
            "Connect Figma Sync to keep designs and code in perfect harmony"
          ]
        }
      ]
    },
    {
      id: "components",
      title: "Components",
      icon: Package,
      sections: [
        {
          title: "Understanding Components",
          content: `Components are reusable UI building blocks that follow the design system's standards. Each component is a self-contained piece of functionality with consistent styling, behavior, and API.`,
          details: [
            {
              label: "Component Structure",
              text: "Every component includes a name, description, category, code implementation, props schema, tags, and version information."
            },
            {
              label: "Component Lifecycle",
              text: "Components progress through three states: Draft (in development), Published (ready for production), and Deprecated (marked for removal)."
            },
            {
              label: "Categories",
              text: "Components are organized into categories such as Forms, Navigation, Layout, Data Display, Feedback, and Overlays for easy discovery."
            }
          ]
        },
        {
          title: "Working with Components",
          content: `The Components page provides powerful tools for discovering and using components:`,
          features: [
            {
              name: "View Modes",
              desc: "Toggle between Grid and List views to suit your browsing preference"
            },
            {
              name: "Search & Filter",
              desc: "Find components by name, description, or filter by category and tags"
            },
            {
              name: "View Code",
              desc: "Click any component to open a modal with syntax-highlighted code"
            },
            {
              name: "Copy to Clipboard",
              desc: "One-click copying of component code for instant use in your project"
            },
            {
              name: "Storybook Integration",
              desc: "Launch Storybook to interact with components in an isolated environment"
            },
            {
              name: "Status Badges",
              desc: "Quickly identify Published vs Draft components with visual indicators"
            }
          ]
        }
      ]
    },
    {
      id: "tokens",
      title: "Design Tokens",
      icon: Palette,
      sections: [
        {
          title: "Token System Overview",
          content: `Design tokens are the foundation of visual consistency in DemoStoke. They are design decisions stored as data—variables that define colors, typography, spacing, and other visual properties that can be shared across platforms and tools.`,
          categories: [
            {
              name: "Core Color Tokens (18 tokens)",
              items: [
                "--background: Main background color for the application",
                "--foreground: Primary text color on background surfaces",
                "--card / --card-foreground: Card containers and their text",
                "--popover / --popover-foreground: Popover surfaces and text",
                "--primary / --primary-foreground: Brand color and text on brand surfaces",
                "--secondary / --secondary-foreground: Secondary UI elements",
                "--muted / --muted-foreground: Muted backgrounds and subtle text",
                "--accent / --accent-foreground: Accent colors for emphasis",
                "--destructive / --destructive-foreground: Error/danger states",
                "--border: Border color for dividers and outlines",
                "--input: Form input border color",
                "--ring: Focus ring color for accessibility"
              ]
            },
            {
              name: "Sidebar Tokens (9 tokens)",
              items: [
                "--sidebar-background / --sidebar-foreground: Sidebar surfaces",
                "--sidebar-primary / --sidebar-primary-foreground: Sidebar primary elements",
                "--sidebar-accent / --sidebar-accent-foreground: Sidebar accents",
                "--sidebar-border: Sidebar borders",
                "--sidebar-ring: Sidebar focus indicators"
              ]
            },
            {
              name: "Typography Tokens (6 scales)",
              items: [
                "display-lg: 3rem (48px) - Hero headlines",
                "display-md: 2.25rem (36px) - Section headers",
                "heading-lg: 1.875rem (30px) - Major headings",
                "heading-md: 1.5rem (24px) - Standard headings",
                "body-lg: 1.125rem (18px) - Large body text",
                "body-sm: 0.875rem (14px) - Small body text"
              ]
            },
            {
              name: "Spacing & Radii",
              items: [
                "Spacing: 2xs (0.25rem) through 3xl (3rem) for consistent margins and padding",
                "Radius: sm (0.25rem) through xl (1rem) for border rounding"
              ]
            }
          ]
        },
        {
          title: "Using Design Tokens",
          content: `Design tokens are implemented as CSS custom properties and can be used in multiple ways:`,
          examples: [
            {
              method: "CSS Variables (Direct)",
              code: `.my-element {\n  background-color: var(--background);\n  color: var(--foreground);\n  border-radius: var(--radius-md);\n}`
            },
            {
              method: "Tailwind CSS (via HSL)",
              code: `<div className="bg-background text-foreground rounded-md">\n  {/* Uses design system tokens */}\n</div>`
            },
            {
              method: "Component Styling",
              code: `const Button = styled.button\`\n  background: hsl(var(--primary));\n  color: hsl(var(--primary-foreground));\n\`;`
            }
          ],
          tips: [
            "Always use semantic tokens (e.g., --primary) instead of direct colors for theme consistency",
            "Tokens automatically adapt to light/dark mode based on user preference",
            "Copy individual token values using the copy button next to each token",
            "Changes to tokens cascade throughout all components using them"
          ]
        }
      ]
    },
    {
      id: "import",
      title: "Importing Components",
      icon: Upload,
      sections: [
        {
          title: "Import Methods Overview",
          content: `DemoStoke provides four flexible methods to import components and specifications into your design system. Each method is optimized for different use cases and workflows.`
        },
        {
          title: "Method 1: File Upload",
          content: `Upload component files directly from your local system.`,
          details: [
            {
              label: "Supported Formats",
              text: ".tsx (TypeScript React), .jsx (JavaScript React), .json (Component definitions), .zip (Bulk imports)"
            },
            {
              label: "How to Use",
              text: "Drag and drop files into the upload area, or click 'Choose Files' to browse your system"
            },
            {
              label: "Import Options",
              text: "Auto-publish: Automatically mark imported components as Published (enabled by default). Overwrite: Replace existing components with the same name"
            },
            {
              label: "Best For",
              text: "Bulk component imports, migrating existing component libraries, uploading component packages"
            }
          ]
        },
        {
          title: "Method 2: From URL",
          content: `Import components directly from web URLs.`,
          details: [
            {
              label: "Supported Sources",
              text: "GitHub raw files (raw.githubusercontent.com), CodePen exports, JSFiddle exports, Direct file URLs (.tsx, .jsx, .json)"
            },
            {
              label: "How to Use",
              text: "Paste the URL into the input field and press Enter or click Import"
            },
            {
              label: "URL Format",
              text: "Must point directly to a component file (not a repository page)"
            },
            {
              label: "Best For",
              text: "Importing public components from repositories, sharing components across teams, quick prototyping from examples"
            }
          ]
        },
        {
          title: "Method 3: Paste Code",
          content: `Directly paste React component code for immediate import.`,
          details: [
            {
              label: "Required Fields",
              text: "Component Code: TypeScript or JavaScript React component. Component Name: Identifier for your component. Category: Component type (Forms, Navigation, Layout, etc.)"
            },
            {
              label: "Auto-Detection",
              text: "The parser automatically analyzes component structure, extracts props, identifies dependencies, and generates documentation hints"
            },
            {
              label: "Code Format",
              text: "Accepts functional or class components, TypeScript or JavaScript, with or without JSX"
            },
            {
              label: "Best For",
              text: "Quick single-component imports, prototyping new components, converting snippets to design system components"
            }
          ]
        },
        {
          title: "Method 4: NPM Package",
          content: `Install components from the npm registry.`,
          details: [
            {
              label: "Popular Packages",
              text: "@radix-ui/react-* (Accessible primitives), @headlessui/react (Unstyled components), react-hook-form (Form management), @tanstack/react-table (Data tables)"
            },
            {
              label: "How to Use",
              text: "Select a package from the dropdown or enter a custom package name. Optionally specify a version (defaults to 'latest'). Click Install to add to your design system"
            },
            {
              label: "Version Control",
              text: "Leave version empty for latest release, or specify exact version (e.g., '1.2.3')"
            },
            {
              label: "Best For",
              text: "Integrating established component libraries, accessing maintained open-source components, building on proven foundations"
            }
          ]
        }
      ]
    },
    {
      id: "export",
      title: "Exporting Components & Tokens",
      icon: Download,
      sections: [
        {
          title: "Component Export",
          content: `Export your components in multiple formats for different use cases:`,
          formats: [
            {
              name: "Figma (JSON)",
              desc: "Figma-compatible JSON format for seamless design handoff and documentation",
              use: "Share with designers, import into Figma plugins, create design specs"
            },
            {
              name: "JavaScript (JSX)",
              desc: "React components without TypeScript type definitions",
              use: "JavaScript projects, quick prototypes, legacy codebases"
            },
            {
              name: "TypeScript (TSX)",
              desc: "React components with full TypeScript types and interfaces (recommended)",
              use: "Modern React applications, type-safe projects, production code"
            }
          ],
          process: [
            "Navigate to the Export page",
            "Select individual components or click 'Select All' for bulk export",
            "Choose your preferred format (Figma JSON, JavaScript, or TypeScript)",
            "Click the download button to receive a ZIP file",
            "Filename format: design-system-{format}-{timestamp}.zip"
          ]
        },
        {
          title: "Design Tokens Export",
          content: `Export design tokens in three specialized formats:`,
          formats: [
            {
              name: "Figma Variable Collection",
              desc: "Official Figma variables format for native integration with Figma's variable system",
              features: [
                "Direct import into Figma files",
                "Automatic light/dark mode support",
                "Semantic token naming preserved",
                "Full color, typography, and spacing tokens"
              ]
            },
            {
              name: "JSON Format",
              desc: "Simple, parseable JSON structure for custom tooling and integrations",
              features: [
                "Easy to parse programmatically",
                "Works with Style Dictionary and similar tools",
                "Includes all token categories and values",
                "Light/dark mode values separated"
              ]
            },
            {
              name: "CSS Variables",
              desc: "Ready-to-use CSS custom properties for web projects",
              features: [
                "Drop into any CSS/SCSS project",
                "Two dark mode options: .dark class or @media query",
                "Includes all color, sidebar, typography, spacing, and radii tokens",
                "HSL color format for manipulation flexibility"
              ]
            }
          ],
          categories: [
            "Colors: 18 core color tokens for complete theming",
            "Sidebar: 9 specialized tokens for sidebar styling",
            "Typography: 6 scale levels from display to body text",
            "Spacing & Radii: Consistent spacing and border radius values"
          ],
          cssOptions: [
            "Dark Mode via Class: Use .dark class selector for manual dark mode toggling",
            "Dark Mode via Media Query: Use @media (prefers-color-scheme: dark) for system-based dark mode",
            "Both options can be enabled simultaneously for maximum flexibility"
          ]
        }
      ]
    },
    {
      id: "figma",
      title: "Figma Integration",
      icon: Figma,
      sections: [
        {
          title: "What is Figma Sync?",
          content: `Figma Sync creates a bridge between your DemoStoke design system and Figma design files, enabling bi-directional synchronization. Keep your components aligned with design specifications and maintain a single source of truth across design and development.`,
          benefits: [
            "Real-time component mapping between code and design",
            "Automatic detection of design changes",
            "Centralized file management from multiple projects",
            "Team collaboration with shared access tokens",
            "Version tracking and sync history"
          ]
        },
        {
          title: "Setup & Connection",
          content: `Connect DemoStoke to your Figma account in three steps:`,
          steps: [
            {
              step: "Generate Personal Access Token",
              details: [
                "Visit your Figma Account Settings (figma.com/settings)",
                "Navigate to 'Personal Access Tokens' section",
                "Click 'Create new token'",
                "Name your token (e.g., 'DemoStoke Design System')",
                "Copy the token immediately (it won't be shown again)",
                "Store securely—never commit to version control"
              ]
            },
            {
              step: "Connect to DemoStoke",
              details: [
                "Navigate to the Figma Sync page in DemoStoke",
                "Paste your access token into the input field",
                "Click 'Connect to Figma' button",
                "System validates token and loads your Figma profile",
                "Connection confirmation displays your Figma handle and team"
              ]
            },
            {
              step: "Load Your Files",
              details: [
                "Click 'Refresh Files' to scan your Figma account",
                "DemoStoke discovers all files across your teams",
                "Files appear with status badges (Not Synced initially)",
                "Select files to sync with your design system"
              ]
            }
          ]
        },
        {
          title: "File Management",
          content: `Once connected, manage your Figma files with these tools:`,
          features: [
            {
              action: "Refresh Files",
              desc: "Scans your Figma account for new files and updates the list",
              icon: "RefreshCw"
            },
            {
              action: "Sync File",
              desc: "Fetches latest components and data from a specific Figma file",
              icon: "Download"
            },
            {
              action: "View in Figma",
              desc: "Opens the Figma file in a new tab for direct editing",
              icon: "ExternalLink"
            },
            {
              action: "Remove File",
              desc: "Removes file from your sync list (doesn't delete from Figma)",
              icon: "Trash"
            }
          ],
          statusBadges: [
            {
              status: "Synced",
              color: "green",
              meaning: "File is up-to-date with latest Figma version"
            },
            {
              status: "Outdated",
              color: "yellow",
              meaning: "Changes detected in Figma, sync recommended"
            },
            {
              status: "Not Synced",
              color: "gray",
              meaning: "File discovered but never synced"
            },
            {
              status: "Error",
              color: "red",
              meaning: "Sync failed, check permissions or connection"
            }
          ]
        },
        {
          title: "Sync Workflow",
          content: `Follow this workflow for effective Figma synchronization:`,
          workflow: [
            {
              phase: "Initial Sync",
              tasks: [
                "Connect your Figma account with an access token",
                "Refresh files to discover all available Figma files",
                "Select important files and click Sync for each",
                "Review component count and metadata after sync",
                "Verify components appear in the Components page"
              ]
            },
            {
              phase: "Regular Maintenance",
              tasks: [
                "Check file status badges for 'Outdated' indicators",
                "Sync files when design changes are made in Figma",
                "Review last sync timestamps to track update frequency",
                "Use Component Mapping tab to maintain component relationships",
                "Refresh files list when new Figma files are created"
              ]
            },
            {
              phase: "Component Mapping",
              tasks: [
                "Navigate to Component Mapping tab",
                "Map Figma components to corresponding code components",
                "Update mappings when component names change",
                "Document mapping decisions for team reference"
              ]
            },
            {
              phase: "Sync Settings",
              tasks: [
                "Configure automatic sync schedules (if available)",
                "Set conflict resolution preferences",
                "Enable sync notifications for team awareness",
                "Review and adjust sync scope as needed"
              ]
            }
          ]
        },
        {
          title: "Best Practices",
          content: `Follow these practices for optimal Figma integration:`,
          practices: [
            {
              category: "Security",
              items: [
                "Keep access tokens private and never share publicly",
                "Rotate tokens periodically for security",
                "Use team-specific tokens when collaborating",
                "Store tokens securely using environment variables"
              ]
            },
            {
              category: "Naming Conventions",
              items: [
                "Use consistent component names between Figma and code",
                "Follow a naming pattern (e.g., ComponentName/Variant)",
                "Document naming conventions in team guidelines",
                "Avoid special characters that might cause parsing issues"
              ]
            },
            {
              category: "Sync Frequency",
              items: [
                "Sync after major design changes or milestones",
                "Perform regular syncs (daily or weekly) for active projects",
                "Coordinate syncs with design team updates",
                "Set up notifications for design handoffs"
              ]
            },
            {
              category: "Conflict Resolution",
              items: [
                "Review sync conflicts before applying changes",
                "Establish clear ownership: design or code as source of truth",
                "Document conflict resolution decisions",
                "Communicate changes with both design and dev teams"
              ]
            }
          ]
        },
        {
          title: "Troubleshooting",
          content: `Common issues and solutions:`,
          issues: [
            {
              problem: "Connection Failed",
              solutions: [
                "Verify access token is valid and copied correctly",
                "Check token hasn't expired (Figma tokens don't expire by default)",
                "Ensure network connection is stable",
                "Try generating a new token if issues persist"
              ]
            },
            {
              problem: "Files Not Loading",
              solutions: [
                "Verify you have access to the team in Figma",
                "Check file permissions (view access required)",
                "Ensure you're on the correct Figma team",
                "Try disconnecting and reconnecting"
              ]
            },
            {
              problem: "Sync Errors",
              solutions: [
                "Verify file hasn't been deleted in Figma",
                "Check you have read permissions on the file",
                "Review file for corrupt components or data",
                "Check browser console for specific error details"
              ]
            },
            {
              problem: "Outdated Status Persists",
              solutions: [
                "Normal when Figma file has been modified",
                "Click Sync to update to latest version",
                "If status doesn't update, try removing and re-adding file",
                "Check last sync timestamp for confirmation"
              ]
            }
          ]
        }
      ]
    }
  ];

  const filteredContent = searchTerm
    ? docContent.filter(section =>
        section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.sections.some(s => 
          s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : docContent;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-display-md font-bold">Documentation</h1>
        <p className="text-body-lg text-muted-foreground mt-2">
          Comprehensive guides and references for the DemoStoke Design System
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
      <div>
        <h2 className="text-heading-md font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {resources.map((resource) => (
            <Card key={resource.title} className="hover:shadow-md transition-all hover:border-primary/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <resource.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-body-lg">{resource.title}</h3>
                    <p className="text-body-sm text-muted-foreground">{resource.description}</p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    {resource.external ? (
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : (
                      <NavLink to={resource.url}>
                        <ChevronRight className="h-4 w-4" />
                      </NavLink>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Documentation Sections */}
      <div className="space-y-4">
        {filteredContent.map((section) => {
          const isOpen = openSections.includes(section.id);
          const SectionIcon = section.icon;
          
          return (
            <Card key={section.id}>
              <Collapsible open={isOpen} onOpenChange={() => toggleSection(section.id)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <SectionIcon className="h-5 w-5 text-primary" />
                        </div>
                        <span>{section.title}</span>
                      </div>
                      <ChevronRight 
                        className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-90' : ''}`} 
                      />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-6 pt-0">
                    {section.sections.map((subsection, idx) => (
                      <div key={idx} className="space-y-3">
                        <h3 className="text-heading-md font-semibold flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          {subsection.title}
                        </h3>
                        
                        <p className="text-body-lg text-foreground/90 leading-relaxed">
                          {subsection.content}
                        </p>

                        {/* Features List */}
                        {subsection.features && (
                          <ul className="space-y-2 ml-7">
                            {subsection.features.map((feature, i) => (
                              <li key={i} className="text-body-lg text-foreground/80 flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                {typeof feature === 'string' ? (
                                  <span>{feature}</span>
                                ) : (
                                  <div>
                                    <strong className="text-foreground">{feature.name}:</strong> {feature.desc}
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Steps List */}
                        {subsection.steps && (
                          <ol className="space-y-2 ml-7 list-decimal">
                            {subsection.steps.map((step, i) => (
                              <li key={i} className="text-body-lg text-foreground/80">
                                {typeof step === 'string' ? (
                                  step
                                ) : (
                                  <div className="space-y-2">
                                    <strong className="text-foreground">{step.step}</strong>
                                    <ul className="space-y-1 ml-4 mt-2">
                                      {step.details.map((detail, j) => (
                                        <li key={j} className="text-body-lg text-foreground/70 flex items-start gap-2">
                                          <span className="text-primary">−</span>
                                          <span>{detail}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </li>
                            ))}
                          </ol>
                        )}

                        {/* Details List */}
                        {subsection.details && (
                          <div className="space-y-3 ml-4">
                            {subsection.details.map((detail, i) => (
                              <div key={i} className="p-3 bg-muted/50 rounded-lg">
                                <strong className="text-foreground font-medium">{detail.label}:</strong>
                                <p className="text-body-lg text-foreground/80 mt-1">{detail.text}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Categories */}
                        {subsection.categories && (
                          <div className="space-y-3 ml-4">
                            {subsection.categories.map((category, i) => (
                              <div key={i} className="space-y-2">
                                <h4 className="font-semibold text-foreground">{category.name}</h4>
                                <ul className="space-y-1 ml-4">
                                  {category.items?.map((item, j) => (
                                    <li key={j} className="text-body-lg text-foreground/70 flex items-start gap-2">
                                      <Code className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                      <span className="font-mono text-sm">{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Examples */}
                        {subsection.examples && (
                          <div className="space-y-3 ml-4">
                            {subsection.examples.map((example, i) => (
                              <div key={i} className="space-y-2">
                                <h4 className="font-semibold text-foreground">{example.method}</h4>
                                <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                                  <code className="text-sm text-foreground/90 font-mono">
                                    {example.code}
                                  </code>
                                </pre>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Tips */}
                        {subsection.tips && (
                          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-2">
                            <h4 className="font-semibold text-primary flex items-center gap-2">
                              <Sparkles className="h-4 w-4" />
                              Pro Tips
                            </h4>
                            <ul className="space-y-1 ml-6">
                              {subsection.tips.map((tip, i) => (
                                <li key={i} className="text-body-lg text-foreground/80 flex items-start gap-2">
                                  <span className="text-primary">•</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Formats */}
                        {subsection.formats && (
                          <div className="space-y-3 ml-4">
                            {subsection.formats.map((format, i) => (
                              <div key={i} className="p-4 border border-border rounded-lg space-y-2">
                                <h4 className="font-semibold text-foreground">{format.name}</h4>
                                <p className="text-body-lg text-foreground/70">{format.desc}</p>
                                {format.use && (
                                  <p className="text-body-sm text-muted-foreground italic">
                                    <strong>Best for:</strong> {format.use}
                                  </p>
                                )}
                                {format.features && (
                                  <ul className="space-y-1 mt-2">
                                    {format.features.map((feature, j) => (
                                      <li key={j} className="text-body-sm text-foreground/70 flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                        <span>{feature}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Process/Workflow */}
                        {subsection.process && (
                          <div className="p-4 bg-muted/30 rounded-lg">
                            <ol className="space-y-2 list-decimal ml-4">
                              {subsection.process.map((step, i) => (
                                <li key={i} className="text-body-lg text-foreground/80">{step}</li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {subsection.workflow && (
                          <div className="space-y-4 ml-4">
                            {subsection.workflow.map((phase, i) => (
                              <div key={i} className="space-y-2">
                                <h4 className="font-semibold text-foreground flex items-center gap-2">
                                  <Badge variant="outline">{phase.phase}</Badge>
                                </h4>
                                <ul className="space-y-1 ml-4">
                                  {phase.tasks.map((task, j) => (
                                    <li key={j} className="text-body-lg text-foreground/70 flex items-start gap-2">
                                      <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                      <span>{task}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Benefits */}
                        {subsection.benefits && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-4">
                            {subsection.benefits.map((benefit, i) => (
                              <div key={i} className="p-3 bg-primary/5 rounded-lg flex items-start gap-2">
                                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                <span className="text-body-lg text-foreground/80">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Practices */}
                        {subsection.practices && (
                          <div className="space-y-4 ml-4">
                            {subsection.practices.map((practice, i) => (
                              <div key={i} className="space-y-2">
                                <h4 className="font-semibold text-foreground">{practice.category}</h4>
                                <ul className="space-y-1 ml-4">
                                  {practice.items.map((item, j) => (
                                    <li key={j} className="text-body-lg text-foreground/70 flex items-start gap-2">
                                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Issues/Troubleshooting */}
                        {subsection.issues && (
                          <div className="space-y-4 ml-4">
                            {subsection.issues.map((issue, i) => (
                              <div key={i} className="p-4 border-l-4 border-destructive bg-destructive/5 rounded">
                                <h4 className="font-semibold text-destructive mb-2">{issue.problem}</h4>
                                <ul className="space-y-1 ml-4">
                                  {issue.solutions.map((solution, j) => (
                                    <li key={j} className="text-body-lg text-foreground/70 flex items-start gap-2">
                                      <span className="text-primary">✓</span>
                                      <span>{solution}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Status Badges Info */}
                        {subsection.statusBadges && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-4">
                            {subsection.statusBadges.map((badge, i) => (
                              <div key={i} className="p-3 border border-border rounded-lg">
                                <Badge 
                                  variant={
                                    badge.color === 'green' ? 'default' : 
                                    badge.color === 'yellow' ? 'secondary' : 
                                    badge.color === 'red' ? 'destructive' : 
                                    'outline'
                                  }
                                  className="mb-2"
                                >
                                  {badge.status}
                                </Badge>
                                <p className="text-body-sm text-foreground/70">{badge.meaning}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {idx < section.sections.length - 1 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>

      {filteredContent.length === 0 && searchTerm && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No documentation found matching your search.</p>
          <Button variant="link" onClick={() => setSearchTerm("")}>
            Clear search
          </Button>
        </Card>
      )}
    </div>
  );
}
