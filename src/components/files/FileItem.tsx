
import React, { useState, useEffect } from "react";
import { Download, Lock, Unlock } from "lucide-react";
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

  // Check if this is one of our special files that should always be locked
  const isSpecialFile = name === "downloaded_bestalgoai-infocap-ai.zip" || name === "sample_v1.zip";
  
  // Always treat zip files and special files as premium content regardless of database setting
  const isZipFile = type === 'zip' || name.toLowerCase().endsWith('.zip');
  const isLockedFile = is_premium || isZipFile || isSpecialFile;

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

  // A file requires payment if it's locked and user doesn't have premium or hasn't paid specifically for this file
  const requiresPayment = isLockedFile && !hasPremium && !hasPaid;

  const handleDownload = async () => {
    if (requiresPayment) {
      setOpenPaymentDialog(true);
      return;
    }
    
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

  const handlePaymentSuccess = async () => {
    setHasPaid(true);
    setOpenPaymentDialog(false);
    
    // Record successful payment in database
    if (user) {
      await supabase.from('user_file_payments').insert({
        user_id: user.id,
        file_id: id,
        status: 'completed',
        amount: 1 // 1 rupee payment
      });
    }
    
    toast({
      title: "Payment successful",
      description: `You can now download ${name}`,
    });
    
    // Auto-trigger download after successful payment
    setTimeout(() => {
      window.open(url, '_blank');
    }, 1000);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 px-2 border-b border-gray-800 last:border-0 hover:bg-charcoalPrimary/30 rounded-md transition-colors">
      <div className="flex flex-col mb-2 sm:mb-0">
        <div className="flex items-center flex-wrap gap-2">
          <span className="font-medium text-white">{name}</span>
          {isLockedFile && requiresPayment && (
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
        {requiresPayment ? (
          <Dialog open={openPaymentDialog} onOpenChange={setOpenPaymentDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "sm"}
                className="text-cyan hover:text-white hover:bg-cyan/80 border-cyan w-full sm:w-auto flex items-center"
              >
                <Lock className="h-5 w-5 mr-1" />
                <span className="ml-1">Pay ₹1 to unlock</span>
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
        ) : (
          <Button
            onClick={handleDownload}
            variant="ghost"
            size={isMobile ? "sm" : "sm"}
            className="text-cyan hover:text-cyan hover:bg-transparent flex items-center"
            disabled={downloadingId === id}
          >
            <Download className="h-5 w-5" />
            <span className="ml-1 sm:ml-2">Download</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default FileItem;
