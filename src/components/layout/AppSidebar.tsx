import { useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import {
  Palette,
  Plus,
  FileText,
  Download,
  Upload,
  Layers,
  Settings,
  Home,
  Package,
  Sparkles
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Components", url: "/components", icon: Package },
  { title: "Tokens", url: "/tokens", icon: Palette },
  { title: "Documentation", url: "/docs", icon: FileText },
];

const toolsItems = [
  { title: "Import Spec", url: "/import", icon: Upload },
  { title: "Export Library", url: "/export", icon: Download },
  { title: "Figma Sync", url: "/figma", icon: Layers },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
      : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground";

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarHeader className="p-md">
        <NavLink to="/" className={`flex items-center gap-sm ${collapsed ? 'justify-center' : ''} hover:opacity-80 transition-opacity`}>
          <img
            src="/src/assets/images/demostoke-logo-ds-transparent-cropped.webp"
            alt="DemoStoke Logo"
            className="w-8 h-8 object-contain"
          />
          {!collapsed && (
            <div>
              <h2 className="text-heading-sm text-sidebar-foreground">DemoStoke</h2>
              <p className="text-xs text-sidebar-foreground/70">Design System</p>
            </div>
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        {/* New Component Button */}
          <div className="px-md pb-md">
          <Button
            asChild
            variant="on-surface"
            className={`text-[color:hsl(var(--hero-button-foreground))] w-full ${collapsed ? 'px-2' : ''}`}
          >
            <NavLink to="/new-component">
              <Plus className="h-4 w-4" />
              {!collapsed && <span className="ml-2">New Component</span>}
            </NavLink>
          </Button>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
    </Sidebar>
  );
}
