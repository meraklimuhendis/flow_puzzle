import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import FlowPuzzle from "@/components/game/FlowPuzzle";
import MaintenancePage from "@/pages/maintenance";

// ===========================================
// BAKIM MODU AYARI
// ===========================================
// Bakım modunu AÇMAK için: true
// Bakım modunu KAPATMAK için: false
const MAINTENANCE_MODE = true;
// ===========================================

function Router() {
  // Bakım modu aktifse sadece bakım sayfasını göster
  if (MAINTENANCE_MODE) {
    return <MaintenancePage />;
  }

  return (
    <Switch>
      <Route path="/" component={FlowPuzzle} />
      <Route component={FlowPuzzle} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
