
import React, { useState } from "react";
import { Download, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [showSuccessImage, setShowSuccessImage] = useState(false);

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
    setShowSuccessImage(true);
    
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
        // Hide success image after 5 seconds
        setTimeout(() => {
          setShowSuccessImage(false);
        }, 5000);
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
            <Download className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      {showSuccessImage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-charcoalSecondary rounded-lg p-4 max-w-md w-full text-center relative">
            <button 
              onClick={() => setShowSuccessImage(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              ×
            </button>
            <h3 className="text-xl font-bold text-white mb-4">Payment Successful!</h3>
            <div className="flex justify-center mb-4">
              <img 
                src="/public/lovable-uploads/08728724-393e-42b7-bd7b-de74eb6bae04.png" 
                alt="Trading interface" 
                className="rounded-lg w-full max-w-sm"
              />
            </div>
            <p className="text-green-400 mb-4">Your file download will begin shortly...</p>
            <Button
              onClick={() => setShowSuccessImage(false)}
              className="bg-cyan hover:bg-cyan/80"
            >
              Close
            </Button>
          </div>
        </div>
      )}
      
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
