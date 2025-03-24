import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { convertPriceToAmount, initializeRazorpayPayment } from "@/utils/razorpayUtils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { useAdminConfig } from "@/hooks/useAdminConfig";
import { supabase } from "@/integrations/supabase/client";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planName: string;
  planPrice: string;
  onSuccess: () => void;
  selectedStrategyId?: number;
  selectedStrategyName?: string | null;
}

interface RazorpayConfig {
  test_key: string;
  test_secret: string;
  live_key: string;
  mode: 'test' | 'live';
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  open,
  onOpenChange,
  planName,
  planPrice,
  onSuccess,
  selectedStrategyId,
  selectedStrategyName
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = React.useState(false);
  
  const { 
    config: razorpayConfig, 
    loading: configLoading, 
    error: configError 
  } = useAdminConfig<RazorpayConfig>('razorpay_config');
  
  React.useEffect(() => {
    if (configError) {
      console.error('Error loading Razorpay config:', configError);
      toast({
        title: "Configuration Error",
        description: "Payment system configuration issue. Using default test configuration.",
        variant: "destructive",
      });
    }
  }, [configError, toast]);
  
  const savePlanSelection = async (payment_id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('plan_details')
        .insert({
          user_id: user.id,
          plan_name: planName,
          plan_price: planPrice,
          is_paid: true
        });

      if (error) {
        console.error('Error saving plan selection:', error);
        throw error;
      }
      
      if (planName === 'Premium' || planPrice === '₹4999') {
        await unlockAllStrategies(user.id);
      }
      else if (selectedStrategyId) {
        const { error: strategyError } = await supabase.rpc(
          'force_strategy_paid_status',
          {
            p_user_id: user.id,
            p_strategy_id: selectedStrategyId,
            p_strategy_name: selectedStrategyName || '',
            p_strategy_description: `Premium strategy unlocked with ${planName} plan`
          }
        );
        
        if (strategyError) {
          console.error('Error updating strategy status:', strategyError);
          throw strategyError;
        }
      }
    } catch (error) {
      console.error('Error in plan selection:', error);
      toast({
        title: "Database Error",
        description: "Failed to save your plan selection. Please contact support.",
        variant: "destructive",
      });
    }
  };
  
  const unlockAllStrategies = async (userId: string) => {
    try {
      const { data: strategies, error: strategiesError } = await supabase
        .from('predefined_strategies')
        .select('id, name, description');
        
      if (strategiesError) {
        console.error('Error fetching strategies:', strategiesError);
        throw strategiesError;
      }
      
      if (!strategies || strategies.length === 0) {
        console.log('No strategies found to unlock');
        return;
      }
      
      console.log(`Unlocking ${strategies.length} strategies for Premium user`);
      
      for (const strategy of strategies) {
        const { error: strategyError } = await supabase.rpc(
          'force_strategy_paid_status',
          {
            p_user_id: userId,
            p_strategy_id: strategy.id,
            p_strategy_name: strategy.name,
            p_strategy_description: strategy.description || 'Premium strategy unlocked with subscription'
          }
        );
        
        if (strategyError) {
          console.error(`Error unlocking strategy ${strategy.id}:`, strategyError);
        }
      }
      
      console.log('All strategies successfully unlocked');
    } catch (error) {
      console.error('Error in unlocking all strategies:', error);
    }
  };
  
  const handleRazorpayPayment = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to make a payment",
        variant: "destructive",
      });
      return;
    }

    if (!razorpayConfig) {
      toast({
        title: "Configuration Notice",
        description: "Using default payment configuration.",
        variant: "default",
      });
      // Continue with default config that will be set in initializeRazorpayPayment
    }

    setIsProcessing(true);
    const amount = convertPriceToAmount(planPrice);
    
    const userName = user.email?.split('@')[0] || "";
    const userEmail = user.email || "";
    
    const apiKey = razorpayConfig?.mode === 'test' 
      ? (razorpayConfig?.test_key || 'rzp_test_Q9hmPFiRhnZuqK')
      : (razorpayConfig?.live_key || 'rzp_live_AlwIwA3L3AFrKc');
    
    const options = {
      key: apiKey,
      amount: amount,
      currency: "INR",
      name: "AlgoTrade",
      description: `Payment for ${planName} plan`,
      prefill: {
        name: userName,
        email: userEmail,
      },
      theme: {
        color: "#FF00D4",
      },
    };

    initializeRazorpayPayment(
      options,
      (payment_id) => {
        savePlanSelection(payment_id).then(() => {
          setIsProcessing(false);
          toast({
            title: "Payment Successful",
            description: planName === 'Premium' || planPrice === '₹4999' 
              ? "All premium strategies have been unlocked!" 
              : `Payment completed: ${payment_id}`,
            variant: "default",
          });
          onSuccess();
        });
      },
      () => {
        setIsProcessing(false);
        toast({
          title: "Payment Failed",
          description: "Please try again",
          variant: "destructive",
        });
      }
    );
  };

  React.useEffect(() => {
    if (open && (!configLoading || configError)) {
      handleRazorpayPayment();
    }
  }, [open, configLoading, configError]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Processing Payment</DialogTitle>
          <DialogDescription className="text-gray-400">
            {planName === 'Premium' || planPrice === '₹4999' ? 
              "Connecting to payment gateway to unlock all premium strategies" :
              (selectedStrategyName ? 
                `Connecting to payment gateway to unlock ${selectedStrategyName}` :
                `Connecting to payment gateway for the ${planName} plan`)
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-8">
          <Loader className="h-12 w-12 animate-spin text-[#FF00D4] mb-4" />
          <p className="text-center text-gray-300">Please wait while we connect to Razorpay...</p>
          <p className="text-center text-gray-300 mt-2">Amount: {planPrice}</p>
          {(planName === 'Premium' || planPrice === '₹4999') && (
            <p className="text-center text-[#FF00D4] mt-4 font-medium">
              All premium strategies will be unlocked with this plan!
            </p>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
        </div>
        
        <div className="text-xs text-gray-400 mt-4">
          <p>This application is using Razorpay's {razorpayConfig?.mode || 'test'} payment processing.</p>
          <p>Your payment information is securely handled by Razorpay.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
