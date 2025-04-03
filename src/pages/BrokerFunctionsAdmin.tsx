
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Pencil, Save, Trash, RefreshCw, PlusCircle, XCircle, Download } from 'lucide-react';
import { useForm } from 'react-hook-form';
import ProtectedRoute from '@/components/ProtectedRoute';
import { BrokerFunction } from '@/hooks/strategy/types';
import { Broker } from '@/types/broker';
import { brokers } from '@/components/broker-integration/BrokerData';

interface FormValues {
  broker_id: number;
  broker_name: string;
  function_name: string;
  function_description: string;
  function_slug: string;
  function_enabled: boolean;
  is_premium: boolean;
}

const BrokerFunctionsAdmin = () => {
  const { user } = useAuth();
  const [functions, setFunctions] = useState<BrokerFunction[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<BrokerFunction>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedBrokerId, setSelectedBrokerId] = useState<number | null>(null);
  
  const form = useForm<FormValues>({
    defaultValues: {
      broker_id: 0,
      broker_name: '',
      function_name: '',
      function_description: '',
      function_slug: '',
      function_enabled: true,
      is_premium: false
    }
  });

  // Fetch broker functions
  const fetchBrokerFunctions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('brokers_functions')
        .select('*')
        .order('broker_name')
        .order('function_name');
        
      if (selectedBrokerId) {
        query = query.eq('broker_id', selectedBrokerId);
      }
        
      const { data, error } = await query;

      if (error) throw error;
      setFunctions(data || []);
    } catch (error: any) {
      toast.error(`Error fetching broker functions: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBrokerFunctions();
    }
  }, [user, selectedBrokerId]);

  // Start editing a function
  const handleEdit = (func: BrokerFunction) => {
    setEditingId(func.id);
    setEditForm({
      broker_id: func.broker_id,
      broker_name: func.broker_name,
      function_name: func.function_name,
      function_description: func.function_description,
      function_slug: func.function_slug,
      function_enabled: func.function_enabled,
      is_premium: func.is_premium
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // Save function changes
  const handleSave = async (id: string) => {
    if (!editForm.function_name || !editForm.function_slug) {
      toast.error('Function name and slug cannot be empty');
      return;
    }

    try {
      const { error } = await supabase
        .from('brokers_functions')
        .update({
          broker_id: editForm.broker_id,
          broker_name: editForm.broker_name,
          function_name: editForm.function_name,
          function_description: editForm.function_description,
          function_slug: editForm.function_slug,
          function_enabled: editForm.function_enabled,
          is_premium: editForm.is_premium
        })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setFunctions(prevFunctions => 
        prevFunctions.map(func => 
          func.id === id ? { ...func, ...editForm } as BrokerFunction : func
        )
      );
      
      toast.success('Function updated successfully');
      setEditingId(null);
    } catch (error: any) {
      toast.error(`Failed to update function: ${error.message}`);
    }
  };

  // Delete a function
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this function? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('brokers_functions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setFunctions(prevFunctions => 
        prevFunctions.filter(func => func.id !== id)
      );
      
      toast.success('Function deleted successfully');
    } catch (error: any) {
      toast.error(`Failed to delete function: ${error.message}`);
    }
  };

  // Add new function
  const handleAddFunction = async (values: FormValues) => {
    try {
      // Find the broker name from the id
      const broker = brokers.find(b => b.id === values.broker_id);
      if (!broker) {
        toast.error('Invalid broker selected');
        return;
      }

      const { data, error } = await supabase
        .from('brokers_functions')
        .insert({
          broker_id: values.broker_id,
          broker_name: broker.name,
          function_name: values.function_name,
          function_description: values.function_description || null,
          function_slug: values.function_slug,
          function_enabled: values.function_enabled,
          is_premium: values.is_premium
        })
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        // Update local state
        setFunctions(prevFunctions => [...prevFunctions, data[0] as BrokerFunction]);
        toast.success('Function added successfully');
        setShowAddForm(false);
        form.reset({
          broker_id: 0,
          broker_name: '',
          function_name: '',
          function_description: '',
          function_slug: '',
          function_enabled: true,
          is_premium: false
        });
      }
    } catch (error: any) {
      toast.error(`Failed to add function: ${error.message}`);
    }
  };

  // Seed default functions for new brokers (5 Paisa and Bigil)
  const seedDefaultFunctions = async () => {
    try {
      setLoading(true);
      
      // Define default functions for brokers
      const defaultFunctions = [
        { slug: 'order_placement', name: 'Order Placement', description: 'Place new orders with the broker' },
        { slug: 'order_modification', name: 'Order Modification', description: 'Modify existing orders' },
        { slug: 'order_cancellation', name: 'Order Cancellation', description: 'Cancel pending orders' },
        { slug: 'portfolio_view', name: 'Portfolio View', description: 'View current holdings and positions' },
        { slug: 'market_data', name: 'Market Data', description: 'Access real-time market data' },
        { slug: 'trade_history', name: 'Trade History', description: 'View past trades and executions' }
      ];
      
      // Check which brokers need default functions (specifically 5 Paisa and Bigil)
      const targetBrokers = [
        { id: 7, name: "5 Paisa" },
        { id: 8, name: "Bigil" }
      ];
      
      let addedCount = 0;
      
      for (const broker of targetBrokers) {
        // Check if broker already has functions
        const { data: existingFunctions } = await supabase
          .from('brokers_functions')
          .select('*')
          .eq('broker_id', broker.id);
          
        if (!existingFunctions || existingFunctions.length === 0) {
          // Add default functions for this broker
          const functionsToAdd = defaultFunctions.map(func => ({
            broker_id: broker.id,
            broker_name: broker.name,
            function_name: func.name,
            function_description: func.description,
            function_slug: func.slug,
            function_enabled: true,
            is_premium: func.slug === 'market_data', // Make market data premium as an example
            broker_image: `https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-${broker.id}.jpg`
          }));
          
          const { data, error } = await supabase
            .from('brokers_functions')
            .insert(functionsToAdd)
            .select();
            
          if (error) throw error;
          
          if (data) {
            addedCount += data.length;
            // Update local state with new functions
            setFunctions(prev => [...prev, ...data as BrokerFunction[]]);
          }
        }
      }
      
      if (addedCount > 0) {
        toast.success(`Added ${addedCount} default functions for new brokers`);
      } else {
        toast.info('All brokers already have functions configured');
      }
    } catch (error: any) {
      toast.error(`Failed to seed default functions: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4 max-w-7xl">
        <h1 className="text-2xl font-bold mb-6">Broker Functions Admin</h1>
        
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="w-64">
            <Select 
              value={selectedBrokerId?.toString() || ""} 
              onValueChange={(value) => setSelectedBrokerId(value ? parseInt(value) : null)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by broker" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Brokers</SelectItem>
                {brokers.map(broker => (
                  <SelectItem key={broker.id} value={broker.id.toString()}>
                    {broker.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowAddForm(!showAddForm)} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              {showAddForm ? <XCircle className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
              {showAddForm ? 'Cancel' : 'Add Function'}
            </Button>
            
            <Button 
              onClick={fetchBrokerFunctions} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            
            <Button 
              onClick={seedDefaultFunctions} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Seed Default Functions
            </Button>
          </div>
        </div>
        
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Broker Function</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(handleAddFunction)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="broker_id">Broker</Label>
                    <Select
                      onValueChange={(value) => form.setValue('broker_id', parseInt(value))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select broker" />
                      </SelectTrigger>
                      <SelectContent>
                        {brokers.map(broker => (
                          <SelectItem key={broker.id} value={broker.id.toString()}>
                            {broker.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="function_name">Function Name</Label>
                    <Input
                      id="function_name"
                      {...form.register('function_name')}
                      placeholder="Enter function name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="function_slug">Function Slug</Label>
                    <Input
                      id="function_slug"
                      {...form.register('function_slug')}
                      placeholder="e.g. live_trading"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="function_description">Description</Label>
                    <Textarea
                      id="function_description"
                      {...form.register('function_description')}
                      placeholder="Enter function description"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="function_enabled" 
                        checked={form.watch('function_enabled')}
                        onCheckedChange={(checked) => form.setValue('function_enabled', checked)}
                      />
                      <Label htmlFor="function_enabled">Enabled</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="is_premium" 
                        checked={form.watch('is_premium')}
                        onCheckedChange={(checked) => form.setValue('is_premium', checked)}
                      />
                      <Label htmlFor="is_premium">Premium</Label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Function
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
        
        {loading ? (
          <div className="flex justify-center p-8">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : functions.length === 0 ? (
          <div className="text-center p-8 border rounded-lg bg-background">
            <p>No broker functions found</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Broker</TableHead>
                  <TableHead>Function Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Premium</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {functions.map((func) => (
                  <TableRow key={func.id}>
                    <TableCell>
                      {editingId === func.id ? (
                        <Select
                          value={editForm.broker_id?.toString()}
                          onValueChange={(value) => {
                            const brokerId = parseInt(value);
                            const broker = brokers.find(b => b.id === brokerId);
                            setEditForm({
                              ...editForm,
                              broker_id: brokerId,
                              broker_name: broker?.name || ''
                            });
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select broker" />
                          </SelectTrigger>
                          <SelectContent>
                            {brokers.map(broker => (
                              <SelectItem key={broker.id} value={broker.id.toString()}>
                                {broker.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        func.broker_name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === func.id ? (
                        <Input
                          value={editForm.function_name || ''}
                          onChange={(e) => setEditForm({...editForm, function_name: e.target.value})}
                          className="w-full"
                          required
                        />
                      ) : (
                        func.function_name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === func.id ? (
                        <Input
                          value={editForm.function_slug || ''}
                          onChange={(e) => setEditForm({...editForm, function_slug: e.target.value})}
                          className="w-full"
                          required
                        />
                      ) : (
                        func.function_slug
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === func.id ? (
                        <Textarea
                          value={editForm.function_description || ''}
                          onChange={(e) => setEditForm({...editForm, function_description: e.target.value})}
                          className="w-full"
                        />
                      ) : (
                        func.function_description || '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === func.id ? (
                        <Switch 
                          checked={!!editForm.function_enabled}
                          onCheckedChange={(checked) => setEditForm({...editForm, function_enabled: checked})}
                        />
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs ${func.function_enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {func.function_enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === func.id ? (
                        <Switch 
                          checked={!!editForm.is_premium}
                          onCheckedChange={(checked) => setEditForm({...editForm, is_premium: checked})}
                        />
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs ${func.is_premium ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'}`}>
                          {func.is_premium ? 'Premium' : 'Standard'}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingId === func.id ? (
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
                            onClick={() => handleSave(func.id)}
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
                            onClick={() => handleEdit(func)}
                            className="flex items-center gap-1"
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(func.id)}
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
            <li>This panel allows you to manage broker functions in the database.</li>
            <li>Functions define what capabilities are available for each broker.</li>
            <li>Premium functions will be displayed with a special badge.</li>
            <li>You can enable or disable functions as needed.</li>
            <li>Use the "Seed Default Functions" button to add standard functions to new brokers.</li>
          </ul>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default BrokerFunctionsAdmin;
