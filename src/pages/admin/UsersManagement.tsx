
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  RefreshCw, 
  AlertTriangle,
  ShieldCheck, 
  Shield, 
  Trash2, 
  Ban
} from 'lucide-react';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  mobile_number: string;
  trading_experience: string | null;
  created_at: string | null;
  is_admin?: boolean;
}

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [dialogAction, setDialogAction] = useState<'delete' | 'makeAdmin' | 'removeAdmin' | null>(null);
  const [adminUsers, setAdminUsers] = useState<string[]>([]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Fetch user profiles
      const { data: profiles, error } = await supabase
        .from('user_profiles')
        .select('*');

      if (error) {
        throw error;
      }

      // Fetch admin users
      const { data: admins, error: adminError } = await supabase
        .from('admin_users')
        .select('user_id');

      if (adminError) {
        throw adminError;
      }

      const adminUserIds = admins?.map(admin => admin.user_id) || [];
      setAdminUsers(adminUserIds);

      // Add admin status to user profiles
      const usersWithAdminStatus = profiles?.map(user => ({
        ...user,
        is_admin: adminUserIds.includes(user.id)
      })) || [];

      setUsers(usersWithAdminStatus);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error(`Error loading users: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMakeAdmin = async () => {
    if (!selectedUser) return;
    
    try {
      const { error } = await supabase
        .from('admin_users')
        .insert({ user_id: selectedUser.id });

      if (error) throw error;

      toast.success(`${selectedUser.full_name} is now an admin`);
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === selectedUser.id ? { ...user, is_admin: true } : user
        )
      );
      setAdminUsers(prev => [...prev, selectedUser.id]);
    } catch (error: any) {
      console.error('Error making user admin:', error);
      toast.error(`Failed to make user admin: ${error.message}`);
    }
  };

  const handleRemoveAdmin = async () => {
    if (!selectedUser) return;
    
    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('user_id', selectedUser.id);

      if (error) throw error;

      toast.success(`Admin privileges removed from ${selectedUser.full_name}`);
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === selectedUser.id ? { ...user, is_admin: false } : user
        )
      );
      setAdminUsers(prev => prev.filter(id => id !== selectedUser.id));
    } catch (error: any) {
      console.error('Error removing admin:', error);
      toast.error(`Failed to remove admin privileges: ${error.message}`);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      // Note: This won't actually delete the auth user, just the profile
      // For full deletion, an edge function with admin privileges would be needed
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', selectedUser.id);

      if (error) throw error;

      toast.success(`User profile deleted for ${selectedUser.full_name}`);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== selectedUser.id));
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(`Failed to delete user: ${error.message}`);
    }
  };

  const handleActionConfirm = () => {
    switch (dialogAction) {
      case 'delete':
        handleDeleteUser();
        break;
      case 'makeAdmin':
        handleMakeAdmin();
        break;
      case 'removeAdmin':
        handleRemoveAdmin();
        break;
    }
    setDialogAction(null);
    setSelectedUser(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">User Management</h1>
          <div className="flex w-full sm:w-auto items-center gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search users..."
                className="pl-9 bg-gray-800 border-gray-700 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="icon"
              className="border-gray-700"
              onClick={fetchUsers}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        <div className="rounded-md border border-gray-700 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-800">
              <TableRow className="border-gray-700 hover:bg-gray-800">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Trading Exp.</TableHead>
                <TableHead className="hidden md:table-cell">Joined</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-gray-900">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#FF00D4]" />
                    <span className="mt-2 block text-gray-400">Loading users...</span>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <AlertTriangle className="w-6 h-6 mx-auto text-yellow-500 mb-2" />
                    <span className="block text-gray-400">
                      {searchTerm ? "No users match your search" : "No users found"}
                    </span>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-gray-800">
                    <TableCell className="font-medium">
                      {user.full_name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="capitalize">
                        {user.trading_experience || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {user.is_admin ? (
                        <Badge 
                          className="bg-blue-900/30 text-blue-300 border-blue-800 flex items-center gap-1 w-fit"
                        >
                          <ShieldCheck className="w-3 h-3" />
                          Admin
                        </Badge>
                      ) : (
                        <Badge 
                          variant="outline" 
                          className="text-gray-400 border-gray-700 flex items-center gap-1 w-fit"
                        >
                          User
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {user.is_admin ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-blue-800 text-blue-300 hover:bg-blue-900/30"
                            onClick={() => {
                              setSelectedUser(user);
                              setDialogAction('removeAdmin');
                            }}
                          >
                            <Shield className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Remove Admin</span>
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 bg-gray-800 border-gray-700 hover:bg-gray-700"
                            onClick={() => {
                              setSelectedUser(user);
                              setDialogAction('makeAdmin');
                            }}
                          >
                            <Shield className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Make Admin</span>
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8"
                          onClick={() => {
                            setSelectedUser(user);
                            setDialogAction('delete');
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={!!dialogAction} onOpenChange={() => setDialogAction(null)}>
        <AlertDialogContent className="bg-gray-900 border border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              {dialogAction === 'delete' && 'Delete User Account'}
              {dialogAction === 'makeAdmin' && 'Confirm Admin Access'}
              {dialogAction === 'removeAdmin' && 'Remove Admin Access'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              {dialogAction === 'delete' && (
                <>
                  Are you sure you want to delete the account for <span className="text-white">{selectedUser?.full_name}</span>?
                  This action cannot be undone and will remove the user's profile and preferences.
                </>
              )}
              {dialogAction === 'makeAdmin' && (
                <>
                  You're granting admin privileges to <span className="text-white">{selectedUser?.full_name}</span>.
                  Admins have full access to the admin panel and can manage all users and settings.
                </>
              )}
              {dialogAction === 'removeAdmin' && (
                <>
                  You're removing admin access from <span className="text-white">{selectedUser?.full_name}</span>.
                  They will no longer have access to admin features or the admin panel.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleActionConfirm}
              className={
                dialogAction === 'delete' 
                  ? 'bg-red-800 hover:bg-red-700' 
                  : dialogAction === 'makeAdmin'
                  ? 'bg-blue-800 hover:bg-blue-700'
                  : 'bg-orange-800 hover:bg-orange-700'
              }
            >
              {dialogAction === 'delete' && (
                <><Trash2 className="w-4 h-4 mr-2" /> Delete Account</>
              )}
              {dialogAction === 'makeAdmin' && (
                <><ShieldCheck className="w-4 h-4 mr-2" /> Grant Admin Access</>
              )}
              {dialogAction === 'removeAdmin' && (
                <><Ban className="w-4 h-4 mr-2" /> Remove Admin Access</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default UsersManagement;
