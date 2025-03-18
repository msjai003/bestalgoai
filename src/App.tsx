import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { AdminProvider } from '@/contexts/AdminContext';
import { StrategyProvider } from '@/contexts/StrategyContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { BrokerProvider } from '@/contexts/BrokerContext';
import { PortfolioProvider } from '@/contexts/PortfolioContext';
import { NotificationsProvider } from '@/contexts/NotificationsContext';

import LandingPage from '@/pages/LandingPage';
import Dashboard from '@/pages/Dashboard';
import AuthPage from '@/pages/AuthPage';
import StrategyDetails from '@/pages/StrategyDetails';
import StrategyWizard from '@/pages/StrategyWizard';
import PortfolioPage from '@/pages/PortfolioPage';
import SettingsPage from '@/pages/SettingsPage';
import BrokerConnectPage from '@/pages/BrokerConnectPage';
import NotFoundPage from '@/pages/NotFoundPage';
import SubscriptionPage from '@/pages/SubscriptionPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UsersManagement from '@/pages/admin/UsersManagement';
import StrategiesManagement from '@/pages/admin/StrategiesManagement';
import StrategiesEditor from './pages/admin/StrategiesEditor';

import ProtectedRoute from '@/components/ProtectedRoute';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <AdminProvider>
            <StrategyProvider>
              <SubscriptionProvider>
                <BrokerProvider>
                  <PortfolioProvider>
                    <NotificationsProvider>
                      <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/auth" element={<AuthPage />} />

                        {/* Protected routes */}
                        <Route
                          path="/dashboard"
                          element={
                            <ProtectedRoute>
                              <Dashboard />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/strategy-details/:id"
                          element={
                            <ProtectedRoute>
                              <StrategyDetails />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/strategy-wizard"
                          element={
                            <ProtectedRoute>
                              <StrategyWizard />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/portfolio"
                          element={
                            <ProtectedRoute>
                              <PortfolioPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/settings"
                          element={
                            <ProtectedRoute>
                              <SettingsPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/connect-broker"
                          element={
                            <ProtectedRoute>
                              <BrokerConnectPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/subscription"
                          element={
                            <ProtectedRoute>
                              <SubscriptionPage />
                            </ProtectedRoute>
                          }
                        />

                        {/* Admin routes */}
                        <Route
                          path="/admin"
                          element={
                            <AdminProtectedRoute>
                              <AdminDashboard />
                            </AdminProtectedRoute>
                          }
                        />
                        <Route
                          path="/admin/users"
                          element={
                            <AdminProtectedRoute>
                              <UsersManagement />
                            </AdminProtectedRoute>
                          }
                        />
                        <Route
                          path="/admin/strategies"
                          element={
                            <AdminProtectedRoute>
                              <StrategiesManagement />
                            </AdminProtectedRoute>
                          }
                        />
                        <Route
                          path="/admin/strategies-editor"
                          element={
                            <AdminProtectedRoute>
                              <StrategiesEditor />
                            </AdminProtectedRoute>
                          }
                        />

                        {/* 404 route */}
                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                      <Toaster position="top-right" richColors />
                    </NotificationsProvider>
                  </PortfolioProvider>
                </BrokerProvider>
              </SubscriptionProvider>
            </StrategyProvider>
          </AdminProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
