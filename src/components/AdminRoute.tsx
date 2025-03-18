
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { Loader } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAdmin, isLoading } = useAdmin();
  const location = useLocation();

  // While still checking admin status, show loading
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

  // If not an admin, redirect to dashboard
  if (!isAdmin) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  // If admin, render the protected content
  return <>{children}</>;
};

export default AdminRoute;
