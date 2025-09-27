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
import { NewComponentButton } from "@/components/common/NewComponentButton";

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

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-primary/10 text-primary font-medium"
      : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground";

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarHeader className="p-md">
        <NavLink to="/" className={`flex items-center gap-sm ${collapsed ? 'justify-center' : ''} hover:opacity-80 transition-opacity`}>
          <img
            src="/src/assets/images/demostoke-logo-ds-transparent-cropped.webp"
            alt="DemoStoke Logo"
            width={32}
            height={32}
            // Inline style reserves the correct size before Tailwind loads (w-8 == 2rem == 32px)
            style={{ width: '32px', height: '32px', minWidth: '32px', minHeight: '32px' }}
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
          <NewComponentButton className={`w-full ${collapsed ? 'px-2' : ''}`}>
            {!collapsed && "New Component"}
          </NewComponentButton>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === "/"} className={({ isActive }) => getNavCls({ isActive })}>
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
                    <NavLink to={item.url} className={({ isActive }) => getNavCls({ isActive })}>
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
