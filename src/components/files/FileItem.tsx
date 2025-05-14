
import React, { useState, useEffect } from "react";
import { Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import PaymentDialog from "@/components/subscription/PaymentDialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface FileItemProps {
  id: number;
  name: string;
  size: string;
  type: string;
  url: string;
  created_at: string;
  bucket: string;
  hasPremium: boolean;
  is_premium: boolean;
}

const FileItem = ({
  id,
  name,
  size,
  type,
  created_at,
  bucket,
  hasPremium,
  is_premium,
}: FileItemProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [hasPaid, setHasPaid] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const isMobile = useIsMobile();

  // Ensure zip files are always locked
  const isZipFile = type === 'zip' || name.toLowerCase().endsWith('.zip');
  const isLockedFile = is_premium || isZipFile;

  // Check if user has already paid for this file
  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (user && isLockedFile) {
        const { data } = await supabase
          .from('user_file_payments')
          .select('*')
          .eq('user_id', user.id)
          .eq('file_id', id)
          .eq('status', 'completed')
          .maybeSingle();
        
        if (data) {
          setHasPaid(true);
        }
      }
    };
    
    checkPaymentStatus();
  }, [user, id, isLockedFile]);

  // A file can be downloaded if user has premium subscription OR has paid for this specific file
  const canDownload = hasPremium || !isLockedFile || hasPaid;

  const handlePaymentSuccess = () => {
    setHasPaid(true);
    setOpenPaymentDialog(false);
    toast({
      title: "Payment successful",
      description: `You can now access ${name}`,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 px-4 border-b border-gray-800 last:border-0 hover:bg-charcoalPrimary/30 rounded-md transition-colors">
      <div className="flex flex-col mb-2 sm:mb-0">
        <div className="flex items-center flex-wrap gap-2">
          <span className="font-medium text-white">{name}</span>
          {isLockedFile && !canDownload && (
            <Badge variant="destructive" className="ml-0 sm:ml-2 flex items-center gap-1">
              <Lock className="h-3.5 w-3.5" />
              <span>Locked</span>
            </Badge>
          )}
          {isLockedFile && hasPaid && (
            <Badge variant="success" className="ml-0 sm:ml-2 flex items-center gap-1">
              <Unlock className="h-3.5 w-3.5" />
              <span>Paid</span>
            </Badge>
          )}
          {isZipFile && (
            <Badge variant="outline" className="ml-0 sm:ml-2">
              ZIP
            </Badge>
          )}
        </div>
        <span className="text-sm text-gray-400">{size}</span>
      </div>
      
      <div className="flex items-center gap-2 mt-1 sm:mt-0">
        {canDownload ? (
          // Show unlock icon when user can access
          <div className="text-green-500 p-2 bg-green-500/10 rounded-full hover:bg-green-500/20 transition-colors">
            <Unlock className="h-6 w-6" />
          </div>
        ) : (
          // Show lock icon with payment trigger for locked files
          <Dialog open={openPaymentDialog} onOpenChange={setOpenPaymentDialog}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-white hover:bg-red-500/30 rounded-full p-2"
              >
                <Lock className="h-6 w-6" />
              </Button>
            </DialogTrigger>
            <PaymentDialog
              open={openPaymentDialog}
              onOpenChange={setOpenPaymentDialog}
              planName={`File: ${name}`}
              planPrice="₹1"
              onSuccess={handlePaymentSuccess}
              paymentMethod="razorpay"
              fileId={id}
            />
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default FileItem;
