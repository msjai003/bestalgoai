
import React, { useState, useEffect } from "react";
import { Download, Lock, IndianRupee, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PaymentDialog from "@/components/subscription/PaymentDialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

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
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [hasJustPaid, setHasJustPaid] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("razorpay");

  // Check if user has already paid for this premium file
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

  const isPremiumFile = is_premium;
  const canDownload = hasJustPaid || hasPaid || hasPremium || !isPremiumFile;

  const handlePaymentClick = () => {
    // Open the dropdown instead of directly showing payment dialog
    if (isPremiumFile && !hasPremium && !hasJustPaid && !hasPaid) {
      setPaymentDialogOpen(true);
    }
  };

  const handleDownload = async () => {
    // For premium files, check payment status
    if (isPremiumFile && !hasPremium && !hasJustPaid && !hasPaid) {
      // Show payment options dropdown
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
    setPaymentDialogOpen(false);
    setHasJustPaid(true);
    
    // Record the payment in the database
    if (user) {
      try {
        await supabase.from('user_file_payments').insert({
          user_id: user.id,
          file_id: id,
          amount: 1.00,
          status: 'completed'
        });
        
        setHasPaid(true);
        
        toast({
          title: "Payment Successful",
          description: `${name} is now available for download.`,
          variant: "default",
        });
      } catch (error) {
        console.error("Error recording payment:", error);
        toast({
          title: "Error",
          description: "Payment was processed but couldn't be recorded. Please contact support.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-between py-3 px-2 border-b border-gray-800 last:border-0 hover:bg-charcoalPrimary/30 rounded-md transition-colors">
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="font-medium text-white">{name}</span>
            {isPremiumFile && (hasJustPaid || hasPaid) && (
              <Badge variant="success" className="ml-2">
                Paid
              </Badge>
            )}
          </div>
          <span className="text-sm text-gray-400">{size}</span>
        </div>
        
        {!canDownload ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-400 hover:text-purple-300 hover:bg-transparent"
              >
                <div className="flex items-center">
                  <IndianRupee className="h-4 w-4 mr-1" />
                  <span>1</span>
                  <Lock className="h-4 w-4 ml-1" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-charcoalSecondary border border-gray-700 text-white">
              <DropdownMenuGroup>
                <DropdownMenuItem 
                  onClick={() => {
                    setPaymentMethod("razorpay");
                    setPaymentDialogOpen(true);
                  }}
                  className="hover:bg-charcoalPrimary/50"
                >
                  <CreditCard className="mr-2 h-4 w-4 text-purple-400" />
                  <span>Pay with Razorpay</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    setPaymentMethod("card");
                    setPaymentDialogOpen(true);
                  }}
                  className="hover:bg-charcoalPrimary/50"
                >
                  <CreditCard className="mr-2 h-4 w-4 text-cyan" />
                  <span>Pay with Card</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
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
        )}
      </div>
      
      {paymentDialogOpen && (
        <PaymentDialog
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          planName="File Access"
          planPrice="₹1"
          onSuccess={handlePaymentSuccess}
          paymentMethod={paymentMethod}
        />
      )}
    </>
  );
};

export default FileItem;
