
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { FileArchive, Download, AlertTriangle, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth/AuthContext";
import { Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FileItem {
  id: number;
  file_name: string;
  file_size: string;
  file_path: string;
  added_at: string;
  file_type: string;
  download_count?: number;
}

const Files = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorDetails, setErrorDetails] = useState({
    fileName: "",
    errorType: "",
  });

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setIsLoading(true);
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

  const handleDownload = async (file: FileItem) => {
    setDownloadingId(file.id);
    
    try {
      // Create a download link and trigger download
      const link = document.createElement('a');
      
      // Enhanced path handling
      let downloadUrl = '';
      
      // Check if this is a full URL
      if (file.file_path.startsWith('http')) {
        downloadUrl = file.file_path;
      } else {
        // For relative paths, ensure they start with a slash
        downloadUrl = file.file_path.startsWith('/') 
          ? file.file_path 
          : `/${file.file_path}`;
      }
      
      console.log(`Attempting to download file from: ${downloadUrl}`);
      link.href = downloadUrl;
      link.download = file.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Increment download count 
      const downloadCount = (file.download_count || 0) + 1;
      const { error } = await supabase
        .from('downloadable_files')
        .update({ download_count: downloadCount })
        .eq('id', file.id);
      
      if (error) {
        console.error("Error updating download count:", error);
      }
      
      // For ZIP files, show a helpful message about potential corruption
      if (file.file_name.toLowerCase().endsWith('.zip')) {
        toast({
          title: "Download started",
          description: `${file.file_name} is being downloaded. If you have trouble opening the file, check the File Troubleshooting section.`,
          duration: 5000,
        });
      } else {
        toast({
          title: "Download started",
          description: `${file.file_name} is being downloaded.`,
        });
      }
    } catch (error) {
      console.error("Error during download:", error);
      toast({
        title: "Download failed",
        description: "Could not download the file. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const handleFileIssue = (fileName: string) => {
    setErrorDetails({
      fileName,
      errorType: fileName.toLowerCase().endsWith('.zip') ? 'zip' : 'general',
    });
    setErrorDialogOpen(true);
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
          {files.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <FileArchive className="h-10 w-10 mx-auto mb-2 text-gray-500" />
              <p>No files available for download</p>
            </div>
          ) : (
            <>
              <div className="mb-4 p-3 bg-amber-900/30 border border-amber-600/30 rounded-md">
                <h3 className="flex items-center text-amber-300 font-medium mb-1">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  File Troubleshooting
                </h3>
                <p className="text-sm text-amber-100/80">
                  Having trouble opening files? Click the help icon next to any file for troubleshooting tips.
                </p>
              </div>
              
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
                        {file.file_path && (
                          <span className="text-gray-500 italic truncate max-w-[150px]" title={file.file_path}>
                            Path: {file.file_path.substring(0, 20)}
                            {file.file_path.length > 20 ? '...' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button 
                      onClick={() => handleFileIssue(file.file_name)}
                      className="mr-2 text-gray-400 hover:text-amber-300"
                      aria-label="File help"
                    >
                      <FileQuestion className="h-4 w-4" />
                    </button>
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
                </div>
              ))}
            </>
          )}
        </div>
      </main>
      
      <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <DialogContent className="bg-charcoalSecondary border-gray-700 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>File Troubleshooting Guide</DialogTitle>
            <DialogDescription className="text-gray-300">
              Troubleshooting tips for {errorDetails.fileName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-gray-300">
            {errorDetails.errorType === 'zip' ? (
              <>
                <div className="space-y-2">
                  <h4 className="text-white font-medium">Common ZIP file errors:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>"The archive is either in unknown format or damaged"</li>
                    <li>"No archives found"</li>
                    <li>"CRC failed"</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-white font-medium">Solutions:</h4>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Try extracting with a different program (WinRAR, 7-Zip, Windows built-in extractor)</li>
                    <li>Try downloading the file again - sometimes downloads get corrupted</li>
                    <li>Check if your antivirus is blocking the extraction</li>
                    <li>Try using file repair tools like Advanced ZIP Repair</li>
                  </ol>
                </div>
                
                <div className="bg-blue-900/30 border border-blue-700/40 rounded p-3">
                  <p className="text-blue-300 font-medium">Need more help?</p>
                  <p className="text-blue-100 text-xs">Contact support and mention you're having trouble with ZIP files.</p>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <h4 className="text-white font-medium">Common file issues:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>File path or URL is incorrect</li>
                    <li>File was partially downloaded</li>
                    <li>File may be corrupted</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-white font-medium">Solutions:</h4>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Try downloading the file again</li>
                    <li>Ensure you have the appropriate software to open this file type</li>
                    <li>Check if your browser is blocking downloads from this site</li>
                    <li>Try using a different browser</li>
                  </ol>
                </div>
                
                <div className="bg-blue-900/30 border border-blue-700/40 rounded p-3">
                  <p className="text-blue-300 font-medium">Path information:</p>
                  <p className="text-blue-100 text-xs break-all">
                    {files.find(f => f.file_name === errorDetails.fileName)?.file_path || "Path information not available"}
                  </p>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <BottomNav />
    </div>
  );
};

export default Files;
