
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import PaymentMethodForm from "./PaymentMethodForm";
import { Button } from "@/components/ui/button";
import { convertPriceToAmount, initializeRazorpayPayment } from "@/utils/razorpayUtils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

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
  
  const handleRazorpayPayment = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to make a payment",
        variant: "destructive",
      });
      return;
    }

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
        toast({
          title: "Payment Successful",
          description: `Payment ID: ${payment_id}`,
          variant: "default",
        });
        onSuccess();
      },
      () => {
        toast({
          title: "Payment Failed",
          description: "Please try again",
          variant: "destructive",
        });
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Payment Options</DialogTitle>
          <DialogDescription className="text-gray-400">
            {selectedStrategyName ? 
              `Choose a payment method to unlock ${selectedStrategyName} and all premium strategies.` :
              `Choose a payment method to subscribe to the ${planName} plan.`
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4">
          <Button 
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-6 rounded-lg font-medium shadow-lg hover:opacity-90 transition-opacity"
            onClick={handleRazorpayPayment}
          >
            Pay with Razorpay
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-700"></span>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-800 px-2 text-sm text-gray-400">or pay with credit card</span>
            </div>
          </div>
          
          <PaymentMethodForm
            planName={planName}
            planPrice={planPrice}
            onSuccess={onSuccess}
            onCancel={() => onOpenChange(false)}
            selectedStrategyId={selectedStrategyId}
            selectedStrategyName={selectedStrategyName}
          />
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
