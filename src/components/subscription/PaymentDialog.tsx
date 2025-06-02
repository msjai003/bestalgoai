import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { initializeRazorpayPayment, convertPriceToAmount } from "@/utils/razorpayUtils";
import { useFileManagement } from "@/hooks/useFileManagement";
import { useAuth } from "@/contexts/auth/AuthContext";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planName: string;
  planPrice: string;
  onSuccess: () => void;
  fileId?: number;
  selectedStrategyId?: number;
  selectedStrategyName?: string;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  open,
  onOpenChange,
  planName,
  planPrice,
  onSuccess,
  fileId,
  selectedStrategyId,
  selectedStrategyName,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const { recordFilePayment } = useFileManagement(user?.id);

  const handlePayment = () => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    setIsProcessing(true);

    const options = {
      key: "rzp_test_yb9BsUPOlZGzUn",
      amount: convertPriceToAmount(planPrice),
      currency: "INR",
      name: "BestAlgo.ai",
      description: `Payment for ${planName}`,
      prefill: {
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
        email: user.email || '',
      },
      theme: {
        color: "#00bcd4",
      },
    };

    const handleSuccess = async (payment_id: string) => {
      try {
        // Record payment in database if this is a file payment
        if (fileId) {
          await recordFilePayment(fileId);
        }
        
        onSuccess();
        onOpenChange(false);
      } catch (error) {
        console.error("Error recording payment:", error);
      } finally {
        setIsProcessing(false);
      }
    };

    const handleError = () => {
      console.error("Payment failed");
      setIsProcessing(false);
    };

    initializeRazorpayPayment(options, handleSuccess, handleError);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-charcoalSecondary border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-center">Complete Payment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 p-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">{planName}</h3>
            <p className="text-2xl font-bold text-cyan">{planPrice}</p>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-cyan hover:bg-cyan/80 text-white font-medium py-3"
            >
              {isProcessing ? "Processing..." : `Pay ${planPrice}`}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
          </div>
          
          <div className="text-xs text-gray-400 text-center mt-4">
            Secure payment powered by Razorpay
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
