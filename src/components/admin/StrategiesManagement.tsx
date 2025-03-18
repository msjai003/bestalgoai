
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Search, Edit, Trash, Plus, Eye, BarChart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Strategy {
  id: string;
  name: string;
  description: string;
  strategy_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  performance: {
    winRate: string;
    drawdown: string;
    avgProfit: string;
  };
}

const StrategiesManagement = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchStrategies();
  }, []);

  const fetchStrategies = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('custom_strategies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Map the data from Supabase to match the Strategy interface
      const mappedStrategies: Strategy[] = (data || []).map(strategy => {
        // Parse the performance JSON if it's a string, or use default values
        let performanceObj = {
          winRate: "N/A",
          drawdown: "N/A",
          avgProfit: "N/A"
        };
        
        if (strategy.performance) {
          try {
            // If it's a string, try to parse it
            if (typeof strategy.performance === 'string') {
              performanceObj = JSON.parse(strategy.performance);
            } 
            // If it's already an object, use it directly
            else if (typeof strategy.performance === 'object') {
              performanceObj = {
                winRate: strategy.performance.winRate || "N/A",
                drawdown: strategy.performance.drawdown || "N/A",
                avgProfit: strategy.performance.avgProfit || "N/A"
              };
            }
          } catch (e) {
            console.error("Error parsing performance data:", e);
          }
        }

        return {
          id: strategy.id,
          name: strategy.name,
          description: strategy.description || "",
          strategy_type: strategy.strategy_type,
          is_active: strategy.is_active || false,
          created_at: strategy.created_at,
          updated_at: strategy.updated_at,
          user_id: strategy.user_id,
          performance: performanceObj
        };
      });

      setStrategies(mappedStrategies);
    } catch (error) {
      console.error('Error fetching strategies:', error);
      toast.error('Failed to load strategies');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStrategies = strategies.filter(strategy => 
    strategy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (strategy.description && strategy.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Trading Strategies</CardTitle>
            <CardDescription>
              View and manage trading strategies
            </CardDescription>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Strategy
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10 bg-gray-700 border-gray-600"
            placeholder="Search strategies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="rounded-md border border-gray-700 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-900">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Win Rate</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-400">
                    Loading strategies...
                  </TableCell>
                </TableRow>
              ) : filteredStrategies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-400">
                    No strategies found
                  </TableCell>
                </TableRow>
              ) : (
                filteredStrategies.map((strategy) => (
                  <TableRow key={strategy.id} className="hover:bg-gray-700/50">
                    <TableCell className="font-medium">{strategy.name}</TableCell>
                    <TableCell className="capitalize">{strategy.strategy_type}</TableCell>
                    <TableCell>
                      {strategy.is_active ? (
                        <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">Active</Badge>
                      ) : (
                        <Badge className="bg-gray-500/20 text-gray-400 hover:bg-gray-500/30">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>{strategy.performance?.winRate || "N/A"}</TableCell>
                    <TableCell>{formatDate(strategy.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-purple-400 hover:text-purple-300">
                          <BarChart className="h-4 w-4" />
                        </Button>
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

export default StrategiesManagement;
