
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Support from "./pages/Support";
import Auth from "./pages/Auth";
import Registration from "./pages/Registration";
import Signup from "./pages/Signup";
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
import ForgotPassword from "./pages/ForgotPassword";
import AuthCallback from "./pages/AuthCallback";
import CustomStrategyAdmin from "./pages/CustomStrategyAdmin";
import StrategyConfigAdmin from "./pages/StrategyConfigAdmin";

const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/about" element={<About />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/support" element={<Support />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/logout" element={<Logout />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/onboarding" element={
        <ProtectedRoute>
          <Onboarding />
        </ProtectedRoute>
      } />
      <Route path="/strategy-builder" element={
        <ProtectedRoute>
          <StrategyBuilder />
        </ProtectedRoute>
      } />
      <Route path="/strategy-selection" element={
        <ProtectedRoute>
          <StrategySelection />
        </ProtectedRoute>
      } />
      <Route path="/strategy-details/:id" element={
        <ProtectedRoute>
          <StrategyDetails />
        </ProtectedRoute>
      } />
      <Route path="/strategy-management" element={
        <ProtectedRoute>
          <StrategyManagement />
        </ProtectedRoute>
      } />
      <Route path="/backtest" element={
        <ProtectedRoute>
          <BacktestReport />
        </ProtectedRoute>
      } />
      <Route path="/live-trading" element={
        <ProtectedRoute>
          <LiveTrading />
        </ProtectedRoute>
      } />
      <Route path="/alerts" element={
        <ProtectedRoute>
          <Alerts />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/notifications" element={
        <ProtectedRoute>
          <Notifications />
        </ProtectedRoute>
      } />
      <Route path="/subscription" element={
        <ProtectedRoute>
          <Subscription />
        </ProtectedRoute>
      } />
      <Route path="/community" element={
        <ProtectedRoute>
          <CommunityLearning />
        </ProtectedRoute>
      } />
      <Route path="/risk-management" element={
        <ProtectedRoute>
          <RiskManagement />
        </ProtectedRoute>
      } />
      <Route path="/broker-integration" element={
        <ProtectedRoute>
          <BrokerIntegration />
        </ProtectedRoute>
      } />
      <Route path="/broker-credentials" element={
        <ProtectedRoute>
          <BrokerCredentials />
        </ProtectedRoute>
      } />
      <Route path="/strategy-admin" element={<CustomStrategyAdmin />} />
      <Route path="/config-admin" element={<StrategyConfigAdmin />} />
      
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
