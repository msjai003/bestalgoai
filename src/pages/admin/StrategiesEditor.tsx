
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PredefinedStrategy } from '@/types/predefined-strategy';

const StrategiesEditor = () => {
  const [strategies, setStrategies] = useState<PredefinedStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [editingStrategy, setEditingStrategy] = useState<PredefinedStrategy | null>(null);
  const [newStrategy, setNewStrategy] = useState({
    original_id: 0,
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchStrategies();
  }, []);

  const fetchStrategies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Type assertion here to help TypeScript
      const { data, error } = await supabase
        .from('predefined_strategies')
        .select('*') as { data: PredefinedStrategy[] | null, error: any };
      
      if (error) throw error;
      
      if (data) {
        setStrategies(data);
      }
    } catch (err: any) {
      console.error('Error fetching strategies:', err);
      setError(err.message);
      toast.error('Failed to load strategies');
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (strategy: PredefinedStrategy) => {
    setEditingStrategy(strategy);
  };

  const handleCancelEdit = () => {
    setEditingStrategy(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    isNew: boolean
  ) => {
    const { name, value } = e.target;
    
    if (isNew) {
      setNewStrategy({
        ...newStrategy,
        [name]: value
      });
    } else if (editingStrategy) {
      setEditingStrategy({
        ...editingStrategy,
        [name]: value
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!editingStrategy) return;
    
    try {
      // Use a string type for updated_at instead of Date
      const updatedStrategy = {
        ...editingStrategy,
        updated_at: new Date().toISOString()
      };
      
      // Type assertion here to help TypeScript
      const { error } = await supabase
        .from('predefined_strategies')
        .update(updatedStrategy)
        .eq('id', editingStrategy.id) as { error: any };
      
      if (error) throw error;
      
      toast.success('Strategy updated successfully');
      setEditingStrategy(null);
      fetchStrategies();
    } catch (err: any) {
      console.error('Error updating strategy:', err);
      toast.error('Failed to update strategy');
    }
  };

  const handleAddStrategy = async () => {
    try {
      if (!newStrategy.name || !newStrategy.original_id) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      // Type assertion here to help TypeScript
      const { error } = await supabase
        .from('predefined_strategies')
        .insert({
          original_id: newStrategy.original_id,
          name: newStrategy.name,
          description: newStrategy.description
        }) as { error: any };
      
      if (error) throw error;
      
      toast.success('Strategy added successfully');
      setNewStrategy({
        original_id: 0,
        name: '',
        description: ''
      });
      fetchStrategies();
    } catch (err: any) {
      console.error('Error adding strategy:', err);
      toast.error('Failed to add strategy');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading strategies...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/30 border border-red-700 rounded-md text-white">
        <h2 className="text-lg font-semibold">Error</h2>
        <p>{error}</p>
        <Button variant="outline" className="mt-4" onClick={fetchStrategies}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Predefined Strategies Editor</h1>
      
      <Card className="bg-gray-800 border-gray-700 mb-8">
        <CardHeader>
          <CardTitle>Add New Strategy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block mb-2">Original ID</label>
            <Input 
              type="number"
              name="original_id"
              value={newStrategy.original_id}
              onChange={(e) => handleInputChange(e, true)}
              className="bg-gray-700 border-gray-600"
            />
          </div>
          <div>
            <label className="block mb-2">Name</label>
            <Input 
              name="name"
              value={newStrategy.name}
              onChange={(e) => handleInputChange(e, true)}
              className="bg-gray-700 border-gray-600"
            />
          </div>
          <div>
            <label className="block mb-2">Description</label>
            <Textarea 
              name="description"
              value={newStrategy.description}
              onChange={(e) => handleInputChange(e, true)}
              className="bg-gray-700 border-gray-600"
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddStrategy}>Add Strategy</Button>
        </CardFooter>
      </Card>
      
      <h2 className="text-xl font-semibold mb-4">Existing Strategies</h2>
      
      {strategies.length === 0 ? (
        <p className="text-gray-400">No predefined strategies found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {strategies.map((strategy) => (
            <Card key={strategy.id} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>{strategy.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {editingStrategy && editingStrategy.id === strategy.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2">Original ID</label>
                      <Input 
                        type="number"
                        name="original_id"
                        value={editingStrategy.original_id}
                        onChange={(e) => handleInputChange(e, false)}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Name</label>
                      <Input 
                        name="name"
                        value={editingStrategy.name}
                        onChange={(e) => handleInputChange(e, false)}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Description</label>
                      <Textarea 
                        name="description"
                        value={editingStrategy.description || ''}
                        onChange={(e) => handleInputChange(e, false)}
                        className="bg-gray-700 border-gray-600"
                        rows={3}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm mb-2 text-gray-400">Original ID: {strategy.original_id}</p>
                    <p className="mb-2">{strategy.description || 'No description'}</p>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(strategy.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Updated: {new Date(strategy.updated_at).toLocaleDateString()}
                    </p>
                  </>
                )}
              </CardContent>
              <CardFooter>
                {editingStrategy && editingStrategy.id === strategy.id ? (
                  <div className="flex gap-2">
                    <Button onClick={handleSaveEdit} variant="default">Save</Button>
                    <Button onClick={handleCancelEdit} variant="outline">Cancel</Button>
                  </div>
                ) : (
                  <Button onClick={() => handleStartEdit(strategy)} variant="outline">Edit</Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StrategiesEditor;
