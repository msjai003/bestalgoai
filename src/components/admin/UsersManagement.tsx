
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, User, MoreVertical, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  mobile_number: string;
  created_at: string;
  trading_experience: string;
  isAdmin?: boolean;
}

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [admins, setAdmins] = useState<Set<string>>(new Set());

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Fetch user profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profilesError) throw profilesError;
      
      // Fetch admin users
      const { data: adminUsers, error: adminsError } = await supabase
        .from('admin_users')
        .select('user_id');
      
      if (adminsError) throw adminsError;
      
      // Create a set of admin user IDs for quick lookup
      const adminSet = new Set(adminUsers?.map(admin => admin.user_id) || []);
      setAdmins(adminSet);
      
      // Combine the data
      const usersWithAdminStatus = profiles?.map(profile => ({
        ...profile,
        isAdmin: adminSet.has(profile.id)
      })) || [];
      
      setUsers(usersWithAdminStatus);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const makeAdmin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('admin_users')
        .insert({ user_id: userId });
      
      if (error) throw error;
      
      toast.success('User promoted to admin');
      fetchUsers();
    } catch (error) {
      console.error('Error making user admin:', error);
      toast.error('Failed to promote user');
    }
  };

  const removeAdmin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('user_id', userId);
      
      if (error) throw error;
      
      toast.success('Admin access revoked');
      fetchUsers();
    } catch (error) {
      console.error('Error removing admin:', error);
      toast.error('Failed to revoke admin access');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Users Management</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8 bg-background"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <span>{user.full_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.mobile_number}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {user.trading_experience || 'Not specified'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {user.isAdmin ? (
                      <Badge className="bg-purple-600">Admin</Badge>
                    ) : (
                      <Badge variant="outline">User</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        {user.isAdmin ? (
                          <DropdownMenuItem onClick={() => removeAdmin(user.id)}>
                            <Shield className="mr-2 h-4 w-4" />
                            Remove Admin
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => makeAdmin(user.id)}>
                            <Shield className="mr-2 h-4 w-4" />
                            Make Admin
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UsersManagement;
