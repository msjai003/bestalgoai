
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import FileTypeBadge from "@/components/files/FileTypeBadge";
import FileActions from "@/components/files/FileActions";
import FileStatusBadge from "@/components/files/FileStatusBadge";
import FilePaymentAlert from "@/components/files/FilePaymentAlert";
import PaymentDialog from "@/components/subscription/PaymentDialog";
import { useFileManagement } from "@/hooks/useFileManagement";

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
  const isMobile = useIsMobile();
  
  // Payment states
  const [showPaymentAlert, setShowPaymentAlert] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  
  const { checkFilePaidStatus } = useFileManagement(user?.id);
  
  // Check if this is a ZIP file that requires premium access
  const isLockedFile = type === 'zip' && is_premium;
  
  // Check if the user has already paid for this file
  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (user && isLockedFile) {
        const paid = await checkFilePaidStatus(id);
        setHasPaid(paid);
      }
    };
    
    checkPaymentStatus();
  }, [user, id, isLockedFile, checkFilePaidStatus]);

  const handleDownload = async () => {
    // If this is a locked file and user hasn't paid, show payment alert
    if (isLockedFile && !hasPaid) {
      setShowPaymentAlert(true);
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
  
  const handleProceedToPayment = () => {
    setShowPaymentAlert(false);
    setShowPaymentDialog(true);
  };
  
  const handlePaymentSuccess = () => {
    setShowPaymentDialog(false);
    setHasPaid(true);
    toast({
      title: "Payment successful",
      description: `${name} is now unlocked and ready for download.`,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 px-2 border-b border-gray-800 last:border-0 hover:bg-charcoalPrimary/30 rounded-md transition-colors">
      <div className="flex flex-col mb-2 sm:mb-0">
        <div className="flex items-center flex-wrap gap-2">
          <FileStatusBadge 
            isLockedFile={isLockedFile} 
            requiresPayment={!hasPaid} 
            hasPaid={hasPaid} 
          />
          <span className="font-medium text-white">{name}</span>
          <FileTypeBadge type={type} name={name} />
        </div>
        <span className="text-sm text-gray-400">{size}</span>
      </div>
      
      <div className="flex items-center gap-2 mt-1 sm:mt-0">
        <FileActions 
          onDownload={handleDownload}
          isDownloading={downloadingId === id}
          isMobile={isMobile}
        />
      </div>
      
      <FilePaymentAlert
        open={showPaymentAlert}
        onOpenChange={setShowPaymentAlert}
        onProceed={handleProceedToPayment}
      />
      
      <PaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        planName={name}
        planPrice="₹1"
        onSuccess={handlePaymentSuccess}
        fileId={id}
      />
    </div>
  );
};

export default FileItem;
