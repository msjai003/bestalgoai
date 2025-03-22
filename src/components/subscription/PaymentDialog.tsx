
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
import { supabase } from "@/integrations/supabase/client";
import { Loader } from "lucide-react";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planName: string;
  planPrice: string;
  onSuccess: () => void;
  selectedStrategyId?: number;
  selectedStrategyName?: string | null;
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
  
  const unlockAllStrategies = async () => {
    if (!user) return;
    
    try {
      // Fetch all predefined strategies
      const { data: strategies, error: fetchError } = await supabase
        .from('predefined_strategies')
        .select('id, name, description');
        
      if (fetchError) {
        console.error('Error fetching strategies:', fetchError);
        throw fetchError;
      }
      
      if (strategies && strategies.length > 0) {
        // For each strategy, update its status to paid
        for (const strategy of strategies) {
          const { error: strategyError } = await supabase.rpc(
            'force_strategy_paid_status',
            {
              p_user_id: user.id,
              p_strategy_id: strategy.id,
              p_strategy_name: strategy.name,
              p_strategy_description: strategy.description || `Premium strategy unlocked with ${planName} plan`
            }
          );
          
          if (strategyError) {
            console.error(`Error updating strategy ${strategy.id} status:`, strategyError);
            // Continue with the next strategy even if one fails
          }
        }
      }
    } catch (error) {
      console.error('Error unlocking all strategies:', error);
      toast({
        title: "Error",
        description: "There was an issue unlocking all strategies. Please contact support.",
        variant: "destructive",
      });
      // Still continuing with success callback as payment was processed
    }
  };
  
  const savePlanSelection = async (payment_id: string) => {
    if (!user) return;
    
    try {
      // Insert plan selection into the database
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
      
      // If Premium plan, unlock all strategies
      if (planName === 'Premium') {
        await unlockAllStrategies();
      }
      // If a specific strategy was selected, update its status to paid
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
      // Still continuing with success callback as payment was processed
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

    setIsProcessing(true);
    const amount = convertPriceToAmount(planPrice);
    
    // Extract user information safely, checking if properties exist
    const userName = user.email?.split('@')[0] || "";
    const userEmail = user.email || "";
    
    const options = {
      key: "rzp_test_iN0M3B79HiBpvQ", // Razorpay Key
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
        // Save the plan selection to the database
        savePlanSelection(payment_id).then(() => {
          setIsProcessing(false);
          toast({
            title: "Payment Successful",
            description: planName === 'Premium' 
              ? "All premium strategies have been unlocked!" 
              : `Payment ID: ${payment_id}`,
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

  // Automatically initiate payment when dialog opens
  React.useEffect(() => {
    if (open) {
      handleRazorpayPayment();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Processing Payment</DialogTitle>
          <DialogDescription className="text-gray-400">
            {planName === 'Premium' 
              ? "Connecting to payment gateway to unlock all premium strategies" 
              : selectedStrategyName 
                ? `Connecting to payment gateway to unlock ${selectedStrategyName}` 
                : `Connecting to payment gateway for the ${planName} plan`
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-8">
          <Loader className="h-12 w-12 animate-spin text-[#FF00D4] mb-4" />
          <p className="text-center text-gray-300">Please wait while we connect to Razorpay...</p>
          <p className="text-center text-gray-300 mt-2">Amount: {planPrice}</p>
          {planName === 'Premium' && (
            <p className="text-center text-[#FF00D4] mt-4 font-semibold">
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
          <p>This is a demo application using Razorpay test mode.</p>
          <p>No actual payment will be processed.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
