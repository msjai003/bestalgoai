
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Broker } from "@/types/broker";
import { Check, X } from "lucide-react";
import { getBrokerLogo } from "@/utils/brokerImageUtils";

interface SuccessDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  selectedBroker: Broker | null;
  selectedAccount: string;
  permissions: {
    readOnly: boolean;
    trading: boolean;
  };
  onComplete: () => void;
}

export const SuccessDialog = ({
  open,
  setOpen,
  selectedBroker,
  selectedAccount,
  permissions,
  onComplete
}: SuccessDialogProps) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  
  useEffect(() => {
    if (selectedBroker) {
      const fetchLogo = async () => {
        const url = await getBrokerLogo(selectedBroker.id);
        setLogoUrl(url);
      };
      
      fetchLogo();
    }
  }, [selectedBroker]);

  if (!open || !selectedBroker) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 relative">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex flex-col items-center text-center">
          <div className="bg-emerald-500/20 p-3 rounded-full mb-4">
            <Check className="w-8 h-8 text-emerald-500" />
          </div>
          
          <div className="mb-4 flex items-center">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={selectedBroker.name} 
                className="w-8 h-8 mr-2 rounded bg-white p-1 object-contain"
              />
            ) : (
              <img 
                src={selectedBroker.logo} 
                alt={selectedBroker.name} 
                className="w-8 h-8 mr-2 rounded"
              />
            )}
            <h2 className="text-xl font-bold">{selectedBroker.name} Connected!</h2>
          </div>
          
          <p className="text-gray-300 mb-6">
            Your {selectedBroker.name} account has been successfully connected to WealthTrade.
          </p>
          
          <div className="bg-gray-700/50 rounded-lg p-4 w-full mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">Account Type</span>
              <span className="text-white font-medium">{selectedAccount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Permissions</span>
              <span className="text-white font-medium">
                {permissions.trading ? "Trading" : "Read Only"}
              </span>
            </div>
          </div>
          
          <Button 
            variant="default" 
            onClick={onComplete}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 h-12 rounded-xl"
          >
            Continue to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
