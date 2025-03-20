
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface PaymentMethodFormProps {
  planName: string;
  planPrice: string;
  onSuccess: () => void;
  onCancel: () => void;
  selectedStrategyId?: number;
  selectedStrategyName?: string | null;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({
  planName,
  planPrice,
  onSuccess,
  onCancel,
  selectedStrategyId,
  selectedStrategyName
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };
  
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return value;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication error",
        description: "Please log in to continue",
        variant: "destructive"
      });
      return;
    }
    
    if (cardNumber.length < 16 || cardExpiry.length < 5 || cardCvv.length < 3 || !cardName) {
      toast({
        title: "Validation error",
        description: "Please fill in all card details correctly",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save the plan details
      const { error: planError } = await supabase
        .from('plan_details')
        .insert({
          user_id: user.id,
          plan_name: planName,
          plan_price: planPrice,
          is_paid: true
        });
        
      if (planError) {
        throw planError;
      }
      
      // If a specific strategy was selected, mark it as paid
      if (selectedStrategyId) {
        // First check if the strategy already exists in the user's selections
        const { data: existingStrategy, error: queryError } = await supabase
          .from('strategy_selections')
          .select('*')
          .eq('user_id', user.id)
          .eq('strategy_id', selectedStrategyId)
          .maybeSingle();
          
        if (queryError) {
          throw queryError;
        }
        
        // If the strategy exists, update its paid status
        if (existingStrategy) {
          await supabase
            .from('strategy_selections')
            .update({ paid_status: 'paid' })
            .eq('id', existingStrategy.id);
        } else {
          // If the strategy doesn't exist, create a new entry with paid status
          await supabase.rpc('force_strategy_paid_status', {
            p_user_id: user.id,
            p_strategy_id: selectedStrategyId,
            p_strategy_name: selectedStrategyName || `Strategy ${selectedStrategyId}`,
            p_strategy_description: "Premium strategy unlocked with subscription"
          });
        }
      }
      
      // Mark all premium strategies (IDs 2-5) as paid
      for (let i = 2; i <= 5; i++) {
        // Skip the selected strategy as it's already been handled
        if (i === selectedStrategyId) continue;
        
        const { data: existingStrategy, error: queryError } = await supabase
          .from('strategy_selections')
          .select('*')
          .eq('user_id', user.id)
          .eq('strategy_id', i)
          .maybeSingle();
          
        if (queryError) {
          throw queryError;
        }
        
        if (existingStrategy) {
          await supabase
            .from('strategy_selections')
            .update({ paid_status: 'paid' })
            .eq('id', existingStrategy.id);
        } else {
          await supabase.rpc('force_strategy_paid_status', {
            p_user_id: user.id,
            p_strategy_id: i,
            p_strategy_name: `Strategy ${i}`,
            p_strategy_description: "Premium strategy unlocked with subscription"
          });
        }
      }
      
      // Remove the selected strategy ID from session storage
      sessionStorage.removeItem('selectedStrategyId');
      
      toast({
        title: "Payment successful",
        description: selectedStrategyName
          ? `You've unlocked ${selectedStrategyName} and all premium strategies!`
          : `Your ${planName} plan is now active!`,
        variant: "default"
      });
      
      onSuccess();
      
      // Redirect to live-trading page if we came from there
      const redirectPath = sessionStorage.getItem('redirectAfterPayment');
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterPayment');
        navigate(redirectPath);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment failed",
        description: "There was a problem processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="cardName">Cardholder Name</Label>
        <Input
          id="cardName"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          placeholder="John Smith"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input
          id="cardNumber"
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          placeholder="4242 4242 4242 4242"
          maxLength={19}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cardExpiry">Expiry Date</Label>
          <Input
            id="cardExpiry"
            value={cardExpiry}
            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
            placeholder="MM/YY"
            maxLength={5}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="cardCvv">CVV</Label>
          <Input
            id="cardCvv"
            value={cardCvv}
            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
            placeholder="123"
            maxLength={3}
            required
          />
        </div>
      </div>
      
      <div className="flex flex-col space-y-2">
        <Button 
          type="submit" 
          className="w-full bg-[#FF00D4] hover:bg-[#FF00D4]/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : selectedStrategyName 
            ? `Unlock ${selectedStrategyName} for ${planPrice}`
            : `Pay ${planPrice}`
          }
        </Button>
        
        <Button 
          type="button" 
          variant="outline" 
          className="w-full" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default PaymentMethodForm;
