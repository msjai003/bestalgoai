
import React, { useEffect, useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { PredefinedStrategy } from '@/types/predefined-strategy';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';

const StrategiesEditor: React.FC = () => {
  const { fetchPredefinedStrategies } = useAdmin();
  const [strategies, setStrategies] = useState<PredefinedStrategy[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<PredefinedStrategy | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    loadStrategies();
  }, []);

  const loadStrategies = async () => {
    setLoading(true);
    try {
      const data = await fetchPredefinedStrategies();
      setStrategies(data);
    } catch (error) {
      console.error('Error loading strategies:', error);
      toast.error('Failed to load strategies');
    } finally {
      setLoading(false);
    }
  };

  const filteredStrategies = strategies.filter(
    (strategy) =>
      strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (strategy.description &&
        strategy.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const startEditing = (strategy: PredefinedStrategy) => {
    setEditingStrategy(strategy);
    setEditName(strategy.name);
    setEditDescription(strategy.description || '');
  };

  const cancelEditing = () => {
    setEditingStrategy(null);
    setEditName('');
    setEditDescription('');
  };

  const saveChanges = async () => {
    if (!editingStrategy) return;

    try {
      setLoading(true);
      
      // Using type assertion to work with the existing database structure
      const { error } = await supabase
        .from('predefined_strategies')
        .update({
          name: editName,
          description: editDescription,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingStrategy.id) as { error: any };

      if (error) {
        throw error;
      }

      // Update local state
      setStrategies(prev =>
        prev.map(strategy =>
          strategy.id === editingStrategy.id
            ? {
                ...strategy,
                name: editName,
                description: editDescription,
                updated_at: new Date().toISOString()
              }
            : strategy
        )
      );

      toast.success('Strategy updated successfully');
      cancelEditing();
    } catch (error) {
      console.error('Error updating strategy:', error);
      toast.error('Failed to update strategy');
    } finally {
      setLoading(false);
    }
  };

  const createNewStrategy = async () => {
    try {
      setLoading(true);
      const newStrategy = {
        original_id: Date.now(), // This is just a placeholder, you'd use a proper ID in production
        name: 'New Strategy',
        description: 'Description of the new strategy'
      };

      // Using type assertion to work with the existing database structure
      const { data, error } = await supabase
        .from('predefined_strategies')
        .insert(newStrategy)
        .select() as { data: PredefinedStrategy[] | null, error: any };

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setStrategies(prev => [...prev, data[0]]);
        toast.success('New strategy created');
      }
    } catch (error) {
      console.error('Error creating strategy:', error);
      toast.error('Failed to create strategy');
    } finally {
      setLoading(false);
    }
  };

  const deleteStrategy = async (id: string) => {
    if (!confirm('Are you sure you want to delete this strategy?')) {
      return;
    }

    try {
      setLoading(true);
      
      // Using type assertion to work with the existing database structure
      const { error } = await supabase
        .from('predefined_strategies')
        .delete()
        .eq('id', id) as { error: any };

      if (error) {
        throw error;
      }

      // Update local state
      setStrategies(prev => prev.filter(strategy => strategy.id !== id));
      toast.success('Strategy deleted successfully');
    } catch (error) {
      console.error('Error deleting strategy:', error);
      toast.error('Failed to delete strategy');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Predefined Strategies Editor</h1>
        <Button onClick={createNewStrategy} disabled={loading}>
          Add New Strategy
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-10"
          placeholder="Search strategies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {editingStrategy ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Edit Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Strategy name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Strategy description"
                  rows={5}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={cancelEditing} disabled={loading}>
                  Cancel
                </Button>
                <Button onClick={saveChanges} disabled={loading}>
                  Save Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4">
        {loading && strategies.length === 0 ? (
          <p className="text-center py-8">Loading strategies...</p>
        ) : filteredStrategies.length === 0 ? (
          <p className="text-center py-8">No strategies found.</p>
        ) : (
          filteredStrategies.map((strategy) => (
            <Card key={strategy.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{strategy.name}</h2>
                    <p className="text-gray-500 mb-4">
                      {strategy.description || 'No description provided.'}
                    </p>
                    <p className="text-sm text-gray-400">
                      Last updated: {new Date(strategy.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEditing(strategy)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteStrategy(strategy.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default StrategiesEditor;
