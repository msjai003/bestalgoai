import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/auth/AuthContext";
import { initializeRazorpayPayment, convertPriceToAmount } from "@/utils/razorpayUtils";
import { useToast } from "@/hooks/use-toast";
import { useFileManagement } from "@/hooks/useFileManagement";
import { supabase } from "@/lib/supabase";
import { syncPremiumAccess } from "@/lib/supabase/subscription";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planName: string;
  planPrice: string;
  onSuccess?: () => void;
  paymentMethod?: 'stripe' | 'razorpay';
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
  paymentMethod = 'razorpay',
  fileId,
  selectedStrategyId,
  selectedStrategyName
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { toast } = useToast();
  const { recordFilePayment } = useFileManagement(user?.id);

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to make a payment",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // For file payments specifically
      if (fileId) {
        // If this is a file payment, use Razorpay
        const options = {
          key: "rzp_test_mASR2hbkwpBOuE", // Updated to test key
          amount: convertPriceToAmount(planPrice),
          currency: "INR",
          name: "InfoCap AI",
          description: `Payment for ${planName}`,
          prefill: {
            name: user.email?.split('@')[0] || "", // Use email prefix if name is not available
            email: user.email || "",
          },
          theme: {
            color: "#0891B2", // cyan color from tailwind
          },
        };

        // Initialize Razorpay payment
        initializeRazorpayPayment(
          options,
          async (payment_id) => {
            console.log("Payment success:", payment_id);
            
            // Record the file payment in the database
            if (fileId) {
              const success = await recordFilePayment(fileId);
              if (success) {
                toast({
                  title: "Payment successful",
                  description: `You now have access to ${planName}`,
                });
                if (onSuccess) onSuccess();
              } else {
                toast({
                  title: "Payment recording failed",
                  description: "Payment was successful but we couldn't record it. Please contact support.",
                  variant: "destructive",
                });
              }
            }
            
            setIsProcessing(false);
            onOpenChange(false);
          },
          () => {
            console.error("Payment failed");
            toast({
              title: "Payment failed",
              description: "Something went wrong with your payment. Please try again.",
              variant: "destructive",
            });
            setIsProcessing(false);
          }
        );
      } else if (selectedStrategyId) {
        // Handle strategy purchase
        const options = {
          key: "rzp_test_mASR2hbkwpBOuE", // Updated to test key
          amount: convertPriceToAmount(planPrice),
          currency: "INR",
          name: "InfoCap AI",
          description: `Payment for ${selectedStrategyName || planName}`,
          prefill: {
            name: user.email?.split('@')[0] || "",
            email: user.email || "",
          },
          theme: {
            color: "#0891B2",
          },
        };

        initializeRazorpayPayment(
          options,
          async (payment_id) => {
            console.log("Strategy payment success:", payment_id);
            
            // Record the strategy payment in the database
            try {
              // First check if the user has a plan_details entry
              const { data: planDetails, error: planError } = await supabase
                .from('plan_details')
                .select('*')
                .eq('user_id', user.id)
                .order('selected_at', { ascending: false })
                .limit(1)
                .maybeSingle();
                
              if (!planError && !planDetails) {
                // No plan details found, insert new entry with the exact plan name
                // Include the strategy ID in the plan name to track which strategy was purchased
                await supabase
                  .from('plan_details')
                  .insert({
                    user_id: user.id,
                    plan_name: `${planName} - Strategy ${selectedStrategyId}`,
                    plan_price: planPrice,
                    is_paid: true
                  });
              } else if (!planError) {
                // Update existing plan to paid status with strategy ID
                await supabase
                  .from('plan_details')
                  .update({ 
                    is_paid: true, 
                    plan_name: `${planName} - Strategy ${selectedStrategyId}`
                  })
                  .eq('id', planDetails.id);
              }
              
              // Call syncPremiumAccess with specificStrategyId parameter
              // The false parameter ensures we don't grant universal premium access
              await syncPremiumAccess(user.id, false, selectedStrategyId);

              toast({
                title: "Payment successful",
                description: selectedStrategyName 
                  ? `You now have access to ${selectedStrategyName}`
                  : "You now have premium access",
              });
              
              if (onSuccess) onSuccess();
            } catch (error) {
              console.error("Error recording strategy payment:", error);
              toast({
                title: "Payment recorded but access not updated",
                description: "Please contact support for assistance.",
                variant: "destructive",
              });
            }
            
            setIsProcessing(false);
            onOpenChange(false);
          },
          () => {
            console.error("Payment failed");
            toast({
              title: "Payment failed",
              description: "Something went wrong with your payment. Please try again.",
              variant: "destructive",
            });
            setIsProcessing(false);
          }
        );
      } else {
        // Regular subscription payment
        const options = {
          key: "rzp_test_mASR2hbkwpBOuE", // Updated to test key
          amount: convertPriceToAmount(planPrice),
          currency: "INR",
          name: "InfoCap AI",
          description: `Subscription to ${planName} Plan`,
          prefill: {
            name: user.email?.split('@')[0] || "",
            email: user.email || "",
          },
          theme: {
            color: "#0891B2",
          },
        };

        initializeRazorpayPayment(
          options,
          async (payment_id) => {
            console.log("Subscription payment success:", payment_id);
            
            // Record the plan selection with paid status
            try {
              await supabase
                .from('plan_details')
                .insert({
                  user_id: user.id,
                  plan_name: planName,
                  plan_price: planPrice,
                  is_paid: true
                });
                
              toast({
                title: "Payment successful",
                description: `Your subscription to ${planName} plan is now active`,
              });
              
              if (onSuccess) onSuccess();
            } catch (error) {
              console.error("Error recording subscription:", error);
              toast({
                title: "Payment successful but subscription not updated",
                description: "Please contact support for assistance.",
                variant: "destructive",
              });
            }
            
            setIsProcessing(false);
            onOpenChange(false);
          },
          () => {
            console.error("Payment failed");
            toast({
              title: "Payment failed",
              description: "Something went wrong with your payment. Please try again.",
              variant: "destructive",
            });
            setIsProcessing(false);
          }
        );
      }
    } catch (error) {
      console.error("Error during payment:", error);
      toast({
        title: "Payment error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-charcoalSecondary border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            {fileId ? "Unlock File" : selectedStrategyId ? "Unlock Strategy" : "Choose Your Plan"}
          </DialogTitle>
        </DialogHeader>

        <div className="pt-4">
          <div className="bg-charcoalPrimary p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-lg text-white">{selectedStrategyName || planName}</h3>
            <p className="text-cyan text-xl font-bold">{planPrice}</p>
            
            {fileId ? (
              <p className="text-gray-300 text-sm mt-2">
                One-time payment to unlock this file for permanent access.
              </p>
            ) : selectedStrategyId ? (
              <p className="text-gray-300 text-sm mt-2">
                One-time payment to unlock the {selectedStrategyName} strategy permanently.
              </p>
            ) : (
              <div className="mt-2 space-y-2">
                <p className="text-gray-300 text-sm flex items-center">
                  <span className="mr-2">✓</span> All Premium Trading Strategies
                </p>
                <p className="text-gray-300 text-sm flex items-center">
                  <span className="mr-2">✓</span> Advanced Analytics & Reports
                </p>
                <p className="text-gray-300 text-sm flex items-center">
                  <span className="mr-2">✓</span> Priority Support
                </p>
              </div>
            )}
          </div>

          <div className="mb-4">
            <p className="text-gray-300 mb-2">Select payment method:</p>
            <RadioGroup defaultValue={paymentMethod} className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="razorpay" id="razorpay" />
                <Label htmlFor="razorpay" className="text-white">
                  Razorpay (Credit/Debit Card, UPI, Wallets)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="bg-cyan hover:bg-cyan/80 text-white"
            >
              {isProcessing ? "Processing..." : `Pay ${planPrice}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
