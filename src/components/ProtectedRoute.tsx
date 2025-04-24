
import React, { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ['user']
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Add extensive logging to debug authentication issues
  useEffect(() => {
    console.log('ProtectedRoute - User state:', !!user);
    console.log('ProtectedRoute - isLoading:', isLoading);
    console.log('ProtectedRoute - Current location:', location.pathname);
  }, [user, isLoading, location]);

  // If authentication is still loading, show a loader
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-charcoalPrimary text-white">
        <Loader2 className="h-10 w-10 animate-spin text-cyan mb-4" />
        <p className="text-gray-300">Verifying authentication...</p>
      </div>
    );
  }

  // If no user is logged in, redirect to login
  if (!user) {
    console.log('ProtectedRoute - No user detected, redirecting to auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  console.log('ProtectedRoute - Authentication confirmed, rendering protected content');
  
  // If all checks pass, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
