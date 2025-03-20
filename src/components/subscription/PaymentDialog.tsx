
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import PaymentMethodForm from "./PaymentMethodForm";

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
          <DialogDescription className="text-gray-400">
            {selectedStrategyName ? 
              `Complete payment to unlock ${selectedStrategyName} and all premium strategies.` :
              `Enter your card details to subscribe to the ${planName} plan.`
            }
          </DialogDescription>
        </DialogHeader>
        
        <PaymentMethodForm
          planName={planName}
          planPrice={planPrice}
          onSuccess={onSuccess}
          onCancel={() => onOpenChange(false)}
          selectedStrategyId={selectedStrategyId}
          selectedStrategyName={selectedStrategyName}
        />
        
        <div className="text-xs text-gray-400 mt-4">
          <p>This is a demo application. No actual payment will be processed.</p>
          <p>Use any valid-looking card number like: 4242 4242 4242 4242</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
