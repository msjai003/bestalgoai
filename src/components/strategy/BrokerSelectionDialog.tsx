
import React, { useState } from "react";
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

// Mock broker accounts - replace with actual data in production
const BROKER_ACCOUNTS = [
  { id: "zerodha1", name: "Zerodha" },
  { id: "upstox1", name: "Upstox" },
  { id: "angel1", name: "Angel One" },
  { id: "groww1", name: "Groww" },
];

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
            Please select a broker account to execute your trades.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-2">
            <label className="block text-white text-sm mb-1">
              Broker Account
            </label>
            <Select onValueChange={setSelectedBroker} value={selectedBroker}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-full">
                <SelectValue placeholder="Select a broker account" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-white">
                {BROKER_ACCOUNTS.map((broker) => (
                  <SelectItem key={broker.id} value={broker.id}>
                    {broker.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            disabled={!selectedBroker}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
