
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader } from 'lucide-react';
import PaymentDialog from '@/components/subscription/PaymentDialog';
import { usePredefinedStrategies } from '@/hooks/strategy/usePredefinedStrategies';
import { usePriceAdmin } from '@/hooks/usePriceAdmin';

const fallbackPlans = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for beginners',
    price: '₹1',
    period: 'per month',
    features: [
      '5 Pre-built Strategies',
      'Real-time Market Data',
      'Basic Risk Management'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For serious traders',
    price: '₹1',
    period: 'per month',
    popular: true,
    features: [
      '20 Pre-built Strategies',
      'Custom Strategy Builder',
      'Advanced Risk Management',
      'Priority Support'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'For professional traders',
    price: '₹1',
    period: 'per month',
    features: [
      'All Pro Features',
      'Unlimited Strategies',
      'Advanced Analytics',
      'Dedicated Account Manager',
      'API Access',
      '20 Pre-built Strategies',
      'Custom Strategy Builder',
      'Advanced Risk Management',
      'Priority Support'
    ]
  }
];

const PricingPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{name: string, price: string} | null>(null);
  const [hasPremium, setHasPremium] = useState(false);
  const [selectedStrategyId, setSelectedStrategyId] = useState<string | null>(null);
  const { data: predefinedStrategies } = usePredefinedStrategies();
  const [selectedStrategyName, setSelectedStrategyName] = useState<string | null>(null);
  
  const { plans: dbPlans, isLoading: plansLoading, error: plansError } = usePriceAdmin();
  
  const plans = dbPlans.length > 0 
    ? dbPlans.map(plan => {
        if (plan.plan_name === 'Premium') {
          const proPlan = dbPlans.find(p => p.plan_name === 'Pro');
          if (proPlan) {
            const proFeatures = proPlan.features.map(f => String(f)) || [];
            const premiumFeatures = plan.features.map(f => String(f)) || [];
            
            const combinedFeatures = [...new Set([
              ...premiumFeatures, 
              ...proFeatures.filter(f => !premiumFeatures.includes(f))
            ])];
            
            return {
              id: plan.plan_id,
              name: plan.plan_name,
              description: plan.plan_description,
              price: plan.plan_price,
              period: plan.plan_period,
              popular: plan.is_popular,
              features: combinedFeatures
            };
          }
        }
        
        return {
          id: plan.plan_id,
          name: plan.plan_name,
          description: plan.plan_description,
          price: plan.plan_price,
          period: plan.plan_period,
          popular: plan.is_popular,
          features: plan.features.map(f => String(f))
        };
      })
    : fallbackPlans;

  useEffect(() => {
    const strategyId = sessionStorage.getItem('selectedStrategyId');
    if (strategyId) {
      setSelectedStrategyId(strategyId);
      sessionStorage.removeItem('selectedStrategyId');
    }
  }, []);

  useEffect(() => {
    if (selectedStrategyId && predefinedStrategies) {
      const strategy = predefinedStrategies.find(
        s => s.id === parseInt(selectedStrategyId, 10)
      );
      if (strategy) {
        setSelectedStrategyName(strategy.name);
      }
    }
  }, [selectedStrategyId, predefinedStrategies]);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('plan_details')
          .select('*')
          .eq('user_id', user.id)
          .order('selected_at', { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (data && (data.plan_name === 'Pro' || data.plan_name === 'Premium')) {
          setHasPremium(true);
        }
      } catch (error) {
        console.error('Error checking premium status:', error);
      }
    };
    
    checkPremiumStatus();
  }, [user]);

  const handlePlanSelection = (planName: string, planPrice: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to select a plan",
        variant: "destructive",
      });
      sessionStorage.setItem('selectedPlan', JSON.stringify({ name: planName, price: planPrice }));
      navigate('/auth');
      return;
    }
    
    if (hasPremium) {
      toast({
        title: "Already subscribed",
        description: "You already have an active premium subscription.",
        variant: "default",
      });
      navigate('/subscription');
      return;
    }

    setSelectedPlan({ name: planName, price: planPrice });
    setPaymentDialogOpen(true);
  };

  const handlePaymentSuccess = () => {
    setPaymentDialogOpen(false);
    
    if (selectedStrategyName) {
      toast({
        title: "Strategy Unlocked!",
        description: `You now have access to ${selectedStrategyName} and all premium strategies.`,
        variant: "default",
      });
      
      if (selectedStrategyId) {
        navigate(`/strategy-details/${selectedStrategyId}`);
        return;
      }
    }
    
    navigate('/subscription');
  };

  return (
    <div className="min-h-screen bg-appBg text-textPrimary pb-16">
      <Header />
      <main className="pt-24 px-4">
        {selectedStrategyName && (
          <section className="mb-6">
            <div className="bg-gradient-to-r from-accentPink/20 to-accentPurple/20 rounded-xl p-3 border border-accentPink/30">
              <h2 className="text-base font-medium mb-1">Unlock Premium Strategy</h2>
              <p className="text-textSecondary text-sm">
                Subscribe to unlock <span className="text-accentPink font-semibold">{selectedStrategyName}</span> and all other premium strategies.
              </p>
            </div>
          </section>
        )}

        <section className="mb-8">
          <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-accentPink to-accentPurple bg-clip-text text-transparent">
            Choose Your Trading Power
          </h1>
          <p className="text-textSecondary text-sm">
            Unlock advanced algo trading strategies with plans designed for every trader
          </p>
        </section>

        {plansLoading ? (
          <div className="flex justify-center py-8">
            <Loader className="h-8 w-8 animate-spin text-accentPink" />
          </div>
        ) : plansError ? (
          <div className="bg-danger/20 border border-danger rounded-xl p-4 mb-6">
            <p className="text-center text-textPrimary text-sm">
              {plansError}. Using default pricing.
            </p>
          </div>
        ) : (
          <section className="space-y-3 mb-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-surfaceBg rounded-xl p-4 border ${plan.popular ? 'border-accentPink/30' : 'border-gray-700'} shadow-lg overflow-hidden`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-accentPink text-xs px-2 py-0.5 rounded-bl-lg">
                    POPULAR
                  </div>
                )}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-base font-bold">{plan.name}</h3>
                    <p className="text-textSecondary text-xs">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{plan.price}</div>
                    <div className="text-xs text-textSecondary">{plan.period}</div>
                  </div>
                </div>
                <ul className="space-y-1 mb-3 text-xs">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <i className="fa-solid fa-check text-accentPink mr-2 text-xs"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-center">
                  <Button 
                    className={`${plan.popular 
                      ? 'bg-gradient-to-r from-accentPink to-accentPurple' 
                      : 'bg-surfaceBg border border-accentPink/50 hover:bg-accentPink/10'} 
                      text-textPrimary font-semibold shadow-lg hover:opacity-90 transition-opacity px-4`}
                    onClick={() => handlePlanSelection(plan.name, plan.price)}
                    disabled={isLoading === `${plan.name}-${plan.price}` || hasPremium}
                    size="sm"
                  >
                    {isLoading === `${plan.name}-${plan.price}` ? (
                      <>
                        <Loader className="h-3 w-3 animate-spin mr-1" />
                        <span className="text-xs">Processing...</span>
                      </>
                    ) : hasPremium ? 
                      <span className="text-xs">Already Subscribed</span> : 
                      selectedStrategyName ? 
                      <span className="text-xs">Unlock {selectedStrategyName}</span> : 
                      <span className="text-xs">Get Started</span>}
                  </Button>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>
      
      {selectedPlan && (
        <PaymentDialog 
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          planName={selectedPlan.name}
          planPrice={selectedPlan.price}
          onSuccess={handlePaymentSuccess}
          selectedStrategyId={selectedStrategyId ? parseInt(selectedStrategyId, 10) : undefined}
          selectedStrategyName={selectedStrategyName}
        />
      )}
      
      <Footer />
      <BottomNav />
    </div>
  );
};

export default PricingPage;
