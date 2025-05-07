
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { checkUserPremiumStatus } from "@/lib/supabase/subscription";

interface FileItem {
  id: number;
  name: string;
  size: string;
  created_at: string;
  type: string;
  url: string;
  bucket: string;
  is_premium: boolean;
}

export function useFileManagement(userId?: string) {
  const { toast } = useToast();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPremium, setHasPremium] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [showSuccessImage, setShowSuccessImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  useEffect(() => {
    const checkPremium = async () => {
      if (userId) {
        const isPremium = await checkUserPremiumStatus(userId);
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
  }, [userId]);

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
            bucket: "trading_files",
            is_premium: file.is_premium || false
          };
        });
      
      setFiles(formattedFiles);
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
      checkUserPremiumStatus(userId || '').then(isPremium => {
        setHasPremium(isPremium);
      });
    }, 5000);
  };

  // Check if there are premium files
  const hasPremiumFiles = files.some(file => file.is_premium);

  return {
    files,
    isLoading,
    hasPremium,
    paymentDialogOpen,
    setPaymentDialogOpen,
    showSuccessImage,
    setShowSuccessImage,
    selectedFile,
    hasPremiumFiles,
    handlePaymentSuccess
  };
}
