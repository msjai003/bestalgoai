
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
  Eye, 
  Trash2, 
  Ban,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface Strategy {
  id: string;
  name: string;
  description: string | null;
  strategy_type: string;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  created_by: string | null;
  user_id: string;
  performance: any;
  user_email?: string;
  user_name?: string;
}

interface PerformanceData {
  winRate: string;
  drawdown: string;
  avgProfit: string;
}

const parsePerformanceData = (performance: any): PerformanceData => {
  try {
    if (!performance) {
      return {
        winRate: 'N/A',
        drawdown: 'N/A',
        avgProfit: 'N/A'
      };
    }

    // If performance is already a string, parse it
    if (typeof performance === 'string') {
      try {
        const parsed = JSON.parse(performance);
        return {
          winRate: parsed.winRate || 'N/A',
          drawdown: parsed.drawdown || 'N/A',
          avgProfit: parsed.avgProfit || 'N/A'
        };
      } catch (e) {
        console.error('Error parsing performance string:', e);
        return {
          winRate: 'N/A',
          drawdown: 'N/A',
          avgProfit: 'N/A'
        };
      }
    }

    // If it's an object, extract properties
    return {
      winRate: performance.winRate || 'N/A',
      drawdown: performance.drawdown || 'N/A',
      avgProfit: performance.avgProfit || 'N/A'
    };
  } catch (error) {
    console.error('Error parsing performance data:', error);
    return {
      winRate: 'N/A',
      drawdown: 'N/A',
      avgProfit: 'N/A'
    };
  }
};

const StrategiesManagement: React.FC = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [dialogAction, setDialogAction] = useState<'delete' | 'deactivate' | 'activate' | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortField, setSortField] = useState<'name' | 'created_at'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const fetchStrategies = async () => {
    setIsLoading(true);
    try {
      // Fetch strategies with user information
      const { data, error } = await supabase
        .from('custom_strategies')
        .select(`
          *,
          user_profiles:user_id (
            email,
            full_name
          )
        `);

      if (error) throw error;

      // Transform the data to match our Strategy interface
      const transformedData = data.map((strategy: any) => ({
        ...strategy,
        user_email: strategy.user_profiles?.email || 'Unknown',
        user_name: strategy.user_profiles?.full_name || 'Unknown User'
      }));

      setStrategies(transformedData);
    } catch (error: any) {
      console.error('Error fetching strategies:', error);
      toast.error(`Error loading strategies: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategies();
  }, []);

  const toggleSort = (field: 'name' | 'created_at') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedStrategies = strategies
    .filter(strategy => 
      (strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       strategy.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       strategy.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       strategy.user_email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filter === 'all' || 
       (filter === 'active' && strategy.is_active === true) ||
       (filter === 'inactive' && strategy.is_active === false))
    )
    .sort((a, b) => {
      if (sortField === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        // Sort by created_at date
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
    });

  const handleDeleteStrategy = async () => {
    if (!selectedStrategy) return;
    
    try {
      const { error } = await supabase
        .from('custom_strategies')
        .delete()
        .eq('id', selectedStrategy.id);

      if (error) throw error;

      toast.success(`Strategy "${selectedStrategy.name}" has been deleted`);
      setStrategies(prev => prev.filter(s => s.id !== selectedStrategy.id));
    } catch (error: any) {
      console.error('Error deleting strategy:', error);
      toast.error(`Failed to delete strategy: ${error.message}`);
    }
  };

  const handleToggleStrategyStatus = async () => {
    if (!selectedStrategy) return;
    
    const newStatus = dialogAction === 'activate';
    
    try {
      const { error } = await supabase
        .from('custom_strategies')
        .update({ is_active: newStatus })
        .eq('id', selectedStrategy.id);

      if (error) throw error;

      toast.success(`Strategy "${selectedStrategy.name}" has been ${newStatus ? 'activated' : 'deactivated'}`);
      setStrategies(prev => 
        prev.map(s => 
          s.id === selectedStrategy.id ? { ...s, is_active: newStatus } : s
        )
      );
    } catch (error: any) {
      console.error('Error updating strategy status:', error);
      toast.error(`Failed to update strategy status: ${error.message}`);
    }
  };

  const handleActionConfirm = () => {
    switch (dialogAction) {
      case 'delete':
        handleDeleteStrategy();
        break;
      case 'activate':
      case 'deactivate':
        handleToggleStrategyStatus();
        break;
    }
    setDialogAction(null);
    setSelectedStrategy(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Strategy Management</h1>
          <div className="flex w-full sm:w-auto items-center gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search strategies..."
                className="pl-9 bg-gray-800 border-gray-700 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="icon"
              className="border-gray-700"
              onClick={fetchStrategies}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <ToggleGroup 
            type="single" 
            value={filter} 
            onValueChange={(value) => setFilter(value as 'all' | 'active' | 'inactive')}
            className="bg-gray-800 border border-gray-700 rounded-md p-1"
          >
            <ToggleGroupItem 
              value="all" 
              className={`text-xs px-3 py-1 h-7 ${filter === 'all' ? 'bg-gray-700' : ''}`}
            >
              All
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="active" 
              className={`text-xs px-3 py-1 h-7 ${filter === 'active' ? 'bg-gray-700' : ''}`}
            >
              Active
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="inactive" 
              className={`text-xs px-3 py-1 h-7 ${filter === 'inactive' ? 'bg-gray-700' : ''}`}
            >
              Inactive
            </ToggleGroupItem>
          </ToggleGroup>
          
          <div className="text-sm text-gray-400">
            {filteredAndSortedStrategies.length} strategies found
          </div>
        </div>

        <div className="rounded-md border border-gray-700 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-800">
              <TableRow className="border-gray-700 hover:bg-gray-800">
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => toggleSort('name')}
                >
                  <div className="flex items-center">
                    Strategy Name
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>User</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Performance</TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => toggleSort('created_at')}
                >
                  <div className="flex items-center">
                    Created
                    {sortField === 'created_at' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-gray-900">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#FF00D4]" />
                    <span className="mt-2 block text-gray-400">Loading strategies...</span>
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedStrategies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <AlertTriangle className="w-6 h-6 mx-auto text-yellow-500 mb-2" />
                    <span className="block text-gray-400">
                      {searchTerm || filter !== 'all' ? "No strategies match your filters" : "No strategies found"}
                    </span>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedStrategies.map((strategy) => {
                  const performanceData = parsePerformanceData(strategy.performance);
                  
                  return (
                    <TableRow key={strategy.id} className="border-gray-800">
                      <TableCell className="font-medium">
                        {strategy.name}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{strategy.user_name}</div>
                          <div className="text-sm text-gray-400">{strategy.user_email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className="capitalize">
                          {strategy.strategy_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="text-xs space-y-1">
                          <div>Win Rate: {performanceData.winRate}</div>
                          <div>Drawdown: {performanceData.drawdown}</div>
                          <div>Avg Profit: {performanceData.avgProfit}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {strategy.created_at ? new Date(strategy.created_at).toLocaleDateString() : 'Unknown'}
                      </TableCell>
                      <TableCell>
                        {strategy.is_active ? (
                          <Badge 
                            className="bg-green-900/30 text-green-300 border-green-800 flex items-center gap-1 w-fit"
                          >
                            <Check className="w-3 h-3" />
                            Active
                          </Badge>
                        ) : (
                          <Badge 
                            variant="outline" 
                            className="text-gray-400 border-gray-700 flex items-center gap-1 w-fit"
                          >
                            <Ban className="w-3 h-3" />
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-blue-800 text-blue-300 hover:bg-blue-900/30"
                            onClick={() => {
                              window.open(`/strategy-details/${strategy.id}`, '_blank');
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                          
                          {strategy.is_active ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-orange-800 text-orange-300 hover:bg-orange-900/30"
                              onClick={() => {
                                setSelectedStrategy(strategy);
                                setDialogAction('deactivate');
                              }}
                            >
                              <Ban className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Deactivate</span>
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-green-800 text-green-300 hover:bg-green-900/30"
                              onClick={() => {
                                setSelectedStrategy(strategy);
                                setDialogAction('activate');
                              }}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Activate</span>
                            </Button>
                          )}
                          
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-8"
                            onClick={() => {
                              setSelectedStrategy(strategy);
                              setDialogAction('delete');
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={!!dialogAction} onOpenChange={() => setDialogAction(null)}>
        <AlertDialogContent className="bg-gray-900 border border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              {dialogAction === 'delete' && 'Delete Strategy'}
              {dialogAction === 'deactivate' && 'Deactivate Strategy'}
              {dialogAction === 'activate' && 'Activate Strategy'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              {dialogAction === 'delete' && (
                <>
                  Are you sure you want to delete the strategy <span className="text-white">"{selectedStrategy?.name}"</span>?
                  This action cannot be undone and will remove all associated data.
                </>
              )}
              {dialogAction === 'deactivate' && (
                <>
                  You're deactivating the strategy <span className="text-white">"{selectedStrategy?.name}"</span>.
                  It will no longer be available for trading until reactivated.
                </>
              )}
              {dialogAction === 'activate' && (
                <>
                  You're activating the strategy <span className="text-white">"{selectedStrategy?.name}"</span>.
                  It will be available for trading after activation.
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
                  : dialogAction === 'activate'
                  ? 'bg-green-800 hover:bg-green-700'
                  : 'bg-orange-800 hover:bg-orange-700'
              }
            >
              {dialogAction === 'delete' && (
                <><Trash2 className="w-4 h-4 mr-2" /> Delete Strategy</>
              )}
              {dialogAction === 'deactivate' && (
                <><Ban className="w-4 h-4 mr-2" /> Deactivate Strategy</>
              )}
              {dialogAction === 'activate' && (
                <><Check className="w-4 h-4 mr-2" /> Activate Strategy</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default StrategiesManagement;
