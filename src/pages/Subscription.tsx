import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePriceAdmin } from "@/hooks/usePriceAdmin";

const fallbackPlans = [
  {
    name: "Basic",
    price: "₹1",
    period: "/mo",
    features: [
      "5 Trading Strategies",
      "Basic Analytics",
      "Email Support"
    ],
    isPopular: false
  },
  {
    name: "Pro",
    price: "₹1",
    period: "/mo",
    features: [
      "20 Trading Strategies",
      "Advanced Analytics",
      "Priority Support",
      "Custom Strategy Builder"
    ],
    isPopular: true
  },
  {
    name: "Premium",
    price: "₹1",
    period: "/mo",
    features: [
      "Unlimited Strategies",
      "Advanced Analytics",
      "24/7 Priority Support",
      "Custom Indicators",
      "API Access",
      "Dedicated Account Manager"
    ],
    isPopular: false
  }
];

interface PlanDetails {
  id: string;
  plan_name: string;
  plan_price: string;
  selected_at: string;
}

const Subscription = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [userPlan, setUserPlan] = useState<PlanDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { plans: dbPlans, isLoading: plansLoading, error: plansError } = usePriceAdmin();
  
  const plans = dbPlans.length > 0 
    ? dbPlans.map(plan => ({
        name: plan.plan_name,
        price: plan.plan_price,
        period: plan.plan_period.replace('per', '/'),
        features: plan.features as string[],
        isPopular: plan.is_popular
      }))
    : fallbackPlans;
  
  useEffect(() => {
    const fetchUserPlan = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('plan_details')
          .select('*')
          .eq('user_id', user.id)
          .order('selected_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching plan details:', error);
          toast({
            title: "Error",
            description: "Failed to load your subscription details.",
            variant: "destructive",
          });
        } else if (data) {
          setUserPlan(data as PlanDetails);
        }
      } catch (error) {
        console.error('Error in fetching plan:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserPlan();
  }, [user, toast]);

  const handlePlanSelect = async (planName: string, planPrice: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to select a plan",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    try {
      const { error } = await supabase
        .from('plan_details')
        .insert({
          user_id: user.id,
          plan_name: planName,
          plan_price: planPrice,
        });

      if (error) {
        console.error('Error saving plan selection:', error);
        toast({
          title: "Error",
          description: "Failed to save your plan selection. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: `You've selected the ${planName} plan!`,
          variant: "default",
        });
        
        window.location.reload();
      }
    } catch (error) {
      console.error('Error in plan selection:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatExpirationDate = () => {
    if (!userPlan) return "";
    
    const selectedDate = new Date(userPlan.selected_at);
    const expirationDate = new Date(selectedDate);
    expirationDate.setDate(expirationDate.getDate() + 30);
    
    return expirationDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-appBg min-h-screen text-textPrimary">
      <header className="fixed top-0 left-0 right-0 bg-appBg/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Button
            onClick={() => navigate('/dashboard')}
            className="p-2"
          >
            <i className="fa-solid fa-arrow-left text-textSecondary"></i>
          </Button>
          <h1 className="text-lg font-semibold">Subscription & Billing</h1>
          <button className="p-2">
            <i className="fa-solid fa-gear text-textSecondary"></i>
          </button>
        </div>
      </header>

      <main className="pt-20 px-4 pb-24">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader className="h-8 w-8 animate-spin text-accentPink" />
          </div>
        ) : userPlan ? (
          <section className="mb-8">
            <div className="bg-gradient-to-br from-accentPink/10 to-accentPurple/10 rounded-2xl p-5 border border-accentPink/20 shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-accentPink font-bold text-lg">{userPlan.plan_name} Plan</h2>
                  <p className="text-textSecondary text-xs">Valid until {formatExpirationDate()}</p>
                </div>
                <span className="bg-accentPink/20 text-accentPink px-2 py-1 rounded-full text-xs">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xl font-bold">{userPlan.plan_price}<span className="text-xs text-textSecondary">/month</span></p>
                <Button 
                  className="bg-accentPink text-textPrimary shadow-lg shadow-accentPink/20 hover:bg-accentPink/90"
                  onClick={() => navigate('/pricing')}
                  size="sm"
                >
                  Upgrade Plan
                </Button>
              </div>
            </div>
          </section>
        ) : (
          <section className="mb-8">
            <div className="bg-surfaceBg rounded-2xl p-5 border border-gray-700 shadow-lg">
              <p className="text-center text-textSecondary mb-4 text-sm">You don't have an active subscription plan.</p>
              <Button 
                className="w-full bg-accentPink text-textPrimary shadow-lg shadow-accentPink/20 hover:bg-accentPink/90"
                onClick={() => navigate('/pricing')}
                size="sm"
              >
                Choose a Plan
              </Button>
            </div>
          </section>
        )}

        {plansLoading ? (
          <div className="flex justify-center py-8">
            <Loader className="h-6 w-6 animate-spin text-accentPink" />
          </div>
        ) : plansError ? (
          <div className="bg-danger/20 border border-danger rounded-xl p-4 mb-8">
            <p className="text-center text-textPrimary">
              {plansError}. Using default pricing.
            </p>
          </div>
        ) : (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Available Plans</h2>
            <div className="space-y-3">
              {plans.map((plan) => (
                <div 
                  key={plan.name}
                  className={cn(
                    "rounded-xl p-4 border",
                    plan.isPopular 
                      ? "bg-gradient-to-br from-accentPink/5 to-accentPurple/10 border-accentPink/20" 
                      : "bg-surfaceBg border-gray-700"
                  )}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className={cn(
                      "font-bold text-sm",
                      plan.isPopular ? "text-accentPink" : ""
                    )}>{plan.name}</h3>
                    <p className="text-base font-bold">
                      {plan.price}<span className="text-xs text-textSecondary">{plan.period}</span>
                    </p>
                  </div>
                  <ul className="text-xs text-textSecondary space-y-1 mb-3">
                    {plan.features.map((feature, index) => (
                      <li key={index}>
                        <i className={cn(
                          "fa-solid fa-check mr-2",
                          plan.isPopular ? "text-accentPink" : "text-success"
                        )}></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={cn(
                      "w-full",
                      plan.isPopular 
                        ? "bg-accentPink text-textPrimary shadow-lg shadow-accentPink/20 hover:bg-accentPink/90" 
                        : "border border-accentPink text-accentPink bg-transparent hover:bg-accentPink/10"
                    )}
                    onClick={() => handlePlanSelect(plan.name, plan.price)}
                    size="sm"
                  >
                    Select Plan
                  </Button>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-lg font-semibold mb-3">Payment Methods</h2>
          <div className="bg-surfaceBg rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <i className="fa-regular fa-credit-card text-textSecondary mr-3"></i>
                <div>
                  <p className="font-medium text-sm">•••• 4242</p>
                  <p className="text-xs text-textSecondary">Expires 08/25</p>
                </div>
              </div>
              <span className="bg-success/20 text-success px-2 py-1 rounded-full text-xs">Default</span>
            </div>
            <Button 
              variant="outline"
              className="w-full border-gray-700 text-textSecondary hover:bg-surfaceBg/80"
              size="sm"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              Add Payment Method
            </Button>
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
};

export default Subscription;
