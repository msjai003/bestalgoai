
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

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for beginners',
    price: '₹999',
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
    price: '₹2499',
    period: 'per month',
    popular: true,
    features: [
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

  useEffect(() => {
    // Check if user already has premium
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
          
        if (data && (data.plan_name === 'Pro' || data.plan_name === 'Elite')) {
          setHasPremium(true);
        }
      } catch (error) {
        console.error('Error checking premium status:', error);
      }
    };
    
    checkPremiumStatus();
  }, [user]);

  const handlePlanSelection = (planName: string, planPrice: string) => {
    // Check if user is logged in
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to select a plan",
        variant: "destructive",
      });
      // Save the plan info in sessionStorage to potentially use after login
      sessionStorage.setItem('selectedPlan', JSON.stringify({ name: planName, price: planPrice }));
      navigate('/auth');
      return;
    }
    
    // If user already has premium, show a different message
    if (hasPremium) {
      toast({
        title: "Already subscribed",
        description: "You already have an active premium subscription.",
        variant: "default",
      });
      navigate('/subscription');
      return;
    }

    // Open payment dialog
    setSelectedPlan({ name: planName, price: planPrice });
    setPaymentDialogOpen(true);
  };

  const handlePaymentSuccess = () => {
    setPaymentDialogOpen(false);
    // Redirect to subscription page to show active plan
    navigate('/subscription');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-16">
      <Header />
      <main className="pt-24 px-4">
        <section className="mb-12">
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-[#FF00D4] to-purple-600 bg-clip-text text-transparent">
            Choose Your Trading Power
          </h1>
          <p className="text-gray-400">
            Unlock advanced algo trading strategies with plans designed for every trader
          </p>
        </section>

        <section className="space-y-6 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-gray-800/50 rounded-xl p-6 border border-gray-700 shadow-lg overflow-hidden`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-[#FF00D4] text-xs px-3 py-1 rounded-bl-lg">
                  POPULAR
                </div>
              )}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{plan.price}</div>
                  <div className="text-sm text-gray-400">{plan.period}</div>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <i className="fa-solid fa-check text-[#FF00D4] mr-2"></i>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white font-semibold shadow-lg hover:opacity-90 transition-opacity"
                onClick={() => handlePlanSelection(plan.name, plan.price)}
                disabled={isLoading === `${plan.name}-${plan.price}` || hasPremium}
              >
                {isLoading === `${plan.name}-${plan.price}` ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : hasPremium ? "Already Subscribed" : "Get Started"}
              </Button>
            </div>
          ))}
        </section>
      </main>
      
      {selectedPlan && (
        <PaymentDialog 
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          planName={selectedPlan.name}
          planPrice={selectedPlan.price}
          onSuccess={handlePaymentSuccess}
        />
      )}
      
      <Footer />
      <BottomNav />
    </div>
  );
};

export default PricingPage;
