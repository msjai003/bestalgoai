
import React, { useState, useEffect } from "react";
import { Download, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase/client";
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
  url,
  created_at,
  bucket,
  hasPremium,
  is_premium,
}: FileItemProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const isMobile = useIsMobile();

  // Check if user has already paid for this file
  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (user && is_premium) {
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
  }, [user, id, is_premium]);

  // A file can be downloaded if user has premium subscription OR has paid for this specific file
  const canDownload = hasPremium || !is_premium || hasPaid;

  const handleDownload = async () => {
    setDownloadingId(id);
    
    try {
      // Open Google Drive link in a new tab
      window.open(url, '_blank');
      
      toast({
        title: "Download link opened",
        description: `${name} is being downloaded from Google Drive.`,
      });
    } catch (error) {
      console.error("Error during download:", error);
      toast({
        title: "Download failed",
        description: "Could not open the download link. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePaymentSuccess = () => {
    setHasPaid(true);
    setOpenPaymentDialog(false);
    toast({
      title: "Payment successful",
      description: `You can now download ${name}`,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 px-2 border-b border-gray-800 last:border-0 hover:bg-charcoalPrimary/30 rounded-md transition-colors">
      <div className="flex flex-col mb-2 sm:mb-0">
        <div className="flex items-center flex-wrap gap-1">
          <span className="font-medium text-white">{name}</span>
          {is_premium && !canDownload && (
            <Badge variant="destructive" className="ml-0 sm:ml-2">
              <Lock className="h-3 w-3 mr-1" />
              Locked
            </Badge>
          )}
          {is_premium && hasPaid && (
            <Badge variant="success" className="ml-0 sm:ml-2">
              <Unlock className="h-3 w-3 mr-1" />
              Paid
            </Badge>
          )}
        </div>
        <span className="text-sm text-gray-400">{size}</span>
      </div>
      
      {/* Only show download button if file is accessible, otherwise show unlock button */}
      <div className="flex items-center gap-2 mt-1 sm:mt-0">
        {canDownload ? (
          <Button
            onClick={handleDownload}
            variant="ghost"
            size={isMobile ? "sm" : "sm"}
            className="text-cyan hover:text-cyan hover:bg-transparent"
            disabled={downloadingId === id}
          >
            <Download className="h-5 w-5" />
            <span className="ml-1 sm:ml-2">Download</span>
          </Button>
        ) : (
          <Dialog open={openPaymentDialog} onOpenChange={setOpenPaymentDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "sm"}
                className="text-cyan hover:text-white hover:bg-cyan/80 border-cyan w-full sm:w-auto"
              >
                <Lock className="h-4 w-4 mr-1" />
                Unlock
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
