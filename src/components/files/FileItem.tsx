
import React, { useState, useEffect } from "react";
import { Download, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import PaymentDialog from "@/components/subscription/PaymentDialog";

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
  
  // Make zip files premium by default
  const isZipFile = type === "zip" || name.toLowerCase().endsWith('.zip');
  const isPremiumFile = is_premium || isZipFile;

  // Check if user has already paid for this premium file
  React.useEffect(() => {
    const checkPaymentStatus = async () => {
      if (user && isPremiumFile) {
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
  }, [user, id, isPremiumFile]);

  const canDownload = hasPremium || !isPremiumFile || hasPaid;

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

  const handleLockFile = async () => {
    if (!user) return;
    
    try {
      // Delete the payment record for this file
      const { error } = await supabase
        .from('user_file_payments')
        .delete()
        .eq('user_id', user.id)
        .eq('file_id', id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setHasPaid(false);
      
      toast({
        title: "File locked",
        description: `${name} has been locked again.`,
      });
    } catch (error) {
      console.error("Error locking file:", error);
      toast({
        title: "Error",
        description: "Could not lock the file. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-between py-3 px-2 border-b border-gray-800 last:border-0 hover:bg-charcoalPrimary/30 rounded-md transition-colors">
      <div className="flex flex-col">
        <div className="flex items-center">
          <span className="font-medium text-white">{name}</span>
          {isPremiumFile && !canDownload && (
            <Badge variant="destructive" className="ml-2">
              <Lock className="h-3 w-3 mr-1" />
              Locked
            </Badge>
          )}
          {isPremiumFile && hasPaid && (
            <Badge variant="success" className="ml-2">
              Paid
            </Badge>
          )}
        </div>
        <span className="text-sm text-gray-400">{size}</span>
      </div>
      
      {/* Show different buttons based on the file's status */}
      <div className="flex items-center gap-2">
        {hasPaid && (
          <Button
            onClick={handleLockFile}
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-500 hover:bg-transparent"
            title="Lock file again"
          >
            <Lock className="h-5 w-5" />
          </Button>
        )}
        
        {canDownload ? (
          <Button
            onClick={handleDownload}
            variant="ghost"
            size="sm"
            className="text-cyan hover:text-cyan hover:bg-transparent"
            disabled={downloadingId === id}
          >
            {downloadingId === id ? (
              <div className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin"></div>
            ) : (
              <Download className="h-5 w-5" />
            )}
          </Button>
        ) : (
          <Dialog open={openPaymentDialog} onOpenChange={setOpenPaymentDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-cyan hover:text-white hover:bg-cyan/80 border-cyan"
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
