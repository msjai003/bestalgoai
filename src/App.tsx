
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Support from "./pages/Support";
import Auth from "./pages/Auth";
import Registration from "./pages/Registration";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import StrategyBuilder from "./pages/StrategyBuilder";
import StrategySelection from "./pages/StrategySelection";
import StrategyDetails from "./pages/StrategyDetails";
import StrategyManagement from "./pages/StrategyManagement";
import BacktestReport from "./pages/BacktestReport";
import LiveTrading from "./pages/LiveTrading";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import Subscription from "./pages/Subscription";
import CommunityLearning from "./pages/CommunityLearning";
import Logout from "./pages/Logout";
import RiskManagement from "./pages/RiskManagement";
import BrokerIntegration from "./pages/BrokerIntegration";
import BrokerCredentials from "./pages/BrokerCredentials";
import Terms from "./pages/Terms";

const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/about" element={<About />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/support" element={<Support />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/onboarding" element={<Onboarding />} />
      
      {/* All routes are public */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/strategy-builder" element={<StrategyBuilder />} />
      <Route path="/strategy-selection" element={<StrategySelection />} />
      <Route path="/strategy-details/:id" element={<StrategyDetails />} />
      <Route path="/strategy-management" element={<StrategyManagement />} />
      <Route path="/backtest" element={<BacktestReport />} />
      <Route path="/live-trading" element={<LiveTrading />} />
      <Route path="/alerts" element={<Alerts />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/subscription" element={<Subscription />} />
      <Route path="/community" element={<CommunityLearning />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/risk-management" element={<RiskManagement />} />
      <Route path="/broker-integration" element={<BrokerIntegration />} />
      <Route path="/broker-credentials" element={<BrokerCredentials />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
