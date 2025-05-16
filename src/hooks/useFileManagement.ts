
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
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
          
          // Mark all files as premium regardless of type
          // This ensures all downloadable files require payment
          const isPremium = true;
          
          return {
            id: file.id,
            name: file.name,
            size: file.size || 'Unknown size',
            created_at: file.created_at,
            type: fileType,
            url: file.driveurl,
            bucket: "trading_files",
            is_premium: isPremium
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

  // Function to check if user has already paid for a specific file
  const checkFilePaidStatus = async (fileId: number) => {
    if (!userId) return false;
    
    try {
      const { data, error } = await supabase
        .from('user_file_payments')
        .select('*')
        .eq('user_id', userId)
        .eq('file_id', fileId)
        .eq('status', 'completed')
        .maybeSingle();
      
      if (error) {
        console.error("Error checking file payment status:", error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error("Exception checking file payment status:", error);
      return false;
    }
  };

  // Function to record a file payment
  const recordFilePayment = async (fileId: number) => {
    if (!userId) return false;
    
    try {
      const { error } = await supabase
        .from('user_file_payments')
        .insert({
          user_id: userId,
          file_id: fileId,
          status: 'completed',
          amount: 1 // 1 rupee payment
        });
      
      if (error) {
        console.error("Error recording file payment:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Exception recording file payment:", error);
      return false;
    }
  };

  return {
    files,
    isLoading,
    hasPremium,
    checkFilePaidStatus,
    recordFilePayment
  };
}
