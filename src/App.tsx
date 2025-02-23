
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import BacktestReport from "./pages/BacktestReport";
import LiveTrading from "./pages/LiveTrading";
import Alerts from "./pages/Alerts";
import Subscription from "./pages/Subscription";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/support" element={<Support />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/strategy-builder" element={<StrategyBuilder />} />
          <Route path="/backtest" element={<BacktestReport />} />
          <Route path="/live-trading" element={<LiveTrading />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
