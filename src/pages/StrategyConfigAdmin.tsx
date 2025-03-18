
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
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { toast } from 'sonner';
import { Pencil, Save, Trash, RefreshCw, PlusCircle, XCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import ProtectedRoute from '@/components/ProtectedRoute';

interface ConfigOption {
  id: string;
  category: string;
  value: string;
  display_name: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface FormValues {
  category: string;
  value: string;
  display_name: string;
  sort_order: number;
  is_active: boolean;
}

const CATEGORIES = [
  { value: 'instrument', label: 'Instrument' },
  { value: 'underlying', label: 'Underlying' },
  { value: 'segment', label: 'Segment' },
  { value: 'optionType', label: 'Option Type' },
  { value: 'positionType', label: 'Position Type' },
  { value: 'expiryType', label: 'Expiry Type' },
  { value: 'strategyType', label: 'Strategy Type' }
];

const StrategyConfigAdmin = () => {
  const { user } = useAuth();
  const [configOptions, setConfigOptions] = useState<ConfigOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormValues>({
    category: '',
    value: '',
    display_name: '',
    sort_order: 0,
    is_active: true
  });
  const [activeCategory, setActiveCategory] = useState<string>('instrument');
  const [showAddForm, setShowAddForm] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      category: activeCategory,
      value: '',
      display_name: '',
      sort_order: 0,
      is_active: true
    }
  });

  // Fetch config options
  const fetchConfigOptions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('strategy_config_options')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setConfigOptions(data || []);
    } catch (error: any) {
      toast.error(`Error fetching config options: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchConfigOptions();
    }
  }, [user]);

  useEffect(() => {
    // Reset form values when active category changes
    form.reset({
      category: activeCategory,
      value: '',
      display_name: '',
      sort_order: 0,
      is_active: true
    });
  }, [activeCategory, form]);

  // Start editing an option
  const handleEdit = (option: ConfigOption) => {
    setEditingId(option.id);
    setEditForm({
      category: option.category,
      value: option.value,
      display_name: option.display_name,
      sort_order: option.sort_order,
      is_active: option.is_active
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // Save option changes
  const handleSave = async (id: string) => {
    if (!editForm.value.trim() || !editForm.display_name.trim()) {
      toast.error('Value and display name cannot be empty');
      return;
    }

    try {
      const { error } = await supabase
        .from('strategy_config_options')
        .update({
          category: editForm.category,
          value: editForm.value.trim(),
          display_name: editForm.display_name.trim(),
          sort_order: editForm.sort_order,
          is_active: editForm.is_active
        })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setConfigOptions(prevOptions => 
        prevOptions.map(option => 
          option.id === id ? { ...option, ...editForm } : option
        )
      );
      
      toast.success('Option updated successfully');
      setEditingId(null);
    } catch (error: any) {
      toast.error(`Failed to update option: ${error.message}`);
    }
  };

  // Delete an option
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this option? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('strategy_config_options')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setConfigOptions(prevOptions => 
        prevOptions.filter(option => option.id !== id)
      );
      
      toast.success('Option deleted successfully');
    } catch (error: any) {
      toast.error(`Failed to delete option: ${error.message}`);
    }
  };

  // Add new option
  const handleAddOption = async (values: FormValues) => {
    try {
      const { data, error } = await supabase
        .from('strategy_config_options')
        .insert({
          category: values.category,
          value: values.value.trim(),
          display_name: values.display_name.trim(),
          sort_order: values.sort_order,
          is_active: values.is_active
        })
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        // Update local state
        setConfigOptions(prevOptions => [...prevOptions, data[0]]);
        toast.success('Option added successfully');
        setShowAddForm(false);
        form.reset({
          category: activeCategory,
          value: '',
          display_name: '',
          sort_order: 0,
          is_active: true
        });
      }
    } catch (error: any) {
      toast.error(`Failed to add option: ${error.message}`);
    }
  };

  // Handle changing between categories
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setShowAddForm(false);
    setEditingId(null);
  };

  // Filter options by active category
  const filteredOptions = configOptions.filter(option => option.category === activeCategory);

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4 max-w-7xl">
        <h1 className="text-2xl font-bold mb-6">Strategy Configuration Admin</h1>
        
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {CATEGORIES.map(category => (
              <Button 
                key={category.value}
                onClick={() => handleCategoryChange(category.value)}
                variant={activeCategory === category.value ? "default" : "outline"}
                size="sm"
              >
                {category.label}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowAddForm(!showAddForm)} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              {showAddForm ? <XCircle className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
              {showAddForm ? 'Cancel' : 'Add Option'}
            </Button>
            
            <Button 
              onClick={fetchConfigOptions} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
        
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New {CATEGORIES.find(c => c.value === activeCategory)?.label} Option</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(handleAddOption)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="value">Value</Label>
                    <Input
                      id="value"
                      {...form.register('value')}
                      placeholder="Enter internal value"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="display_name">Display Name</Label>
                    <Input
                      id="display_name"
                      {...form.register('display_name')}
                      placeholder="Enter display name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="sort_order">Sort Order</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      {...form.register('sort_order', { valueAsNumber: true })}
                      defaultValue={0}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="is_active" className="flex items-center gap-2">
                      <input
                        id="is_active"
                        type="checkbox"
                        {...form.register('is_active')}
                        defaultChecked={true}
                        className="h-4 w-4"
                      />
                      Active
                    </Label>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Option
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
        ) : filteredOptions.length === 0 ? (
          <div className="text-center p-8 border rounded-lg bg-background">
            <p>No options found for {CATEGORIES.find(c => c.value === activeCategory)?.label}</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Value</TableHead>
                  <TableHead>Display Name</TableHead>
                  <TableHead>Sort Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOptions.map((option) => (
                  <TableRow key={option.id}>
                    <TableCell>
                      {editingId === option.id ? (
                        <Input
                          value={editForm.value}
                          onChange={(e) => setEditForm({...editForm, value: e.target.value})}
                          className="w-full"
                        />
                      ) : (
                        option.value
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === option.id ? (
                        <Input
                          value={editForm.display_name}
                          onChange={(e) => setEditForm({...editForm, display_name: e.target.value})}
                          className="w-full"
                        />
                      ) : (
                        option.display_name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === option.id ? (
                        <Input
                          type="number"
                          value={editForm.sort_order}
                          onChange={(e) => setEditForm({...editForm, sort_order: parseInt(e.target.value)})}
                          className="w-full"
                        />
                      ) : (
                        option.sort_order
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === option.id ? (
                        <Label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={editForm.is_active}
                            onChange={(e) => setEditForm({...editForm, is_active: e.target.checked})}
                            className="mr-2 h-4 w-4"
                          />
                          Active
                        </Label>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs ${option.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {option.is_active ? 'Active' : 'Inactive'}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingId === option.id ? (
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
                            onClick={() => handleSave(option.id)}
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
                            onClick={() => handleEdit(option)}
                            className="flex items-center gap-1"
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(option.id)}
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
            <li>This panel allows you to manage strategy configuration options in the database.</li>
            <li>You can add, edit, and delete options for each category.</li>
            <li>These options will be used in the Strategy Builder for dropdown selections.</li>
            <li>Sort order determines the display order in dropdown menus.</li>
          </ul>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default StrategyConfigAdmin;
