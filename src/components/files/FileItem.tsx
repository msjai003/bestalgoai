
import React, { useState } from "react";
import { Download, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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
}: FileItemProps) => {
  const { toast } = useToast();
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const isPremiumFile = type === 'zip';

  const handleDownload = async () => {
    // For ZIP files, always check premium status
    if (isPremiumFile && !hasPremium) {
      setPaymentDialogOpen(true);
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

  const handlePaymentSuccess = () => {
    setPaymentDialogOpen(false);
    
    // After successful payment, start the download
    setTimeout(() => {
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
    }, 1000); // Small delay before starting download
  };

  return (
    <>
      <div className="flex items-center justify-between py-3 px-2 border-b border-gray-800 last:border-0 hover:bg-charcoalPrimary/30 rounded-md transition-colors">
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="font-medium text-white">{name}</span>
            {isPremiumFile && !hasPremium && (
              <span className="ml-2 px-2 py-0.5 bg-purple-900/50 text-purple-200 text-xs rounded-full flex items-center">
                <Lock className="h-3 w-3 mr-1" />
                Premium
              </span>
            )}
          </div>
          <span className="text-sm text-gray-400">{size}</span>
        </div>
        <Button
          onClick={handleDownload}
          variant="ghost"
          size="sm"
          className={`${isPremiumFile && !hasPremium ? 'text-purple-400 hover:text-purple-300' : 'text-cyan hover:bg-transparent'}`}
          disabled={downloadingId === id}
        >
          {downloadingId === id ? (
            <div className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin"></div>
          ) : (
            isPremiumFile && !hasPremium ? (
              <Lock className="h-5 w-5" />
            ) : (
              <Download className="h-5 w-5" />
            )
          )}
        </Button>
      </div>
      
      {paymentDialogOpen && (
        <PaymentDialog
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          planName="Pro"
          planPrice="₹999"
          onSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
};

export default FileItem;
