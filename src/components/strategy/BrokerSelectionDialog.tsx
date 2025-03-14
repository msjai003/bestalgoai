
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface BrokerAccount {
  id: string;
  name: string;
}

interface BrokerSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (brokerId: string) => void;
  onCancel: () => void;
}

export const BrokerSelectionDialog = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
}: BrokerSelectionDialogProps) => {
  const [selectedBroker, setSelectedBroker] = useState<string>("");
  const [brokerAccounts, setBrokerAccounts] = useState<BrokerAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Fetch user's integrated brokers
  useEffect(() => {
    const fetchBrokers = async () => {
      if (!user || !open) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('broker_credentials')
          .select('id, broker_name')
          .eq('user_id', user.id)
          .eq('status', 'active');
          
        if (error) throw error;
        
        const formattedBrokers = data.map(broker => ({
          id: broker.id,
          name: broker.broker_name
        }));
        
        setBrokerAccounts(formattedBrokers);
      } catch (error) {
        console.error('Error fetching broker accounts:', error);
        setBrokerAccounts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrokers();
  }, [user, open]);

  const handleConfirm = () => {
    if (selectedBroker) {
      onConfirm(selectedBroker);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Select Broker Account</DialogTitle>
          <DialogDescription className="text-gray-400">
            Please select one of your connected broker accounts to execute your trades.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-2">
            <label className="block text-white text-sm mb-1">
              Broker Account
            </label>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-10 bg-gray-700 rounded-md">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : brokerAccounts.length > 0 ? (
              <Select onValueChange={setSelectedBroker} value={selectedBroker}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-full">
                  <SelectValue placeholder="Select a broker account" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  {brokerAccounts.map((broker) => (
                    <SelectItem key={broker.id} value={broker.id}>
                      {broker.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="p-3 bg-gray-700 border border-gray-600 rounded-md text-center">
                <p className="text-gray-400 text-sm">No broker accounts connected</p>
                <a href="/broker-integration" className="text-blue-400 text-sm hover:underline mt-1 block">
                  Connect a broker account
                </a>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button 
            type="button" 
            variant="secondary" 
            className="bg-gray-700 hover:bg-gray-600 text-gray-200"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            className="bg-green-600 hover:bg-green-700"
            onClick={handleConfirm}
            disabled={!selectedBroker || isLoading || brokerAccounts.length === 0}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
