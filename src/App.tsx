import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from 'react-query';

import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import About from '@/pages/About';
import Terms from '@/pages/Terms';
import Blog from '@/pages/Blog';
import Contact from '@/pages/Contact';
import Signup from '@/pages/Signup';
import Login from '@/pages/Login';
import AuthCallback from '@/pages/AuthCallback';
import ForgotPassword from '@/pages/ForgotPassword';
import Pricing from '@/pages/Pricing';
import Settings from '@/pages/Settings';
import StrategySelection from '@/pages/StrategySelection';
import StrategyDetails from '@/pages/StrategyDetails';
import StrategyBuilder from '@/pages/StrategyBuilder';
import StrategyManagement from '@/pages/StrategyManagement';
import Subscription from '@/pages/Subscription';
import RiskManagement from '@/pages/RiskManagement';
import BacktestReport from '@/pages/BacktestReport';
import LiveTrading from '@/pages/LiveTrading';
import Support from '@/pages/Support';
import CommunityLearning from '@/pages/CommunityLearning';
import Education from '@/pages/Education';
import BrokerIntegration from '@/pages/BrokerIntegration';
import BrokerCredentials from '@/pages/BrokerCredentials';
import AdminPanel from '@/pages/AdminPanel';
import ColorTest from '@/pages/ColorTest';
import Notifications from '@/pages/Notifications';
import Alerts from '@/pages/Alerts';
import PriceAdminPage from '@/pages/PriceAdminPage';
import StrategyConfigAdmin from '@/pages/StrategyConfigAdmin';
import CustomStrategyAdmin from '@/pages/CustomStrategyAdmin';
import BrokerFunctionsAdmin from '@/pages/BrokerFunctionsAdmin';
import DatabaseInfo from '@/pages/DatabaseInfo';
import GoogleRegistration from '@/pages/GoogleRegistration';
import Onboarding from '@/pages/Onboarding';
import Logout from '@/pages/Logout';
import NotFound from '@/pages/NotFound';
import BacktestImport from '@/pages/BacktestImport';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth-callback" element={<AuthCallback />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/strategy-selection" element={<StrategySelection />} />
          <Route path="/strategy-details/:id" element={<StrategyDetails />} />
          <Route path="/strategy-builder" element={<StrategyBuilder />} />
          <Route path="/strategy-management" element={<StrategyManagement />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/risk-management" element={<RiskManagement />} />
          <Route path="/backtest-report" element={<BacktestReport />} />
          <Route path="/backtest-import" element={<BacktestImport />} />
          <Route path="/live-trading" element={<LiveTrading />} />
          <Route path="/support" element={<Support />} />
          <Route path="/community-learning" element={<CommunityLearning />} />
          <Route path="/education" element={<Education />} />
          <Route path="/broker-integration" element={<BrokerIntegration />} />
          <Route path="/broker-credentials" element={<BrokerCredentials />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/color-test" element={<ColorTest />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/price-admin" element={<PriceAdminPage />} />
          <Route path="/strategy-config-admin" element={<StrategyConfigAdmin />} />
          <Route path="/custom-strategy-admin" element={<CustomStrategyAdmin />} />
          <Route path="/broker-functions-admin" element={<BrokerFunctionsAdmin />} />
          <Route path="/database-info" element={<DatabaseInfo />} />
          <Route path="/google-registration" element={<GoogleRegistration />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
