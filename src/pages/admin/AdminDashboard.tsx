
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  BarChart3, 
  AlertTriangle, 
  Activity,
  RefreshCw,
  Info 
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStrategies: 0,
    activeStrategies: 0,
    alerts: 0,
    isLoading: true,
    error: null as string | null
  });

  const fetchStats = async () => {
    try {
      setStats(prev => ({ ...prev, isLoading: true, error: null }));

      // Fetch user count
      const { count: userCount, error: userError } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      if (userError) throw new Error(`Error fetching users: ${userError.message}`);

      // Fetch strategies
      const { count: strategyCount, error: strategyError } = await supabase
        .from('custom_strategies')
        .select('*', { count: 'exact', head: true });

      if (strategyError) throw new Error(`Error fetching strategies: ${strategyError.message}`);

      // Fetch active strategies
      const { count: activeCount, error: activeError } = await supabase
        .from('custom_strategies')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (activeError) throw new Error(`Error fetching active strategies: ${activeError.message}`);

      setStats({
        totalUsers: userCount || 0,
        totalStrategies: strategyCount || 0,
        activeStrategies: activeCount || 0,
        alerts: Math.floor(Math.random() * 5), // Mock data - replace with actual alerts count
        isLoading: false,
        error: null
      });
    } catch (error: any) {
      console.error('Error fetching admin stats:', error);
      setStats(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message 
      }));
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button 
            onClick={fetchStats}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
            disabled={stats.isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${stats.isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {stats.error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {stats.error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.isLoading ? '...' : stats.totalUsers}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Registered users on the platform
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Strategies
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.isLoading ? '...' : stats.totalStrategies}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Created strategies
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Active Strategies
              </CardTitle>
              <Activity className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.isLoading ? '...' : stats.activeStrategies}
              </div>
              <div className="flex items-center mt-1">
                <p className="text-xs text-gray-400">
                  Currently active strategies
                </p>
                <Badge 
                  variant="secondary" 
                  className="ml-2 bg-green-900/30 text-green-400 border-green-800 text-[10px]"
                >
                  {stats.isLoading ? '...' : Math.round(stats.activeStrategies / Math.max(stats.totalStrategies, 1) * 100)}%
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                System Alerts
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.isLoading ? '...' : stats.alerts}
              </div>
              <div className="flex items-center mt-1">
                <p className="text-xs text-gray-400">
                  Active alerts requiring attention
                </p>
                {stats.alerts > 0 && !stats.isLoading && (
                  <Badge 
                    variant="secondary" 
                    className="ml-2 bg-red-900/30 text-red-400 border-red-800 text-[10px]"
                  >
                    {stats.alerts} new
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription className="text-gray-400">
              Welcome to the admin panel. Here are some things you can do:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-blue-900/20 border-blue-800">
              <Info className="h-4 w-4 text-blue-400" />
              <AlertTitle className="text-blue-300">Manage Users</AlertTitle>
              <AlertDescription className="text-blue-200/80">
                View and manage user accounts, reset passwords, and handle user-related issues.
              </AlertDescription>
            </Alert>
            
            <Alert className="bg-purple-900/20 border-purple-800">
              <Info className="h-4 w-4 text-purple-400" />
              <AlertTitle className="text-purple-300">Strategy Management</AlertTitle>
              <AlertDescription className="text-purple-200/80">
                Review, approve, or disable trading strategies created by users.
              </AlertDescription>
            </Alert>
            
            <Alert className="bg-green-900/20 border-green-800">
              <Info className="h-4 w-4 text-green-400" />
              <AlertTitle className="text-green-300">System Health</AlertTitle>
              <AlertDescription className="text-green-200/80">
                Monitor system performance, check logs, and address any critical alerts.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
