import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth/AuthContext";
import { useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { initializeCapacitor } from "@/services/capacitorService";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Index from "@/pages/Index";
import Pricing from "@/pages/Pricing";
import About from "@/pages/About";
import Blog from "@/pages/Blog";
import Support from "@/pages/Support";
import Auth from "@/pages/Auth";
import AuthCallback from "@/pages/AuthCallback";
import Registration from "@/pages/Registration";
import Signup from "@/pages/Signup";
import Terms from "@/pages/Terms";
import Logout from "@/pages/Logout";
import ColorTest from "@/pages/ColorTest";
import Education from "@/pages/Education";
import Classes from "@/pages/Classes";
import SmartLearn from "@/pages/SmartLearn";
import Dashboard from "@/pages/Dashboard";
import Onboarding from "@/pages/Onboarding";
import StrategyBuilder from "@/pages/StrategyBuilder";
import StrategySelection from "@/pages/StrategySelection";
import StrategyDetails from "@/pages/StrategyDetails";
import StrategyManagement from "@/pages/StrategyManagement";
import BacktestReport from "@/pages/BacktestReport";
import ZenflowBacktest from "@/pages/ZenflowBacktest";
import ZenflowBacktestReport from "@/pages/ZenflowBacktestReport";
import LiveTrading from "@/pages/LiveTrading";
import Alerts from "@/pages/Alerts";
import Settings from "@/pages/Settings";
import Notifications from "@/pages/Notifications";
import Subscription from "@/pages/Subscription";
import CommunityLearning from "@/pages/CommunityLearning";
import RiskManagement from "@/pages/RiskManagement";
import BrokerIntegration from "@/pages/BrokerIntegration";
import BrokerCredentials from "@/pages/BrokerCredentials";
import CustomStrategyAdmin from "@/pages/CustomStrategyAdmin";
import StrategyConfigAdmin from "@/pages/StrategyConfigAdmin";
import PriceAdminPage from "@/pages/PriceAdminPage";
import ApiKeys from "@/pages/ApiKeys";
import NotFound from "@/pages/NotFound";
import BrokerManagement from "@/pages/BrokerManagement";
import ResetPassword from '@/pages/ResetPassword';
import AuthVerifyHandler from "@/components/auth/AuthVerifyHandler";

const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/colortest" element={<ColorTest />} />
      <Route path="/education" element={<Education />} />
      <Route path="/classes" element={<Classes />} />
      <Route path="/smart-learn" element={<SmartLearn />} />
      
      {/* Special routes for Supabase auth verification - handle ALL auth verification paths */}
      <Route path="/auth/v1/verify" element={<AuthVerifyHandler />} />
      <Route path="/auth/v1/callback" element={<AuthVerifyHandler />} />
      <Route path="/auth/v1/*" element={<AuthVerifyHandler />} />
      <Route path="/verify" element={<AuthVerifyHandler />} />
      
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
      <Route path="/backtest-report" element={
        <ProtectedRoute>
          <BacktestReport />
        </ProtectedRoute>
      } />
      <Route path="/zenflow-backtest" element={
        <ProtectedRoute>
          <ZenflowBacktest />
        </ProtectedRoute>
      } />
      <Route path="/zenflow-backtest-report" element={
        <ProtectedRoute>
          <ZenflowBacktestReport />
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
      <Route path="/price-admin" element={<PriceAdminPage />} />
      <Route path="/api-keys" element={<ApiKeys />} />
      <Route path="/broker-management" element={<BrokerManagement />} />
      
      {/* Make sure all unmatched routes redirect to auth */}
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}

function App() {
  useEffect(() => {
    import('./utils/ensureBrokerImages').then(({ ensureAllBrokerImagesInDatabase }) => {
      ensureAllBrokerImagesInDatabase().catch(console.error);
    });

    const platform = window.navigator.userAgent;
    const isNative = platform.includes('android') || platform.includes('ios');
    
    if (isNative) {
      initializeCapacitor()
        .catch(err => console.error('Failed to initialize capacitor:', err));
    }
  }, []);

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
