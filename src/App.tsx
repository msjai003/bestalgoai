
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
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

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

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
      
      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/strategy-builder" element={<ProtectedRoute><StrategyBuilder /></ProtectedRoute>} />
      <Route path="/strategy-selection" element={<ProtectedRoute><StrategySelection /></ProtectedRoute>} />
      <Route path="/strategy-details/:id" element={<ProtectedRoute><StrategyDetails /></ProtectedRoute>} />
      <Route path="/strategy-management" element={<ProtectedRoute><StrategyManagement /></ProtectedRoute>} />
      <Route path="/backtest" element={<ProtectedRoute><BacktestReport /></ProtectedRoute>} />
      <Route path="/live-trading" element={<ProtectedRoute><LiveTrading /></ProtectedRoute>} />
      <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
      <Route path="/community" element={<ProtectedRoute><CommunityLearning /></ProtectedRoute>} />
      <Route path="/logout" element={<ProtectedRoute><Logout /></ProtectedRoute>} />
      <Route path="/risk-management" element={<ProtectedRoute><RiskManagement /></ProtectedRoute>} />
      <Route path="/broker-integration" element={<ProtectedRoute><BrokerIntegration /></ProtectedRoute>} />
      <Route path="/broker-credentials" element={<ProtectedRoute><BrokerCredentials /></ProtectedRoute>} />
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
