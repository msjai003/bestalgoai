
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader, Plus, Trash, Save, X, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface PricingPlan {
  id: string;
  plan_id: string;
  plan_name: string;
  plan_description: string;
  plan_price: string;
  plan_period: string;
  is_popular: boolean;
  features: string[];
  sort_order: number;
  is_active: boolean;
}

const PricingAdmin = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingPlanId, setSavingPlanId] = useState<string | null>(null);
  const [editingFeature, setEditingFeature] = useState<{planId: string, index: number} | null>(null);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [addingFeatureToPlanId, setAddingFeatureToPlanId] = useState<string | null>(null);
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    fetchPricingPlans();
  }, []);

  const fetchPricingPlans = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('pricing_adminpanel')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        throw error;
      }

      // Transform the data to ensure features is always a string array
      const transformedData = data?.map(plan => {
        let features: string[] = [];
        
        // Handle different possible formats of the features field
        if (Array.isArray(plan.features)) {
          // Convert each item in the array to string
          features = plan.features.map(item => String(item));
        } else if (typeof plan.features === 'string') {
          try {
            const parsed = JSON.parse(plan.features);
            features = Array.isArray(parsed) ? parsed.map(item => String(item)) : [String(plan.features)];
          } catch {
            features = [String(plan.features)];
          }
        } else if (plan.features) {
          features = [String(plan.features)];
        }
        
        return {
          ...plan,
          features
        } as PricingPlan;
      }) || [];

      setPlans(transformedData);
    } catch (err) {
      console.error('Error fetching pricing plans:', err);
      toast({
        title: 'Error',
        description: 'Failed to load pricing plans',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanChange = (planId: string, field: keyof PricingPlan, value: any) => {
    setPlans(currentPlans =>
      currentPlans.map(plan =>
        plan.id === planId ? { ...plan, [field]: value } : plan
      )
    );
  };

  const handleFeatureChange = (planId: string, index: number, value: string) => {
    setPlans(currentPlans =>
      currentPlans.map(plan => {
        if (plan.id === planId) {
          const updatedFeatures = [...plan.features];
          updatedFeatures[index] = value;
          return { ...plan, features: updatedFeatures };
        }
        return plan;
      })
    );
  };

  const addFeature = (planId: string) => {
    if (!newFeature.trim()) return;

    setPlans(currentPlans =>
      currentPlans.map(plan => {
        if (plan.id === planId) {
          return { ...plan, features: [...plan.features, newFeature] };
        }
        return plan;
      })
    );
    
    setNewFeature('');
    setAddingFeatureToPlanId(null);
  };

  const removeFeature = (planId: string, index: number) => {
    setPlans(currentPlans =>
      currentPlans.map(plan => {
        if (plan.id === planId) {
          const updatedFeatures = [...plan.features];
          updatedFeatures.splice(index, 1);
          return { ...plan, features: updatedFeatures };
        }
        return plan;
      })
    );
  };

  const savePlan = async (planId: string) => {
    try {
      setSavingPlanId(planId);
      const planToUpdate = plans.find(p => p.id === planId);
      
      if (!planToUpdate) return;

      const { error } = await supabase
        .from('pricing_adminpanel')
        .update({
          plan_name: planToUpdate.plan_name,
          plan_description: planToUpdate.plan_description,
          plan_price: planToUpdate.plan_price,
          plan_period: planToUpdate.plan_period,
          is_popular: planToUpdate.is_popular,
          features: planToUpdate.features,
          sort_order: planToUpdate.sort_order,
          is_active: planToUpdate.is_active
        })
        .eq('id', planId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Plan updated successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error updating plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to update plan',
        variant: 'destructive',
      });
    } finally {
      setSavingPlanId(null);
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-900 text-white p-6 rounded-lg">
        <p>Please login to access the pricing admin panel.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-900 text-white">
        <Loader className="h-8 w-8 animate-spin text-[#FF00D4]" />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#FF00D4] to-purple-600 bg-clip-text text-transparent">
        Pricing Plan Administration
      </h1>
      
      <div className="space-y-8">
        {plans.map(plan => (
          <div key={plan.id} className="border border-gray-700 rounded-lg p-6 bg-gray-800/50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{plan.plan_name}</h2>
              <div className="flex space-x-2 items-center">
                <Label htmlFor={`active-${plan.id}`} className="text-sm mr-2">Active</Label>
                <Switch
                  id={`active-${plan.id}`}
                  checked={plan.is_active}
                  onCheckedChange={(checked) => handlePlanChange(plan.id, 'is_active', checked)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor={`name-${plan.id}`} className="text-sm">Plan Name</Label>
                <Input
                  id={`name-${plan.id}`}
                  value={plan.plan_name}
                  onChange={(e) => handlePlanChange(plan.id, 'plan_name', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor={`id-${plan.id}`} className="text-sm">Plan ID</Label>
                <Input
                  id={`id-${plan.id}`}
                  value={plan.plan_id}
                  onChange={(e) => handlePlanChange(plan.id, 'plan_id', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor={`price-${plan.id}`} className="text-sm">Price</Label>
                <Input
                  id={`price-${plan.id}`}
                  value={plan.plan_price}
                  onChange={(e) => handlePlanChange(plan.id, 'plan_price', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor={`period-${plan.id}`} className="text-sm">Period</Label>
                <Input
                  id={`period-${plan.id}`}
                  value={plan.plan_period}
                  onChange={(e) => handlePlanChange(plan.id, 'plan_period', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor={`order-${plan.id}`} className="text-sm">Sort Order</Label>
                <Input
                  id={`order-${plan.id}`}
                  type="number"
                  value={plan.sort_order}
                  onChange={(e) => handlePlanChange(plan.id, 'sort_order', parseInt(e.target.value))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="flex items-center space-x-2 mt-6">
                <Label htmlFor={`popular-${plan.id}`} className="text-sm mr-2">Popular</Label>
                <Switch
                  id={`popular-${plan.id}`}
                  checked={plan.is_popular}
                  onCheckedChange={(checked) => handlePlanChange(plan.id, 'is_popular', checked)}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <Label htmlFor={`description-${plan.id}`} className="text-sm">Description</Label>
              <Textarea
                id={`description-${plan.id}`}
                value={plan.plan_description}
                onChange={(e) => handlePlanChange(plan.id, 'plan_description', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                rows={2}
              />
            </div>
            
            <div className="mb-4">
              <Label className="text-sm mb-2 block">Features</Label>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    {editingFeature && editingFeature.planId === plan.id && editingFeature.index === index ? (
                      <div className="flex w-full items-center space-x-2">
                        <Input
                          value={newFeatureText}
                          onChange={(e) => setNewFeatureText(e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white flex-1"
                          autoFocus
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            handleFeatureChange(plan.id, index, newFeatureText);
                            setEditingFeature(null);
                          }}
                        >
                          <Check className="h-4 w-4 text-green-400" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setEditingFeature(null)}
                        >
                          <X className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span 
                          className="flex-1 cursor-pointer hover:text-[#FF00D4]"
                          onClick={() => {
                            setEditingFeature({ planId: plan.id, index });
                            setNewFeatureText(feature);
                          }}
                        >
                          {feature}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeFeature(plan.id, index)}
                          className="text-red-400"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
              
              {addingFeatureToPlanId === plan.id ? (
                <div className="mt-2 flex items-center space-x-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Enter new feature"
                    className="bg-gray-700 border-gray-600 text-white"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addFeature(plan.id);
                      }
                    }}
                    autoFocus
                  />
                  <Button
                    onClick={() => addFeature(plan.id)}
                    className="bg-[#FF00D4] hover:bg-[#FF00D4]/80"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setAddingFeatureToPlanId(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 border-dashed border-gray-600 text-gray-400"
                  onClick={() => setAddingFeatureToPlanId(plan.id)}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Feature
                </Button>
              )}
            </div>
            
            <Button
              onClick={() => savePlan(plan.id)}
              className="bg-[#FF00D4] hover:bg-[#FF00D4]/80 w-full"
              disabled={savingPlanId === plan.id}
            >
              {savingPlanId === plan.id ? (
                <>
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingAdmin;
