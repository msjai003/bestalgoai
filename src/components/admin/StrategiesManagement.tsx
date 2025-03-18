
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
import { Search, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

interface Strategy {
  id: string;
  name: string;
  description: string;
  strategy_type: string;
  user_id: string;
  user_name?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  legs: Json;
  performance: {
    winRate: string;
    drawdown: string;
    avgProfit: string;
  };
}

const StrategiesManagement: React.FC = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStrategies = async () => {
    setIsLoading(true);
    try {
      // Fetch all custom strategies
      const { data: strategiesData, error: strategiesError } = await supabase
        .from('custom_strategies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (strategiesError) throw strategiesError;
      
      // For each strategy, fetch the associated user details
      const enhancedStrategies = await Promise.all(
        (strategiesData || []).map(async (strategy) => {
          try {
            const { data: userData, error: userError } = await supabase
              .from('user_profiles')
              .select('full_name')
              .eq('id', strategy.user_id)
              .single();
            
            if (userError) throw userError;
            
            // Parse performance data
            let performanceData = {
              winRate: 'N/A',
              drawdown: 'N/A',
              avgProfit: 'N/A'
            };
            
            if (strategy.performance) {
              // Handle different formats of performance data
              if (typeof strategy.performance === 'string') {
                try {
                  performanceData = JSON.parse(strategy.performance);
                } catch (e) {
                  console.error('Error parsing performance JSON:', e);
                }
              } else {
                // It's already an object
                performanceData = {
                  winRate: strategy.performance.winRate || 'N/A',
                  drawdown: strategy.performance.drawdown || 'N/A',
                  avgProfit: strategy.performance.avgProfit || 'N/A'
                };
              }
            }
            
            return {
              ...strategy,
              user_name: userData?.full_name,
              performance: performanceData
            } as Strategy;
          } catch (error) {
            console.error(`Error fetching user for strategy ${strategy.id}:`, error);
            
            return {
              ...strategy,
              performance: {
                winRate: 'N/A',
                drawdown: 'N/A',
                avgProfit: 'N/A'
              }
            } as Strategy;
          }
        })
      );
      
      setStrategies(enhancedStrategies);
    } catch (error) {
      console.error('Error fetching strategies:', error);
      toast.error('Failed to load strategies');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategies();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredStrategies = strategies.filter(strategy => 
    strategy.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (strategy.description && strategy.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    strategy.strategy_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (strategy.user_name && strategy.user_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleStrategyStatus = async (strategyId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('custom_strategies')
        .update({ is_active: isActive })
        .eq('id', strategyId);
      
      if (error) throw error;
      
      toast.success(`Strategy ${isActive ? 'activated' : 'deactivated'}`);
      fetchStrategies();
    } catch (error) {
      console.error('Error updating strategy status:', error);
      toast.error('Failed to update strategy status');
    }
  };

  const deleteStrategy = async (strategyId: string) => {
    try {
      const { error } = await supabase
        .from('custom_strategies')
        .delete()
        .eq('id', strategyId);
      
      if (error) throw error;
      
      toast.success('Strategy deleted');
      fetchStrategies();
    } catch (error) {
      console.error('Error deleting strategy:', error);
      toast.error('Failed to delete strategy');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Strategies Management</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search strategies..."
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
              <TableHead>Strategy</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Loading strategies...
                </TableCell>
              </TableRow>
            ) : filteredStrategies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No strategies found
                </TableCell>
              </TableRow>
            ) : (
              filteredStrategies.map((strategy) => (
                <TableRow key={strategy.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{strategy.name}</span>
                      {strategy.description && (
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {strategy.description}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {strategy.strategy_type}
                    </Badge>
                  </TableCell>
                  <TableCell>{strategy.user_name || 'Unknown'}</TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <div>Win Rate: {strategy.performance.winRate}</div>
                      <div>Drawdown: {strategy.performance.drawdown}</div>
                      <div>Avg Profit: {strategy.performance.avgProfit}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={strategy.is_active ? 'default' : 'secondary'}
                    >
                      {strategy.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(strategy.created_at).toLocaleDateString()}
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
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Strategy
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {strategy.is_active ? (
                          <DropdownMenuItem onClick={() => toggleStrategyStatus(strategy.id, false)}>
                            Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => toggleStrategyStatus(strategy.id, true)}>
                            Activate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => deleteStrategy(strategy.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
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

export default StrategiesManagement;
