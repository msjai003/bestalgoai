
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { FileArchive, Loader, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase/client";
import FileItem from "@/components/files/FileItem";
import { checkUserPremiumStatus } from "@/lib/supabase/subscription";
import { useAuth } from "@/contexts/AuthContext";
import PaymentDialog from "@/components/subscription/PaymentDialog";
import { Button } from "@/components/ui/button";

interface FileItem {
  id: number;
  name: string;
  size: string;
  created_at: string;
  type: string;
  url: string;
  bucket: string;
}

const Files = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPremium, setHasPremium] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [showSuccessImage, setShowSuccessImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  useEffect(() => {
    const checkPremium = async () => {
      if (user) {
        const isPremium = await checkUserPremiumStatus(user.id);
        setHasPremium(isPremium);
        return isPremium;
      }
      return false;
    };
    
    const loadData = async () => {
      const isPremium = await checkPremium();
      await fetchFiles(isPremium);
    };
    
    loadData();
  }, [user]);

  const fetchFiles = async (isPremium = false) => {
    try {
      setIsLoading(true);
      
      // Fetch executable files from exe_files table
      const { data: exeFiles, error: exeError } = await supabase
        .from('exe_files')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (exeError) {
        console.error("Error fetching executable files:", exeError);
        toast({
          title: "Error fetching files",
          description: "Could not load files. Please try again later.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      console.log("Files data received:", exeFiles);
      
      // Format the data to match the FileItem interface
      const formattedFiles = exeFiles
        .map(file => {
          // Get file type
          let fileType = 'unknown';
          const extension = file.type.toLowerCase();
          
          if (extension === 'pdf') fileType = 'pdf';
          else if (['doc', 'docx'].includes(extension)) fileType = 'docx';
          else if (['zip', 'rar', '7z'].includes(extension)) fileType = 'zip';
          else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) fileType = 'image';
          else if (['exe', 'msi'].includes(extension)) fileType = 'exe';
          else if (['xlsx', 'xls', 'csv'].includes(extension)) fileType = 'xlsx';
          
          return {
            id: file.id,
            name: file.name,
            size: file.size || 'Unknown size',
            created_at: file.created_at,
            type: fileType,
            url: file.driveurl,
            bucket: "trading_files"
          };
        });
      
      setFiles(formattedFiles);
      
      // Find if there are any ZIP files at all
      const zipFiles = formattedFiles.filter(file => file.type === 'zip');
      if (zipFiles.length > 0 && !isPremium) {
        setSelectedFile(zipFiles[0]);
        setPaymentDialogOpen(true);
      }
    } catch (error) {
      console.error("Exception fetching files:", error);
      toast({
        title: "Error fetching files",
        description: "Could not load file list. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePaymentSuccess = () => {
    setPaymentDialogOpen(false);
    setShowSuccessImage(true);
    
    // Hide success image after 5 seconds
    setTimeout(() => {
      setShowSuccessImage(false);
      // Refresh premium status
      checkUserPremiumStatus(user?.id || '').then(isPremium => {
        setHasPremium(isPremium);
      });
    }, 5000);
  };

  // Filter out ZIP files for non-premium users
  const displayFiles = files.filter(file => 
    hasPremium ? true : file.type !== 'zip'
  );

  // Check if there are ZIP files that are hidden
  const hasHiddenZipFiles = files.length > displayFiles.length;

  if (isLoading) {
    return (
      <div className="bg-charcoalPrimary min-h-screen">
        <Header />
        <main className="pt-16 pb-20 px-4 flex items-center justify-center">
          <div className="text-center">
            <Loader className="h-8 w-8 animate-spin text-cyan mx-auto mb-4" />
            <p className="text-gray-300">Loading files...</p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="bg-charcoalPrimary min-h-screen">
      <Header />
      <main className="pt-16 pb-20 px-4">
        <div className="mt-4 mb-6">
          <h1 className="text-2xl font-semibold text-white">Files</h1>
          <p className="text-gray-400 mt-1">Download trading resources and templates</p>
        </div>

        <div className="bg-charcoalSecondary rounded-lg p-4">
          <h2 className="text-lg font-medium text-white mb-4">Trading Files</h2>

          {displayFiles.length === 0 ? (
            <div className="text-center py-8 flex flex-col items-center justify-center">
              <FileArchive className="h-12 w-12 mb-3 text-gray-500" />
              <p className="text-gray-400">Check back later for available files</p>
            </div>
          ) : (
            <div className="space-y-1">
              {displayFiles.map((file) => (
                <FileItem
                  key={file.id}
                  id={file.id}
                  name={file.name}
                  size={file.size}
                  type={file.type}
                  url={file.url}
                  created_at={file.created_at}
                  bucket={file.bucket}
                  hasPremium={hasPremium}
                />
              ))}
            </div>
          )}
          
          {/* Premium files notice */}
          {hasHiddenZipFiles && !hasPremium && (
            <div className="mt-6 border-t border-gray-700 pt-4">
              <div className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 p-4 rounded-lg flex flex-col items-center">
                <Lock className="h-8 w-8 text-cyan mb-2" />
                <h3 className="text-lg font-medium text-white">Premium ZIP Files Available</h3>
                <p className="text-gray-300 text-center mb-3">
                  {files.length - displayFiles.length} ZIP file(s) are available with a premium subscription
                </p>
                <Button 
                  onClick={() => setPaymentDialogOpen(true)} 
                  className="bg-cyan hover:bg-cyan/80"
                >
                  Upgrade to Pro
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
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
            <p className="text-green-400 mb-4">All ZIP files are now unlocked!</p>
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
      
      <BottomNav />
    </div>
  );
};

export default Files;
