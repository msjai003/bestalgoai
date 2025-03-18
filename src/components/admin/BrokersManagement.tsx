
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Search, Edit, Trash, Plus, CheckCircle, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface BrokerConnection {
  id: string;
  user_id: string;
  broker_id: number;
  broker_name: string;
  username: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const BrokersManagement = () => {
  const [brokers, setBrokers] = useState<BrokerConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBrokers();
  }, []);

  const fetchBrokers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('broker_credentials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setBrokers(data || []);
    } catch (error) {
      console.error('Error fetching brokers:', error);
      toast.error('Failed to load broker connections');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBrokers = brokers.filter(broker => 
    broker.broker_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    broker.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">Connected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/30">Failed</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 hover:bg-gray-500/30">{status}</Badge>;
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Broker Connections</CardTitle>
            <CardDescription>
              View and manage broker integrations
            </CardDescription>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Broker
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10 bg-gray-700 border-gray-600"
            placeholder="Search brokers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="rounded-md border border-gray-700 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-900">
              <TableRow>
                <TableHead>Broker</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-400">
                    Loading broker connections...
                  </TableCell>
                </TableRow>
              ) : filteredBrokers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-400">
                    No broker connections found
                  </TableCell>
                </TableRow>
              ) : (
                filteredBrokers.map((broker) => (
                  <TableRow key={broker.id} className="hover:bg-gray-700/50">
                    <TableCell className="font-medium">{broker.broker_name}</TableCell>
                    <TableCell>{broker.username}</TableCell>
                    <TableCell>{getStatusBadge(broker.status)}</TableCell>
                    <TableCell>{formatDate(broker.created_at)}</TableCell>
                    <TableCell>{formatDate(broker.updated_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {broker.status !== 'connected' && (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-green-400 hover:text-green-300">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {broker.status === 'connected' && (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-yellow-400 hover:text-yellow-300">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-300">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrokersManagement;
