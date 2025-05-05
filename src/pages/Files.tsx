
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { FileArchive, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/auth/AuthContext";
import { Loader } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FileItem {
  id: number;
  file_name: string;
  file_size: string;
  file_path: string;
  added_at: string;
  file_type: string;
  download_count: number;
}

const Files = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setIsLoading(true);
        setDownloadError(null);
        const { data, error } = await supabase
          .from('downloadable_files')
          .select('*')
          .order('added_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching files:", error);
          toast({
            title: "Error fetching files",
            description: "Could not load file list. Please try again later.",
            variant: "destructive",
          });
        } else {
          setFiles(data || []);
        }
      } catch (error) {
        console.error("Exception fetching files:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, [toast]);

  const verifyFileValidity = async (url: string): Promise<boolean> => {
    try {
      // For remote URLs, attempt to fetch headers to verify the file exists
      if (url.startsWith('http')) {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
      }
      // For local files, we'll assume they exist (can't verify easily)
      return true;
    } catch (error) {
      console.error("Error verifying file:", error);
      return false;
    }
  };

  const handleDownload = async (file: FileItem) => {
    setDownloadingId(file.id);
    setDownloadError(null);
    
    try {
      // First verify the file exists and is accessible
      const fileUrl = file.file_path.startsWith('http') 
        ? file.file_path 
        : file.file_path.startsWith('/') 
          ? file.file_path 
          : `/${file.file_path}`;
      
      const isValid = await verifyFileValidity(fileUrl);
      
      if (!isValid) {
        setDownloadError(`The file "${file.file_name}" appears to be inaccessible or corrupted. Please contact support.`);
        return;
      }
      
      // Create a download link and trigger download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = file.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Increment download count
      const { error } = await supabase
        .from('downloadable_files')
        .update({ download_count: (file.download_count || 0) + 1 })
        .eq('id', file.id);
      
      if (error) {
        console.error("Error updating download count:", error);
      }
      
      toast({
        title: "Download started",
        description: `${file.file_name} is being downloaded. If you encounter any issues extracting the file, please try using WinZip, 7-Zip, or contact support.`,
      });
    } catch (error) {
      console.error("Error during download:", error);
      setDownloadError(`Failed to download "${file.file_name}". Please try again later.`);
      toast({
        title: "Download failed",
        description: "Could not download the file. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setDownloadingId(null);
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

        {downloadError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Download Error</AlertTitle>
            <AlertDescription>{downloadError}</AlertDescription>
          </Alert>
        )}

        <div className="bg-charcoalSecondary rounded-lg p-4">
          {files.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <FileArchive className="h-10 w-10 mx-auto mb-2 text-gray-500" />
              <p>No files available for download</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-400 mb-4">
                Note: If you experience issues extracting downloaded files, we recommend using 7-Zip or WinRAR latest versions.
              </p>
              
              {files.map((file) => (
                <div 
                  key={file.id} 
                  className="flex items-center justify-between py-3 px-2 border-b border-gray-800 last:border-0"
                >
                  <div className="flex items-center">
                    <div className="bg-charcoalPrimary/60 p-2 rounded-lg mr-3">
                      <FileArchive className="h-5 w-5 text-cyan" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{file.file_name}</h3>
                      <div className="flex space-x-3 text-xs text-gray-400">
                        <span>{file.file_size}</span>
                        <span>Added: {new Date(file.added_at).toLocaleDateString()}</span>
                        <span>Format: {file.file_type || "Unknown"}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDownload(file)}
                    variant="outline"
                    size="sm"
                    className="text-cyan border-cyan hover:bg-cyan hover:text-charcoalPrimary"
                    disabled={downloadingId === file.id}
                  >
                    {downloadingId === file.id ? (
                      <div className="flex items-center">
                        <div className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin mr-2"></div>
                        <span>Downloading...</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        <span>Download</span>
                      </div>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Files;
