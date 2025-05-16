
import React, { useState, useEffect } from "react";
import { Download, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/auth/AuthContext";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import PaymentDialog from "@/components/subscription/PaymentDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

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
  const [openPaymentAlert, setOpenPaymentAlert] = useState(false);
  const isMobile = useIsMobile();

  // Check if this is a zip file
  const isZipFile = type === 'zip' || name.toLowerCase().endsWith('.zip');
  
  // Only zip files require payment
  const isLockedFile = isZipFile;

  // Check if user has already paid for this file
  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (user && isLockedFile) {
        try {
          const { data, error } = await supabase
            .from('user_file_payments')
            .select('*')
            .eq('user_id', user.id)
            .eq('file_id', id)
            .eq('status', 'completed')
            .maybeSingle();
          
          if (error) {
            console.error("Error checking payment status:", error);
          } else if (data) {
            setHasPaid(true);
          }
        } catch (err) {
          console.error("Exception checking payment status:", err);
        }
      }
    };
    
    checkPaymentStatus();
  }, [user, id, isLockedFile]);

  // A file requires payment if it's locked and user doesn't have premium or hasn't paid specifically for this file
  const requiresPayment = isLockedFile && !hasPremium && !hasPaid;

  const showPaymentPrompt = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access premium files",
        variant: "destructive",
      });
      return;
    }
    // Show payment alert first
    setOpenPaymentAlert(true);
  };

  const handlePayment = () => {
    setOpenPaymentAlert(false);
    setOpenPaymentDialog(true);
  };

  const handleDownload = async () => {
    // If the file requires payment, open payment alert
    if (requiresPayment) {
      showPaymentPrompt();
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
      try {
        const { error } = await supabase.from('user_file_payments').insert({
          user_id: user.id,
          file_id: id,
          status: 'completed',
          amount: 1 // 1 rupee payment
        });
        
        if (error) {
          console.error("Error recording payment:", error);
          toast({
            title: "Payment recording failed",
            description: "Payment was successful but we couldn't record it. Please contact support.",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Exception recording payment:", err);
      }
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
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 px-2 border-b border-gray-800 last:border-0 hover:bg-charcoalPrimary/30 rounded-md transition-colors">
        <div className="flex flex-col mb-2 sm:mb-0">
          <div className="flex items-center flex-wrap gap-2">
            <span className="font-medium text-white">{name}</span>
            {isZipFile && (
              <Badge variant="outline" className="ml-0 sm:ml-2">
                ZIP
              </Badge>
            )}
          </div>
          <span className="text-sm text-gray-400">{size}</span>
        </div>
        
        <div className="flex items-center gap-2 mt-1 sm:mt-0">
          <Dialog open={openPaymentDialog} onOpenChange={setOpenPaymentDialog}>
            {isZipFile && (
              <>
                {requiresPayment ? (
                  <Badge variant="destructive" className="flex items-center gap-1 mr-2">
                    <Lock className="h-3.5 w-3.5" />
                    <span>Locked</span>
                  </Badge>
                ) : (
                  hasPaid && (
                    <Badge variant="success" className="flex items-center gap-1 mr-2">
                      <span>Unlocked</span>
                    </Badge>
                  )
                )}
              </>
            )}
            
            {isZipFile && requiresPayment ? (
              <Button
                onClick={showPaymentPrompt}
                variant="outline" 
                size={isMobile ? "sm" : "sm"}
                className="bg-cyan hover:bg-cyan/80 text-white"
              >
                <span>Unlock</span>
              </Button>
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
        </div>
      </div>

      {/* Payment Alert Dialog */}
      <AlertDialog open={openPaymentAlert} onOpenChange={setOpenPaymentAlert}>
        <AlertDialogContent className="bg-charcoalSecondary border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Premium Content</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              This file is locked and requires a one-time payment of ₹1 to access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogAction onClick={() => setOpenPaymentAlert(false)} className="bg-gray-700 hover:bg-gray-600 text-white">
              Cancel
            </AlertDialogAction>
            <AlertDialogAction onClick={handlePayment} className="bg-cyan hover:bg-cyan/80 text-white">
              Proceed to Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FileItem;
