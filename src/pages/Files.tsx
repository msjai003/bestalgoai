
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { FileArchive, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase/client";
import FileItem from "@/components/files/FileItem";
import { checkUserPremiumStatus } from "@/lib/supabase/subscription";
import { useAuth } from "@/contexts/AuthContext";

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

  useEffect(() => {
    const checkPremium = async () => {
      if (user) {
        const isPremium = await checkUserPremiumStatus(user.id);
        setHasPremium(isPremium);
      }
    };
    
    checkPremium();
    fetchFiles();
  }, [user]);

  const fetchFiles = async () => {
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
        })
        // Filter out zip files for non-premium users
        .filter(file => {
          // If zip file, only show to premium users
          if (file.type === 'zip') {
            return hasPremium;
          }
          // Show all other files to all users
          return true;
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

          {files.length === 0 ? (
            <div className="text-center py-8 flex flex-col items-center justify-center">
              <FileArchive className="h-12 w-12 mb-3 text-gray-500" />
              <p className="text-gray-400">Check back later for available files</p>
            </div>
          ) : (
            <div className="space-y-1">
              {files.map((file) => (
                <FileItem
                  key={file.id}
                  id={file.id}
                  name={file.name}
                  size={file.size}
                  type={file.type}
                  url={file.url}
                  created_at={file.created_at}
                  bucket={file.bucket}
                />
              ))}
            </div>
          )}
          
          {!hasPremium && (
            <div className="mt-6 p-4 bg-charcoalPrimary border border-cyan/20 rounded-lg">
              <h3 className="text-white font-medium mb-2">Premium Content</h3>
              <p className="text-gray-400 text-sm mb-3">
                Subscribe to our premium plan to access additional ZIP archives and resources.
              </p>
              <button 
                onClick={() => window.location.href = '/subscription'}
                className="bg-cyan/90 text-white px-4 py-2 rounded-md text-sm hover:bg-cyan transition-colors"
              >
                Upgrade Now
              </button>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Files;
