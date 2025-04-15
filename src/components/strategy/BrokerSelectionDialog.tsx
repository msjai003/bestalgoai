
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserBrokers } from "@/hooks/strategy/useStrategyDatabase";

interface BrokerSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (brokerId: string, brokerName: string) => void;
  onCancel: () => void;
}

export const BrokerSelectionDialog = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
}: BrokerSelectionDialogProps) => {
  const [selectedBrokerId, setSelectedBrokerId] = useState<string>("");
  const [selectedBrokerName, setSelectedBrokerName] = useState<string>("");
  const [brokers, setBrokers] = useState<{ id: string; broker_name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadBrokers = async () => {
      if (!user || !open) return;
      
      setLoading(true);
      try {
        const userBrokers = await fetchUserBrokers(user.id);
        setBrokers(userBrokers);
        
        // Set default selection if brokers exist
        if (userBrokers.length > 0) {
          setSelectedBrokerId(userBrokers[0].id);
          setSelectedBrokerName(userBrokers[0].broker_name);
        }
      } catch (error) {
        console.error("Error loading brokers:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadBrokers();
  }, [user, open]);
  
  const handleConfirm = () => {
    if (!selectedBrokerId) return;
    onConfirm(selectedBrokerId, selectedBrokerName);
  };
  
  const handleSelectChange = (value: string) => {
    setSelectedBrokerId(value);
    const broker = brokers.find(b => b.id === value);
    if (broker) {
      setSelectedBrokerName(broker.broker_name);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-charcoalSecondary border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Select Broker</DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose which broker to use for live trading
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="py-4 flex justify-center">
            <Loader className="h-6 w-6 animate-spin text-cyan" />
          </div>
        ) : brokers.length > 0 ? (
          <div className="py-4">
            <Select value={selectedBrokerId} onValueChange={handleSelectChange}>
              <SelectTrigger className="w-full bg-charcoalPrimary/70 border-gray-600 text-white">
                <SelectValue placeholder="Select a broker" />
              </SelectTrigger>
              <SelectContent className="bg-charcoalSecondary border-gray-700 text-white">
                {brokers.map((broker) => (
                  <SelectItem 
                    key={broker.id} 
                    value={broker.id}
                    className="text-white hover:bg-gray-700 cursor-pointer"
                  >
                    {broker.broker_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="py-4">
            <p className="text-center text-red-400">No connected brokers found</p>
            <p className="text-center text-xs text-gray-400 mt-1">
              Please connect a broker in your account settings first
            </p>
          </div>
        )}
        
        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button 
            variant="secondary" 
            className="text-gray-200"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            variant="cyan"
            onClick={handleConfirm}
            disabled={brokers.length === 0 || !selectedBrokerId}
          >
            Confirm Selection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
