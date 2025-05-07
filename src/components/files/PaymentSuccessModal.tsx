
import React from "react";
import { Button } from "@/components/ui/button";

interface PaymentSuccessModalProps {
  show: boolean;
  onClose: () => void;
}

const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({ show, onClose }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-charcoalSecondary rounded-lg p-4 max-w-md w-full text-center relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          ×
        </button>
        <h3 className="text-xl font-bold text-white mb-4">Payment Successful!</h3>
        <div className="flex justify-center mb-4">
          <img 
            src="/public/lovable-uploads/08728724-393e-42b7-bd7b-de74eb6bae04.png" 
            alt="Trading interface" 
            className="rounded-lg w-full max-w-sm"
          />
        </div>
        <p className="text-green-400 mb-4">All ZIP files are now unlocked!</p>
        <Button
          onClick={onClose}
          className="bg-cyan hover:bg-cyan/80"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;
