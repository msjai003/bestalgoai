
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Users, Building, LineChart as StrategyIcon, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const SystemOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBrokers: 0,
    totalStrategies: 0,
    activeConnections: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Count users
        const { count: userCount, error: userError } = await supabase
          .from('user_profiles')
          .select('*', { count: 'exact', head: true });

        // Count broker connections
        const { count: brokerCount, error: brokerError } = await supabase
          .from('broker_credentials')
          .select('*', { count: 'exact', head: true });

        // Count strategies
        const { count: strategyCount, error: strategyError } = await supabase
          .from('custom_strategies')
          .select('*', { count: 'exact', head: true });

        // Count active broker connections
        const { count: activeCount, error: activeError } = await supabase
          .from('broker_credentials')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'connected');

        setStats({
          totalUsers: userCount || 0,
          totalBrokers: brokerCount || 0,
          totalStrategies: strategyCount || 0,
          activeConnections: activeCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      description: "Registered user accounts",
      icon: <Users className="h-6 w-6 text-blue-400" />,
      color: "bg-blue-400/10 border-blue-400/20"
    },
    {
      title: "Connected Brokers",
      value: stats.totalBrokers,
      description: "Broker integrations",
      icon: <Building className="h-6 w-6 text-pink-400" />,
      color: "bg-pink-400/10 border-pink-400/20"
    },
    {
      title: "Strategies",
      value: stats.totalStrategies,
      description: "Custom trading strategies",
      icon: <StrategyIcon className="h-6 w-6 text-green-400" />,
      color: "bg-green-400/10 border-green-400/20"
    },
    {
      title: "Active Connections",
      value: stats.activeConnections,
      description: "Currently active broker connections",
      icon: <Clock className="h-6 w-6 text-purple-400" />,
      color: "bg-purple-400/10 border-purple-400/20"
    }
  ];

  return (
    <>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
          <CardDescription>
            Key metrics and system health
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card, index) => (
              <Card key={index} className={`${card.color} border`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    {card.icon}
                    <span className="text-2xl font-bold">
                      {isLoading ? "..." : card.value}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium mt-2">{card.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default SystemOverview;
