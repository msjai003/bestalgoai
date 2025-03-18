
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleUser, Briefcase, LineChart, Link as LinkIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const SystemOverview: React.FC = () => {
  const [stats, setStats] = useState({
    userCount: 0,
    brokerCount: 0,
    strategyCount: 0,
    activeConnections: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Fetch user count
        const { count: userCount, error: userError } = await supabase
          .from('user_profiles')
          .select('*', { count: 'exact', head: true });
        
        if (userError) throw userError;
        
        // Fetch broker count
        const { count: brokerCount, error: brokerError } = await supabase
          .from('broker_credentials')
          .select('*', { count: 'exact', head: true });
        
        if (brokerError) throw brokerError;
        
        // Fetch strategy count
        const { count: strategyCount, error: strategyError } = await supabase
          .from('custom_strategies')
          .select('*', { count: 'exact', head: true });
        
        if (strategyError) throw strategyError;
        
        // Fetch active connections (broker connections with status 'connected')
        const { count: activeConnections, error: connectionsError } = await supabase
          .from('broker_credentials')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'connected');
        
        if (connectionsError) throw connectionsError;
        
        setStats({
          userCount: userCount || 0,
          brokerCount: brokerCount || 0,
          strategyCount: strategyCount || 0,
          activeConnections: activeConnections || 0
        });
      } catch (error) {
        console.error('Error fetching system stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">System Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <CircleUser className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats.userCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Registered accounts
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Broker Integrations</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats.brokerCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Configured brokers
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Strategies</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats.strategyCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Custom strategies
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats.activeConnections}
            </div>
            <p className="text-xs text-muted-foreground">
              Live broker connections
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemOverview;
