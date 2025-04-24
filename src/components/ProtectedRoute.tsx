
import React, { ReactNode, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ['user']
}) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user becomes null after being authenticated, redirect to auth
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  // If authentication is still loading, show nothing or a loader
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen bg-charcoalPrimary">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan"></div>
    </div>;
  }

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If roles are specified, check if user has the required role
  // This is a simplified implementation since we don't have a proper role system yet
  if (allowedRoles.includes('admin')) {
    // For now, we'll just check by user email to determine admin status
    // In a real application, you'd check against a roles table or similar
    const isAdmin = user.email === 'admin@example.com'; // Replace with your admin check logic
    if (!isAdmin) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If all checks pass, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
