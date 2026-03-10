import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import JudgePortal from "./pages/JudgePortal";
import JudgeDashboard from "./pages/JudgeDashboard";
import LabView from "./pages/LabView";
import EvaluateView from "./pages/EvaluateView";
import Leaderboard from "./pages/Leaderboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/judge-portal" component={JudgePortal} />
      <Route path="/judge/dashboard" component={JudgeDashboard} />
      <Route path="/judge/lab/:labId" component={LabView} />
      <Route path="/judge/evaluate/:teamId" component={EvaluateView} />
      <Route path="/judge/leaderboard" component={Leaderboard} />
      <Route component={NotFound} />
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
