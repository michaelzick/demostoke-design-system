import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Components from "./pages/Components";
import NewComponent from "./pages/NewComponent";
import Tokens from "./pages/Tokens";
import Documentation from "./pages/Documentation";
import Import from "./pages/Import";
import Export from "./pages/Export";
import Figma from "./pages/Figma";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/components" element={<Components />} />
            <Route path="/new-component" element={<NewComponent />} />
            <Route path="/ai-generate" element={<NewComponent />} />
            <Route path="/tokens" element={<Tokens />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="/import" element={<Import />} />
            <Route path="/export" element={<Export />} />
            <Route path="/figma" element={<Figma />} />
            <Route path="/settings" element={<Settings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
