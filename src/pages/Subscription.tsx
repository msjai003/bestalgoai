import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader, CreditCard, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { saveStrategyConfiguration } from "@/hooks/strategy/useStrategyConfiguration";

const plans = [
  {
    name: "Basic",
    price: "₹999",
    period: "/mo",
    features: [
      "5 Trading Strategies",
      "Basic Analytics",
      "Email Support"
    ],
    isPopular: false
  },
  {
    name: "Elite",
    price: "₹4,999",
    period: "/mo",
    features: [
      "Unlimited Strategies",
      "Advanced Analytics",
      "24/7 Priority Support",
      "Custom Indicators"
    ],
    isPopular: true
  }
];

interface PlanDetails {
  id: string;
  plan_name: string;
  plan_price: string;
  selected_at: string;
}

const paymentFormSchema = z.object({
  cardNumber: z.string()
    .min(16, "Card number must be at least 16 digits")
    .max(19, "Card number cannot exceed 19 digits"),
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Expiry date must be in MM/YY format"),
  cvv: z.string()
    .min(3, "CVV must be at least 3 digits")
    .max(4, "CVV cannot exceed 4 digits"),
  nameOnCard: z.string()
    .min(3, "Name on card is required")
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

const Subscription = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [userPlan, setUserPlan] = useState<PlanDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [targetPlan, setTargetPlan] = useState<{name: string, price: string} | null>(null);
  const [selectedStrategyId, setSelectedStrategyId] = useState<number | null>(null);
  
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      nameOnCard: ""
    }
  });

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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const planName = params.get('plan');
    const planPrice = params.get('price');
    const strategyId = params.get('strategyId');
    
    if (planName && planPrice) {
      setTargetPlan({ name: planName, price: planPrice });
    }
    
    if (strategyId) {
      setSelectedStrategyId(parseInt(strategyId));
      console.log("Strategy ID from URL:", strategyId);
    }
  }, [location.search]);

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

    setTargetPlan({ name: planName, price: planPrice });
    setShowPaymentDialog(true);
  };

  const unlockStrategy = async (userId: string, strategyId: number): Promise<boolean> => {
    console.log(`Unlocking strategy ID ${strategyId} for user ${userId}`);
    
    try {
      const { data: strategyData, error: strategyError } = await supabase
        .from('predefined_strategies')
        .select('name, description')
        .eq('id', strategyId)
        .single();
        
      if (strategyError) {
        console.error('Error fetching strategy details:', strategyError);
        throw new Error(`Failed to get strategy details: ${strategyError.message}`);
      }
      
      if (!strategyData) {
        throw new Error('Strategy data not found');
      }
      
      console.log("Fetched strategy details:", strategyData);
      
      let unlockSuccessful = false;
      
      try {
        await saveStrategyConfiguration(
          userId,
          strategyId,
          strategyData.name,
          strategyData.description,
          0, // Default quantity
          "", // Default empty broker
          "paper trade", // Start with paper trade for safety
          'paid' // Mark as paid
        );
        unlockSuccessful = true;
      } catch (error) {
        console.error("Method 1 failed:", error);
      }
      
      if (!unlockSuccessful) {
        console.log("Method 2: Using direct database function");
        try {
          const { error: dbFunctionError } = await supabase
            .rpc('force_strategy_paid_status', {
              p_user_id: userId,
              p_strategy_id: strategyId,
              p_strategy_name: strategyData.name,
              p_strategy_description: strategyData.description
            });
            
          if (dbFunctionError) {
            console.error('Database function error:', dbFunctionError);
          } else {
            console.log("Database function succeeded");
            unlockSuccessful = true;
          }
        } catch (error) {
          console.error("Method 2 failed:", error);
        }
      }
      
      if (!unlockSuccessful) {
        console.log("Method 3: Direct upsert as additional guarantee");
        try {
          const { error: upsertError } = await supabase
            .from('strategy_selections')
            .upsert({
              user_id: userId,
              strategy_id: strategyId,
              strategy_name: strategyData.name,
              strategy_description: strategyData.description,
              paid_status: 'paid',
              trade_type: "paper trade",
              quantity: 0,
              selected_broker: ""
            }, { 
              onConflict: 'user_id,strategy_id',
              ignoreDuplicates: false 
            });
            
          if (upsertError) {
            console.error('Direct upsert error:', upsertError);
          } else {
            console.log("Direct upsert successful");
            unlockSuccessful = true;
          }
        } catch (error) {
          console.error("Method 3 failed:", error);
        }
      }
      
      let verified = false;
      
      for (let attempt = 0; attempt < 3; attempt++) {
        console.log(`Verification attempt ${attempt + 1}`);
        
        const { data: verifyData, error: verifyError } = await supabase
          .from('strategy_selections')
          .select('paid_status')
          .eq('user_id', userId)
          .eq('strategy_id', strategyId)
          .maybeSingle();
          
        if (verifyError) {
          console.error(`Verification attempt ${attempt + 1} failed:`, verifyError);
        } else if (verifyData && verifyData.paid_status === 'paid') {
          console.log(`Strategy verified as paid on attempt ${attempt + 1}`);
          verified = true;
          break;
        } else {
          console.log(`Verification data:`, verifyData);
          
          if (verifyData) {
            const { error: updateError } = await supabase
              .from('strategy_selections')
              .update({ paid_status: 'paid' })
              .eq('user_id', userId)
              .eq('strategy_id', strategyId);
              
            if (!updateError) {
              console.log(`Direct update during verification attempt ${attempt + 1} succeeded`);
            }
          }
        }
        
        if (!verified && attempt < 2) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      return verified || unlockSuccessful;
    } catch (error) {
      console.error("Error in unlockStrategy:", error);
      return false;
    }
  };

  const onPaymentSubmit = async (values: PaymentFormValues) => {
    if (!user || !targetPlan) return;
    
    setProcessingPayment(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { error } = await supabase
        .from('plan_details')
        .insert({
          user_id: user.id,
          plan_name: targetPlan.name,
          plan_price: targetPlan.price,
        });

      if (error) {
        console.error('Error saving plan selection:', error);
        toast({
          title: "Error",
          description: "Failed to save your plan selection. Please try again.",
          variant: "destructive",
        });
        setProcessingPayment(false);
        return;
      }
      
      setPaymentSuccess(true);
      
      let strategyUnlocked = false;
      
      if (selectedStrategyId) {
        for (let attempt = 0; attempt < 3; attempt++) {
          console.log(`Unlock attempt ${attempt + 1}`);
          strategyUnlocked = await unlockStrategy(user.id, selectedStrategyId);
          
          if (strategyUnlocked) {
            console.log(`Successfully unlocked strategy ${selectedStrategyId} on attempt ${attempt + 1}`);
            break;
          }
          
          if (!strategyUnlocked && attempt < 2) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
        
        if (!strategyUnlocked) {
          console.warn(`Could not verify strategy ${selectedStrategyId} was unlocked. Will try again on redirect.`);
        }
      }
      
      localStorage.removeItem('wishlistedStrategies');
      localStorage.removeItem('strategyCache');
      
      setTimeout(() => {
        toast({
          title: "Success",
          description: `Payment successful! You've subscribed to the ${targetPlan.name} plan.${
            selectedStrategyId ? ' Premium strategy has been unlocked.' : ''
          }`,
          variant: "default",
        });
        
        setShowPaymentDialog(false);
        setProcessingPayment(false);
        setPaymentSuccess(false);
        
        const timestamp = new Date().getTime();
        if (selectedStrategyId) {
          navigate(`/strategy-selection?refresh=${timestamp}&strategy=${selectedStrategyId}`);
        } else {
          navigate(`/strategy-selection?refresh=${timestamp}`);
        }
      }, 2000);
    } catch (error) {
      console.error('Error in payment processing:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setProcessingPayment(false);
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
    <div className="bg-gray-900 min-h-screen text-white">
      <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Button
            onClick={() => navigate('/dashboard')}
            className="p-2"
          >
            <i className="fa-solid fa-arrow-left text-gray-400"></i>
          </Button>
          <h1 className="text-lg font-semibold">Subscription & Billing</h1>
          <button className="p-2">
            <i className="fa-solid fa-gear text-gray-400"></i>
          </button>
        </div>
      </header>

      <main className="pt-20 px-4 pb-24">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader className="h-8 w-8 animate-spin text-[#FF00D4]" />
          </div>
        ) : userPlan ? (
          <section className="mb-8">
            <div className="bg-gradient-to-br from-[#FF00D4]/10 to-purple-900/20 rounded-2xl p-6 border border-[#FF00D4]/20 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-[#FF00D4] font-bold text-xl">{userPlan.plan_name} Plan</h2>
                  <p className="text-gray-400 text-sm">Valid until {formatExpirationDate()}</p>
                </div>
                <span className="bg-[#FF00D4]/20 text-[#FF00D4] px-3 py-1 rounded-full text-sm">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-2xl font-bold">{userPlan.plan_price}<span className="text-sm text-gray-400">/month</span></p>
                <Button 
                  className="bg-[#FF00D4] text-white shadow-lg shadow-[#FF00D4]/20 hover:bg-[#FF00D4]/90"
                  onClick={() => navigate('/pricing')}
                >
                  Upgrade Plan
                </Button>
              </div>
            </div>
          </section>
        ) : (
          <section className="mb-8">
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 shadow-lg">
              <p className="text-center text-gray-400 mb-4">You don't have an active subscription plan.</p>
              <Button 
                className="w-full bg-[#FF00D4] text-white shadow-lg shadow-[#FF00D4]/20 hover:bg-[#FF00D4]/90"
                onClick={() => navigate('/pricing')}
              >
                Choose a Plan
              </Button>
            </div>
          </section>
        )}

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Available Plans</h2>
          <div className="space-y-4">
            {plans.map((plan) => (
              <div 
                key={plan.name}
                className={cn(
                  "rounded-xl p-4 border",
                  plan.isPopular 
                    ? "bg-gradient-to-br from-[#FF00D4]/5 to-purple-900/10 border-[#FF00D4]/20" 
                    : "bg-gray-800/50 border-gray-700"
                )}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className={cn(
                    "font-bold",
                    plan.isPopular ? "text-[#FF00D4]" : ""
                  )}>{plan.name}</h3>
                  <p className="text-lg font-bold">
                    {plan.price}<span className="text-sm text-gray-400">{plan.period}</span>
                  </p>
                </div>
                <ul className="text-sm text-gray-400 space-y-2 mb-4">
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <i className={cn(
                        "fa-solid fa-check mr-2",
                        plan.isPopular ? "text-[#FF00D4]" : "text-green-400"
                      )}></i>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className={cn(
                    "w-full",
                    plan.isPopular 
                      ? "bg-[#FF00D4] text-white shadow-lg shadow-[#FF00D4]/20 hover:bg-[#FF00D4]/90" 
                      : "border border-[#FF00D4] text-[#FF00D4] bg-transparent hover:bg-[#FF00D4]/10"
                  )}
                  onClick={() => handlePlanSelect(plan.name, plan.price)}
                >
                  Select Plan
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Payment Methods</h2>
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <i className="fa-regular fa-credit-card text-gray-400 mr-3"></i>
                <div>
                  <p className="font-medium">•••• 4242</p>
                  <p className="text-sm text-gray-400">Expires 08/25</p>
                </div>
              </div>
              <span className="bg-green-400/20 text-green-400 px-2 py-1 rounded-full text-xs">Default</span>
            </div>
            <Button 
              variant="outline"
              className="w-full border-gray-700 text-gray-400 hover:bg-gray-700/50"
              onClick={() => setShowPaymentDialog(true)}
            >
              <i className="fa-solid fa-plus mr-2"></i>
              Add Payment Method
            </Button>
          </div>
        </section>
      </main>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="bg-gray-800 border border-gray-700 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {paymentSuccess ? "Payment Successful" : "Add Payment Method"}
            </DialogTitle>
            <DialogDescription className="text-gray-400 pt-2">
              {paymentSuccess 
                ? "Your payment has been processed successfully." 
                : targetPlan 
                  ? `Complete payment to subscribe to the ${targetPlan.name} plan for ${targetPlan.price}/month.` 
                  : "Enter your card details to add a new payment method."}
            </DialogDescription>
          </DialogHeader>
          
          {paymentSuccess ? (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="bg-green-900/20 p-6 rounded-full mb-4">
                <CheckCircle className="h-16 w-16 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
              <p className="text-gray-400 text-center mb-6">
                Your subscription is now active.
                {selectedStrategyId ? " Premium strategy has been unlocked." : ""}
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onPaymentSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="1234 5678 9012 3456" 
                            className="pl-10 bg-gray-700 border-gray-600" 
                            {...field} 
                          />
                          <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="MM/YY" 
                            className="bg-gray-700 border-gray-600" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="123" 
                            className="bg-gray-700 border-gray-600" 
                            {...field} 
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="nameOnCard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name on Card</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="John Doe" 
                          className="bg-gray-700 border-gray-600" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 hover:opacity-90"
                    disabled={processingPayment}
                  >
                    {processingPayment ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Pay {targetPlan?.price || ''}</>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
      
      <BottomNav />
    </div>
  );
};

export default Subscription;
