
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { Loader } from 'lucide-react';

interface AdminLinkProps {
  to: string;
  children: React.ReactNode;
}

const AdminLink: React.FC<AdminLinkProps> = ({ to, children }) => {
  const { isAdmin, isLoading } = useAdmin();
  
  // If still loading admin status, show loading indicator
  if (isLoading) {
    return (
      <div className="flex items-center px-4 py-2 text-sm text-gray-400">
        <Loader className="h-4 w-4 animate-spin mr-2" />
        <span>Checking...</span>
      </div>
    );
  }
  
  // If user is not an admin, don't show the link
  if (!isAdmin) {
    return null;
  }
  
  // Show the link for admin users
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? "flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800/60 rounded-md"
          : "flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/40 rounded-md"
      }
    >
      {children}
    </NavLink>
  );
};

// Add the AdminMobileLink component for mobile view
export const AdminMobileLink: React.FC = () => {
  const { isAdmin, isLoading } = useAdmin();
  
  if (isLoading) {
    return (
      <div className="flex items-center py-2 text-sm text-gray-400">
        <Loader className="h-4 w-4 animate-spin mr-2" />
        <span>Checking admin access...</span>
      </div>
    );
  }
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <NavLink
      to="/admin"
      className={({ isActive }) =>
        isActive
          ? "text-white bg-gray-800/60 block py-2 px-4 rounded-md font-medium"
          : "text-gray-300 hover:text-white hover:bg-gray-800/40 block py-2 px-4 rounded-md"
      }
    >
      Admin Dashboard
    </NavLink>
  );
};

export default AdminLink;
