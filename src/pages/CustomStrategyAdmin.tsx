
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Pencil, Save, Trash, RefreshCw } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Strategy {
  id: string;
  name: string;
  description: string | null;
  user_id: string;
}

const CustomStrategyAdmin = () => {
  const { user } = useAuth();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  // Fetch custom strategies
  const fetchStrategies = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('custom_strategies')
        .select('id, name, description, user_id')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStrategies(data || []);
    } catch (error: any) {
      toast.error(`Error fetching strategies: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStrategies();
    }
  }, [user]);

  // Start editing a strategy
  const handleEdit = (strategy: Strategy) => {
    setEditingId(strategy.id);
    setEditName(strategy.name);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  // Save strategy name change
  const handleSave = async (id: string) => {
    if (!editName.trim()) {
      toast.error('Strategy name cannot be empty');
      return;
    }

    try {
      const { error } = await supabase
        .from('custom_strategies')
        .update({ name: editName.trim() })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setStrategies(prevStrategies => 
        prevStrategies.map(strategy => 
          strategy.id === id ? { ...strategy, name: editName.trim() } : strategy
        )
      );
      
      toast.success('Strategy updated successfully');
      setEditingId(null);
      setEditName('');
    } catch (error: any) {
      toast.error(`Failed to update strategy: ${error.message}`);
    }
  };

  // Delete a strategy
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this strategy? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('custom_strategies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setStrategies(prevStrategies => 
        prevStrategies.filter(strategy => strategy.id !== id)
      );
      
      toast.success('Strategy deleted successfully');
    } catch (error: any) {
      toast.error(`Failed to delete strategy: ${error.message}`);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4 max-w-5xl">
        <h1 className="text-2xl font-bold mb-6">Custom Strategy Admin</h1>
        
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl">Manage Custom Strategies</h2>
          <Button 
            onClick={fetchStrategies} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-8">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : strategies.length === 0 ? (
          <div className="text-center p-8 border rounded-lg bg-background">
            <p>No custom strategies found</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Strategy Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {strategies.map((strategy) => (
                  <TableRow key={strategy.id}>
                    <TableCell>
                      {editingId === strategy.id ? (
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full"
                        />
                      ) : (
                        strategy.name
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {strategy.description || 'N/A'}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {strategy.user_id}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingId === strategy.id ? (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSave(strategy.id)}
                            className="flex items-center gap-1"
                          >
                            <Save className="h-4 w-4" />
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(strategy)}
                            className="flex items-center gap-1"
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(strategy.id)}
                            className="flex items-center gap-1"
                          >
                            <Trash className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        <div className="mt-6 p-4 bg-muted/30 rounded-lg border">
          <h3 className="text-lg font-medium mb-2">Admin Panel Information</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>This panel allows you to manage custom strategy names in the database.</li>
            <li>You can edit strategy names by clicking the 'Edit' button.</li>
            <li>Changes are immediately saved to the Supabase database.</li>
          </ul>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CustomStrategyAdmin;
