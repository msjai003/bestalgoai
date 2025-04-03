
import { Check, Plug, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Broker, BrokerPermissions } from "@/types/broker";
import { useEffect, useState } from "react";
import { getBrokerImage } from "@/lib/broker-functions";

interface SuccessDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedBroker: Broker | null;
  selectedAccount: string;
  permissions: BrokerPermissions;
  onComplete: () => void;
}

export const SuccessDialog = ({
  open,
  setOpen,
  selectedBroker,
  selectedAccount,
  permissions,
  onComplete,
}: SuccessDialogProps) => {
  const [brokerName, setBrokerName] = useState<string | null>(null);
  const [brokerImage, setBrokerImage] = useState<string | null>(null);

  // Fetch the correct broker name and image from the database when the dialog opens
  useEffect(() => {
    const fetchBrokerDetails = async () => {
      if (selectedBroker && open) {
        try {
          // Get broker image from the database
          const image = await getBrokerImage(selectedBroker.id);
          if (image) {
            setBrokerImage(image);
          }
          
          // Use broker name from the brokers_functions table
          // We'll fetch the first function for this broker to get the name
          const { supabase } = await import("@/integrations/supabase/client");
          const { data } = await supabase
            .from('brokers_functions')
            .select('broker_name')
            .eq('broker_id', selectedBroker.id)
            .limit(1);
            
          if (data && data.length > 0) {
            setBrokerName(data[0].broker_name);
          } else {
            // Fallback to the name from the broker object
            setBrokerName(selectedBroker.name);
          }
        } catch (error) {
          console.error("Error fetching broker details:", error);
          // Fallback to the name from the broker object
          setBrokerName(selectedBroker.name);
        }
      }
    };
    
    fetchBrokerDetails();
  }, [selectedBroker, open]);

  // Display name should be the database name if available, otherwise fallback to the prop
  const displayName = brokerName || (selectedBroker ? selectedBroker.name : '');
  
  // Display image should be the database image if available, otherwise fallback to the broker logo
  const displayImage = brokerImage || (selectedBroker ? selectedBroker.logo : '');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-gray-800 border-gray-700 text-gray-100">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            Broker Connected Successfully
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Your broker has been successfully connected. You can now use it for live trading strategies.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gray-900 rounded-lg p-4 mt-2">
          <div className="flex items-center mb-3">
            {displayImage && (
              <img
                src={displayImage}
                className="w-8 h-8 rounded-md mr-3"
                alt={displayName}
              />
            )}
            <div>
              <h4 className="font-medium">{displayName}</h4>
              <p className="text-sm text-gray-400">{selectedAccount}</p>
            </div>
            <div className="ml-auto flex items-center">
              <span className="bg-green-900/50 text-green-500 text-xs px-2 py-1 rounded">
                Connected
              </span>
            </div>
          </div>

          <div className="text-sm text-gray-400">
            <p className="flex items-center gap-1">
              <Plug className="w-3 h-3" /> Connected at {new Date().toLocaleTimeString()}
            </p>
            <p className="flex items-center gap-1 mt-1">
              <Shield className="w-3 h-3" /> {permissions.trading
                ? "Trading access enabled"
                : "Read-only access enabled"}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-3">
          <Button
            className="bg-gradient-to-r from-purple-600 to-pink-500"
            onClick={onComplete}
          >
            Continue to Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
