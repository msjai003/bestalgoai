import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Education from '@/pages/Education';
import { AuthProvider } from '@/contexts/AuthContext';
import Auth from '@/pages/Auth';
import Trading from '@/pages/Trading';
import Settings from '@/pages/Settings';
import Profile from '@/pages/Profile';
import Brokerage from '@/pages/Brokerage';
import DatabaseStatus from '@/components/DatabaseStatus';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/education" element={<Education />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/trading" element={<Trading />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/brokerage" element={<Brokerage />} />
        <Route path="/dbstatus" element={<DatabaseStatus />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
