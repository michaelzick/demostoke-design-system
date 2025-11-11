import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { ThemeToggle } from "../theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dsLogo from "@/assets/images/ds-mosaic-logo-cropped.webp";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, signOut, isAuthenticated } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-md">
            <div className="flex items-center gap-md min-w-0">
              <SidebarTrigger />
              <div className="hidden sm:block text-heading-md truncate">DemoStoke Design System</div>
              <Link to="/" className="sm:hidden inline-flex items-center" aria-label="Go to dashboard">
                <img
                  src={dsLogo}
                  alt="DemoStoke Logo"
                  width={32}
                  height={32}
                  style={{ width: "32px", height: "32px", minWidth: "32px", minHeight: "32px" }}
                  className="w-8 h-8 object-contain"
                />
              </Link>
            </div>

            <div className="flex items-center gap-sm">
              <ThemeToggle />

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${user?.id}`} />
                        <AvatarFallback>
                          {user?.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-sm p-sm">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user?.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild variant="outline" size="sm">
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
