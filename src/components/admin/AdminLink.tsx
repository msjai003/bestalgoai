
import React from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminLink: React.FC = () => {
  const { isAdmin, isLoading } = useAdmin();

  if (isLoading || !isAdmin) {
    return null;
  }

  return (
    <Link
      to="/admin"
      className="flex items-center space-x-1 text-[#FF00D4] hover:text-purple-400 transition-colors"
    >
      <ShieldAlert className="h-4 w-4" />
      <span>Admin</span>
    </Link>
  );
};

export const AdminMobileLink: React.FC = () => {
  const { isAdmin, isLoading } = useAdmin();

  if (isLoading || !isAdmin) {
    return null;
  }

  return (
    <Link
      to="/admin"
      className="text-[#FF00D4] hover:text-purple-400 transition-colors flex items-center gap-2 py-2"
    >
      <ShieldAlert className="h-4 w-4" />
      <span>Admin Panel</span>
    </Link>
  );
};

export const AdminButton: React.FC = () => {
  const { isAdmin, isLoading } = useAdmin();

  if (isLoading || !isAdmin) {
    return null;
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="bg-[#FF00D4]/10 border-[#FF00D4]/30 text-[#FF00D4] hover:bg-[#FF00D4]/20"
      asChild
    >
      <Link to="/admin">
        <ShieldAlert className="h-4 w-4 mr-2" />
        Admin Panel
      </Link>
    </Button>
  );
};

export default AdminLink;
