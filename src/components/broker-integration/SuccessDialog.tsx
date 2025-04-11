
import { Check, Plug, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Broker, BrokerPermissions } from "@/types/broker";
import { useEffect, useState } from "react";
import { getBrokerImageUrl } from "@/utils/brokerImageUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchBrokerDetails = async () => {
      if (selectedBroker && open) {
        try {
          setIsImageLoading(true);
          setImageError(false);
          
          // Get broker image from broker_profile_images table
          const imageUrl = await getBrokerImageUrl(selectedBroker.id);
          
          if (imageUrl) {
            console.log("Retrieved broker image from database:", imageUrl);
            setBrokerImage(imageUrl);
          } else {
            console.log("Using fallback broker image:", selectedBroker.logo);
            setBrokerImage(selectedBroker.logo);
          }
          
          setBrokerName(selectedBroker.name);
        } catch (error) {
          console.error("Error fetching broker details:", error);
          setImageError(true);
          setBrokerName(selectedBroker.name);
          setBrokerImage(selectedBroker.logo);
        } finally {
          setIsImageLoading(false);
        }
      }
    };
    
    fetchBrokerDetails();
  }, [selectedBroker, open]);

  const displayName = brokerName || (selectedBroker ? selectedBroker.name : '');
  const fallbackInitial = displayName ? displayName.charAt(0).toUpperCase() : '?';

  const handleImageError = () => {
    console.log("Image failed to load, using fallback");
    setImageError(true);
  };

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
            <Avatar className="w-8 h-8 mr-3">
              {brokerImage && !imageError ? (
                <AvatarImage 
                  src={brokerImage}
                  alt={displayName}
                  onError={handleImageError}
                />
              ) : null}
              <AvatarFallback className="bg-gray-700 text-gray-300">
                {isImageLoading ? "..." : fallbackInitial}
              </AvatarFallback>
            </Avatar>
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
