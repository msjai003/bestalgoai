
import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Education from './pages/Education';
import StrategyManagement from './pages/StrategyManagement';
import Settings from './pages/Settings';
import Auth from './pages/Auth';
import InstallPrompt from './components/InstallPrompt';
import { Toaster } from '@/components/ui/toaster';
import AdminEducation from './pages/AdminEducation';
import { useAuth } from './contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Add the new AITrading component import
import AITrading from './pages/AITrading';

function App() {
  const { user, isLoading } = useAuth(); // Changed from loading to isLoading
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!user && !isLoading && location.pathname !== '/auth') {
      // Redirect to /auth only if not already there and not loading
      // toast({
      //   title: "Please Sign In",
      //   description: "You need to sign in to access this page.",
      // })
      // history.push('/auth'); // Use history.push to navigate
    }
  }, [user, isLoading, location, toast]); // Updated to isLoading
  
  return (
    <div className="App min-h-screen bg-charcoalPrimary">
      <InstallPrompt />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/education" element={<Education />} />
          <Route path="/strategy-management" element={<StrategyManagement />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin/education" element={<AdminEducation />} />
          
          {/* Add the new AI Trading route */}
          <Route path="/ai-trading" element={<AITrading />} />
          
          {/* Add other existing routes here if any */}
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
