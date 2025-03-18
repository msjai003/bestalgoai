
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search,
  RefreshCw, 
  AlertTriangle,
  Edit,
  Plus
} from 'lucide-react';
import { predefinedStrategies } from '@/constants/strategy-data';

interface Strategy {
  id: number;
  name: string;
  description: string;
  performance: {
    winRate: string;
    avgProfit: string;
    drawdown: string;
  };
  parameters: Array<{
    name: string;
    value: string;
  }>;
  dbId?: string;
}

const StrategiesEditor: React.FC = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editStrategy, setEditStrategy] = useState<Strategy | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>('');
  const [editedDescription, setEditedDescription] = useState<string>('');

  const fetchStrategies = async () => {
    setIsLoading(true);
    try {
      // Fetch strategies from Supabase
      const { data, error } = await supabase
        .from('predefined_strategies')
        .select('*');

      if (error) throw error;

      // Map database data with predefined strategies
      const mappedStrategies = predefinedStrategies.map(strategy => {
        const dbStrategy = data?.find(s => s.original_id === strategy.id);
        return {
          ...strategy,
          name: dbStrategy?.name || strategy.name,
          description: dbStrategy?.description || strategy.description,
          dbId: dbStrategy?.id
        };
      });

      setStrategies(mappedStrategies);
    } catch (error: any) {
      console.error('Error fetching strategies:', error);
      toast.error(`Error loading strategies: ${error.message}`);
      // Fallback to predefined strategies if database fetch fails
      setStrategies(predefinedStrategies);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategies();
  }, []);

  const handleEditClick = (strategy: Strategy) => {
    setEditStrategy(strategy);
    setEditedName(strategy.name);
    setEditedDescription(strategy.description);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editStrategy) return;

    try {
      // Check if strategy already exists in the database
      if (editStrategy.dbId) {
        // Update existing record
        const { error } = await supabase
          .from('predefined_strategies')
          .update({ 
            name: editedName,
            description: editedDescription,
            updated_at: new Date()
          })
          .eq('id', editStrategy.dbId);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('predefined_strategies')
          .insert({ 
            original_id: editStrategy.id,
            name: editedName,
            description: editedDescription
          });

        if (error) throw error;
      }

      toast.success('Strategy updated successfully');
      setIsEditDialogOpen(false);
      fetchStrategies();
    } catch (error: any) {
      console.error('Error updating strategy:', error);
      toast.error(`Failed to update strategy: ${error.message}`);
    }
  };

  const filteredStrategies = strategies.filter(strategy => 
    strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    strategy.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Predefined Strategies</h1>
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
        
        <div className="text-sm text-gray-400 mb-4">
          {filteredStrategies.length} predefined strategies
        </div>

        <div className="rounded-md border border-gray-700 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-800">
              <TableRow className="border-gray-700 hover:bg-gray-800">
                <TableHead>ID</TableHead>
                <TableHead>Strategy Name</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead className="hidden md:table-cell">Performance</TableHead>
                <TableHead className="hidden lg:table-cell">Parameters</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-gray-900">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#FF00D4]" />
                    <span className="mt-2 block text-gray-400">Loading strategies...</span>
                  </TableCell>
                </TableRow>
              ) : filteredStrategies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <AlertTriangle className="w-6 h-6 mx-auto text-yellow-500 mb-2" />
                    <span className="block text-gray-400">
                      No strategies found
                    </span>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStrategies.map((strategy) => (
                  <TableRow key={strategy.id} className="border-gray-800">
                    <TableCell>{strategy.id}</TableCell>
                    <TableCell className="font-medium">
                      {strategy.name}
                      {strategy.dbId && (
                        <Badge variant="outline" className="ml-2 text-xs bg-purple-900/30 text-purple-300 border-purple-800">
                          Customized
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate">
                      {strategy.description}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-xs space-y-1">
                        <div>Win Rate: {strategy.performance.winRate}</div>
                        <div>Drawdown: {strategy.performance.drawdown}</div>
                        <div>Avg Profit: {strategy.performance.avgProfit}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="text-xs space-y-1">
                        {strategy.parameters.slice(0, 2).map((param, idx) => (
                          <div key={idx}>
                            {param.name}: {param.value}
                          </div>
                        ))}
                        {strategy.parameters.length > 2 && (
                          <div>+{strategy.parameters.length - 2} more</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-blue-800 text-blue-300 hover:bg-blue-900/30"
                        onClick={() => handleEditClick(strategy)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-900 border border-gray-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Strategy</DialogTitle>
            <DialogDescription className="text-gray-400">
              Customize the name and description of this predefined strategy.
            </DialogDescription>
          </DialogHeader>
          
          {editStrategy && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-300">
                  Strategy Name
                </label>
                <Input
                  id="name"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-gray-300">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="bg-gray-800 border-gray-700 min-h-[100px]"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEdit}
              className="bg-[#FF00D4] hover:bg-[#FF00D4]/80"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default StrategiesEditor;
