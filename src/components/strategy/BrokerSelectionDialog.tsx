
import React, { useEffect, useState } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Fetch available brokers from the database
  useEffect(() => {
    const fetchBrokers = async () => {
      if (!user || !open) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('broker_credentials')
          .select('id, broker_name')
          .eq('user_id', user.id)
          .eq('status', 'connected');
          
        if (error) throw error;
        
        setBrokers(data || []);
        // Set default selection if brokers exist
        if (data && data.length > 0) {
          setSelectedBroker(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching brokers:', error);
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
          <DialogTitle className="text-xl">Select Broker</DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose a broker to use with this strategy
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : brokers.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-gray-400 mb-4">No connected brokers found.</p>
            <Button 
              variant="outline" 
              className="border-blue-500 text-blue-400 hover:bg-blue-900/20"
              onClick={() => {
                onCancel();
                // This will navigate to broker integration page
                window.location.href = '/broker-integration';
              }}
            >
              Connect a Broker
            </Button>
          </div>
        ) : (
          <div className="py-4">
            <Select value={selectedBroker} onValueChange={setSelectedBroker}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select a broker" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-white">
                {brokers.map((broker) => (
                  <SelectItem key={broker.id} value={broker.id}>
                    {broker.broker_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {brokers.length > 0 && (
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
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              onClick={handleConfirm}
              disabled={!selectedBroker}
            >
              OK
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
