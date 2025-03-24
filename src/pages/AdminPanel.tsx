
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BottomNav } from '@/components/BottomNav';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, 
  RefreshCw, 
  Settings, 
  CreditCard, 
  PaintBucket, 
  Flag
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import ProtectedRoute from '@/components/ProtectedRoute';

interface AdminPanelItem {
  id: string;
  feature_name: string;
  feature_value: any;
  is_enabled: boolean;
  description: string;
  created_at: string;
  updated_at: string;
}

const AdminPanel = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPanelItems, setAdminPanelItems] = useState<AdminPanelItem[]>([]);
  const [activeTab, setActiveTab] = useState('razorpay');
  const { toast } = useToast();
  
  const fetchAdminPanelItems = async () => {
    setLoading(true);
    try {
      // First check if user is admin
      const { data: adminStatus, error: adminError } = await supabase.rpc('is_admin');
      
      if (adminError) {
        console.error('Error checking admin status:', adminError);
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      
      setIsAdmin(adminStatus);
      
      if (!adminStatus) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      // Fetch admin panel items
      const { data, error } = await supabase
        .from('admin_panel')
        .select('*')
        .order('feature_name');
        
      if (error) {
        console.error('Error fetching admin panel items:', error);
        toast({
          title: "Error",
          description: "Failed to load admin panel data.",
          variant: "destructive",
        });
      } else {
        setAdminPanelItems(data || []);
      }
    } catch (error) {
      console.error('Error in admin panel:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchAdminPanelItems();
    }
  }, [user]);
  
  const updateFeatureValue = async (featureName: string, newValue: any) => {
    try {
      const { error } = await supabase
        .from('admin_panel')
        .update({ feature_value: newValue })
        .eq('feature_name', featureName);
        
      if (error) {
        console.error(`Error updating ${featureName}:`, error);
        toast({
          title: "Update Failed",
          description: `Could not update ${featureName}. ${error.message}`,
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Updated Successfully",
        description: `${featureName} configuration has been updated.`,
      });
      
      // Update local state
      setAdminPanelItems(prev => 
        prev.map(item => 
          item.feature_name === featureName 
            ? { ...item, feature_value: newValue } 
            : item
        )
      );
      
      return true;
    } catch (error) {
      console.error(`Error updating ${featureName}:`, error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const findItemByName = (name: string) => {
    return adminPanelItems.find(item => item.feature_name === name);
  };
  
  // Razorpay Config Management
  const RazorpayConfig = () => {
    const config = findItemByName('razorpay_config');
    const [formValues, setFormValues] = useState({
      test_key: config?.feature_value?.test_key || '',
      test_secret: config?.feature_value?.test_secret || '',
      live_key: config?.feature_value?.live_key || '',
      live_secret: '',
      mode: config?.feature_value?.mode || 'test'
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormValues(prev => ({ ...prev, [name]: value }));
    };
    
    const handleModeChange = (value: string) => {
      setFormValues(prev => ({ ...prev, mode: value }));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      // Don't include live_secret if empty (to preserve existing value)
      const updatedConfig = {
        test_key: formValues.test_key,
        test_secret: formValues.test_secret,
        live_key: formValues.live_key,
        mode: formValues.mode as 'test' | 'live'
      };
      
      await updateFeatureValue('razorpay_config', updatedConfig);
    };
    
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mode">Payment Mode</Label>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="test-mode"
                  name="mode"
                  checked={formValues.mode === 'test'}
                  onChange={() => handleModeChange('test')}
                  className="h-4 w-4"
                />
                <Label htmlFor="test-mode">Test Mode</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="live-mode"
                  name="mode"
                  checked={formValues.mode === 'live'}
                  onChange={() => handleModeChange('live')}
                  className="h-4 w-4"
                />
                <Label htmlFor="live-mode">Live Mode</Label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Test Credentials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="test_key">Test API Key</Label>
              <Input
                id="test_key"
                name="test_key"
                value={formValues.test_key}
                onChange={handleChange}
                placeholder="rzp_test_..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="test_secret">Test Secret Key</Label>
              <Input
                id="test_secret"
                name="test_secret"
                type="password"
                value={formValues.test_secret}
                onChange={handleChange}
                placeholder="Enter test secret key"
              />
            </div>
          </div>
          
          <h3 className="text-lg font-medium">Live Credentials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="live_key">Live API Key</Label>
              <Input
                id="live_key"
                name="live_key"
                value={formValues.live_key}
                onChange={handleChange}
                placeholder="rzp_live_..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="live_secret">Live Secret Key</Label>
              <Input
                id="live_secret"
                name="live_secret"
                type="password"
                value={formValues.live_secret}
                onChange={handleChange}
                placeholder="Leave blank to keep existing"
              />
              <p className="text-xs text-gray-500">Leave blank to keep existing secret key</p>
            </div>
          </div>
        </div>
        
        <Button type="submit" className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Razorpay Configuration
        </Button>
      </form>
    );
  };
  
  // Theme Configuration
  const ThemeConfig = () => {
    const config = findItemByName('app_theme');
    const [formValues, setFormValues] = useState({
      primary_color: config?.feature_value?.primary_color || '#FF00D4',
      secondary_color: config?.feature_value?.secondary_color || '#3B82F6',
      dark_mode: config?.feature_value?.dark_mode || true
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormValues(prev => ({ ...prev, [name]: value }));
    };
    
    const handleToggle = (checked: boolean) => {
      setFormValues(prev => ({ ...prev, dark_mode: checked }));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await updateFeatureValue('app_theme', formValues);
    };
    
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primary_color">Primary Color</Label>
            <div className="flex gap-2">
              <Input
                id="primary_color"
                name="primary_color"
                type="color"
                value={formValues.primary_color}
                onChange={handleChange}
                className="w-16 h-10"
              />
              <Input
                value={formValues.primary_color}
                onChange={handleChange}
                name="primary_color"
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="secondary_color">Secondary Color</Label>
            <div className="flex gap-2">
              <Input
                id="secondary_color"
                name="secondary_color"
                type="color"
                value={formValues.secondary_color}
                onChange={handleChange}
                className="w-16 h-10"
              />
              <Input
                value={formValues.secondary_color}
                onChange={handleChange}
                name="secondary_color"
                className="flex-1"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="dark_mode"
            checked={formValues.dark_mode}
            onCheckedChange={handleToggle}
          />
          <Label htmlFor="dark_mode">Enable Dark Mode by Default</Label>
        </div>
        
        <Button type="submit" className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Theme Configuration
        </Button>
      </form>
    );
  };
  
  // Feature Flags
  const FeatureFlags = () => {
    const config = findItemByName('feature_flags');
    const [flags, setFlags] = useState({
      premium_strategies: config?.feature_value?.premium_strategies || true,
      live_trading: config?.feature_value?.live_trading || true,
      broker_integration: config?.feature_value?.broker_integration || true
    });
    
    const handleToggle = (flag: string, checked: boolean) => {
      setFlags(prev => ({ ...prev, [flag]: checked }));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await updateFeatureValue('feature_flags', flags);
    };
    
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-800/30">
            <div>
              <h3 className="font-medium">Premium Strategies</h3>
              <p className="text-sm text-gray-400">Enable premium strategy features</p>
            </div>
            <Switch
              checked={flags.premium_strategies}
              onCheckedChange={(checked) => handleToggle('premium_strategies', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-800/30">
            <div>
              <h3 className="font-medium">Live Trading</h3>
              <p className="text-sm text-gray-400">Enable live trading functionality</p>
            </div>
            <Switch
              checked={flags.live_trading}
              onCheckedChange={(checked) => handleToggle('live_trading', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-800/30">
            <div>
              <h3 className="font-medium">Broker Integration</h3>
              <p className="text-sm text-gray-400">Enable broker integration features</p>
            </div>
            <Switch
              checked={flags.broker_integration}
              onCheckedChange={(checked) => handleToggle('broker_integration', checked)}
            />
          </div>
        </div>
        
        <Button type="submit" className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Feature Flags
        </Button>
      </form>
    );
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <RefreshCw className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-400 mb-4">You don't have permission to access this page.</p>
      </div>
    );
  }
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 z-50">
          <div className="flex items-center justify-between px-4 h-16">
            <h1 className="text-lg font-semibold">Admin Panel</h1>
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchAdminPanelItems}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh
            </Button>
          </div>
        </header>

        <main className="pt-20 px-4 pb-24">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">App Configuration</h2>
            <p className="text-gray-400">
              Manage all application settings and configurations from one place.
              Changes made here will reflect throughout the application.
            </p>
          </div>
          
          <Tabs defaultValue="razorpay" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="razorpay" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Razorpay</span>
              </TabsTrigger>
              <TabsTrigger value="theme" className="flex items-center gap-2">
                <PaintBucket className="h-4 w-4" />
                <span className="hidden sm:inline">Theme</span>
              </TabsTrigger>
              <TabsTrigger value="features" className="flex items-center gap-2">
                <Flag className="h-4 w-4" />
                <span className="hidden sm:inline">Features</span>
              </TabsTrigger>
            </TabsList>
            
            <Card className="border-gray-700 bg-gray-800/50">
              <CardHeader>
                <CardTitle>
                  {activeTab === 'razorpay' && 'Razorpay Configuration'}
                  {activeTab === 'theme' && 'Theme Configuration'}
                  {activeTab === 'features' && 'Feature Flags'}
                </CardTitle>
                <CardDescription>
                  {activeTab === 'razorpay' && 'Manage payment gateway settings'}
                  {activeTab === 'theme' && 'Customize application appearance'}
                  {activeTab === 'features' && 'Toggle app features on/off'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TabsContent value="razorpay"><RazorpayConfig /></TabsContent>
                <TabsContent value="theme"><ThemeConfig /></TabsContent>
                <TabsContent value="features"><FeatureFlags /></TabsContent>
              </CardContent>
            </Card>
          </Tabs>
          
          <div className="mt-8 p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg border border-pink-700/50">
            <div className="flex items-start">
              <Settings className="text-pink-400 mt-1 mr-3 h-5 w-5" />
              <div>
                <h3 className="font-bold text-white">ADMIN PANEL INFORMATION</h3>
                <p className="text-sm text-gray-300 mt-1">
                  This admin panel allows you to manage all app configurations centrally. 
                  Changes made here are stored in the <code>admin_panel</code> table and will
                  automatically reflect in the application without requiring code changes.
                </p>
              </div>
            </div>
          </div>
        </main>
        
        <BottomNav />
      </div>
    </ProtectedRoute>
  );
};

export default AdminPanel;
