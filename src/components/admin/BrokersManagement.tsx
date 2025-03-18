
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
import { Search, MoreVertical, Check, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

interface BrokerConnection {
  id: string;
  user_id: string;
  broker_id: number;
  broker_name: string;
  username: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_email?: string;
  user_name?: string;
}

const BrokersManagement: React.FC = () => {
  const [brokers, setBrokers] = useState<BrokerConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBrokers = async () => {
    setIsLoading(true);
    try {
      // Fetch broker credentials
      const { data: brokerData, error: brokerError } = await supabase
        .from('broker_credentials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (brokerError) throw brokerError;
      
      // For each broker, fetch the associated user details
      const enhancedBrokers = await Promise.all(
        (brokerData || []).map(async (broker) => {
          try {
            const { data: userData, error: userError } = await supabase
              .from('user_profiles')
              .select('email, full_name')
              .eq('id', broker.user_id)
              .single();
            
            if (userError) throw userError;
            
            return {
              ...broker,
              user_email: userData?.email,
              user_name: userData?.full_name
            };
          } catch (error) {
            console.error(`Error fetching user for broker ${broker.id}:`, error);
            return broker;
          }
        })
      );
      
      setBrokers(enhancedBrokers);
    } catch (error) {
      console.error('Error fetching brokers:', error);
      toast.error('Failed to load broker connections');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrokers();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredBrokers = brokers.filter(broker => 
    broker.broker_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    broker.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (broker.user_email && broker.user_email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (broker.user_name && broker.user_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const updateBrokerStatus = async (brokerId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('broker_credentials')
        .update({ status })
        .eq('id', brokerId);
      
      if (error) throw error;
      
      toast.success(`Broker status updated to ${status}`);
      fetchBrokers();
    } catch (error) {
      console.error('Error updating broker status:', error);
      toast.error('Failed to update broker status');
    }
  };

  const deleteBroker = async (brokerId: string) => {
    try {
      const { error } = await supabase
        .from('broker_credentials')
        .delete()
        .eq('id', brokerId);
      
      if (error) throw error;
      
      toast.success('Broker connection deleted');
      fetchBrokers();
    } catch (error) {
      console.error('Error deleting broker:', error);
      toast.error('Failed to delete broker connection');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Broker Connections</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search brokers..."
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
              <TableHead>Broker</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Connected</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Loading broker connections...
                </TableCell>
              </TableRow>
            ) : filteredBrokers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No broker connections found
                </TableCell>
              </TableRow>
            ) : (
              filteredBrokers.map((broker) => (
                <TableRow key={broker.id}>
                  <TableCell>
                    <div className="font-medium">{broker.broker_name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{broker.user_name || 'Unknown'}</span>
                      <span className="text-xs text-muted-foreground">{broker.user_email || 'No email'}</span>
                    </div>
                  </TableCell>
                  <TableCell>{broker.username}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        broker.status === 'connected' ? 'default' :
                        broker.status === 'pending' ? 'secondary' :
                        broker.status === 'error' ? 'destructive' : 'outline'
                      }
                    >
                      {broker.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(broker.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(broker.updated_at).toLocaleDateString()}
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
                        <DropdownMenuItem onClick={() => updateBrokerStatus(broker.id, 'connected')}>
                          <Check className="mr-2 h-4 w-4" />
                          Mark as Connected
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateBrokerStatus(broker.id, 'error')}>
                          <X className="mr-2 h-4 w-4" />
                          Mark as Error
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => deleteBroker(broker.id)}
                        >
                          Delete Connection
                        </DropdownMenuItem>
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

export default BrokersManagement;
