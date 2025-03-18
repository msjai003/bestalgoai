
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { Loader } from 'lucide-react';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user, isLoading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading, checkAdminStatus } = useAdmin();
  const location = useLocation();
  const isLoading = authLoading || adminLoading;

  useEffect(() => {
    if (user && !adminLoading) {
      checkAdminStatus();
    }
  }, [user, adminLoading, checkAdminStatus]);

  // While still checking authentication or admin status, show loading
  if (isLoading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-[#FF00D4] mx-auto mb-4" />
          <p className="text-white">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If authenticated but not admin, redirect to dashboard
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and admin, render the protected content
  return <>{children}</>;
};

export default AdminProtectedRoute;
