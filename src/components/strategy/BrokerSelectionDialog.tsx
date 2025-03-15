
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrokerSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (brokerId: string) => void;
  onCancel: () => void;
}

interface BrokerOption {
  id: string;
  broker_name: string;
}

export const BrokerSelectionDialog = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
}: BrokerSelectionDialogProps) => {
  const [selectedBroker, setSelectedBroker] = useState("");
  const [brokers, setBrokers] = useState<BrokerOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBrokers = async () => {
      if (!user || !open) return;
      
      setIsLoading(true);
      try {
        console.log("Fetching brokers for user:", user.id);
        const { data, error } = await supabase
          .from('broker_credentials')
          .select('id, broker_name')
          .eq('user_id', user.id)
          .eq('status', 'connected');
          
        if (error) {
          console.error('Error fetching brokers:', error);
          throw error;
        }
        
        console.log("Fetched brokers:", data);
        setBrokers(data || []);
        
        // Set default selection if brokers exist
        if (data && data.length > 0) {
          setSelectedBroker(data[0].id);
        } else {
          setSelectedBroker("");
        }
      } catch (error) {
        console.error('Error fetching brokers:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (open) {
      fetchBrokers();
    }
  }, [user, open]);

  const handleConfirm = () => {
    if (selectedBroker) {
      console.log("Confirming with broker ID:", selectedBroker);
      onConfirm(selectedBroker);
    }
  };

  const navigateToBrokerIntegration = () => {
    onCancel();
    // Navigate to broker integration page
    window.location.href = '/broker-integration';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white p-0 overflow-hidden max-w-md">
        <div className="relative">
          <DialogHeader className="p-6 pb-3">
            <DialogTitle className="text-xl font-semibold text-center">Select Broker</DialogTitle>
            <button
              onClick={onCancel}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <p className="text-gray-400 text-sm text-center mt-1">
              Choose a broker to use with this strategy
            </p>
          </DialogHeader>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : brokers.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <p className="text-gray-300 mb-6">
              You need to connect a broker before starting live trading.
            </p>
            <Button 
              variant="default"
              className={cn(
                "bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md",
                "transition-all duration-200"
              )}
              onClick={navigateToBrokerIntegration}
            >
              Connect a Broker
            </Button>
          </div>
        ) : (
          <div className="p-6 pt-0">
            <div className="mb-6">
              <Select value={selectedBroker} onValueChange={setSelectedBroker}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-full">
                  <SelectValue placeholder="Select a broker" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  {brokers.map((broker) => (
                    <SelectItem key={broker.id} value={broker.id} className="focus:bg-gray-600 text-white hover:bg-gray-600">
                      {broker.broker_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="default"
              className="bg-green-600 hover:bg-green-700 w-full py-6"
              onClick={handleConfirm}
              disabled={!selectedBroker}
            >
              Confirm Selection
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
