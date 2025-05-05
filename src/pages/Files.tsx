
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { FileArchive, Download, AlertTriangle, ExternalLink } from "lucide-react";
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
      // Determine if this is a local reference or remote URL
      let fileUrl;
      
      // If this is a full URL, use it directly
      if (file.file_path.startsWith('http')) {
        fileUrl = file.file_path;
      } else {
        // For Word documents, we might need to display them differently
        if (file.file_type === 'docx' || file.file_name.toLowerCase().endsWith('.docx')) {
          // For Word docs, we should handle them based on where they're stored
          if (file.file_path.startsWith('/documents/')) {
            // If these are stored in a public folder or accessible URL
            toast({
              title: "Microsoft Word Document",
              description: "Depending on your browser, Word documents may open in a viewer or download directly.",
              duration: 5000,
            });
          }
        }
        
        // Construct URL (using public folder or any accessible location)
        fileUrl = file.file_path.startsWith('/') 
          ? file.file_path 
          : `/${file.file_path}`;
      }
      
      // Create a download link and trigger download
      const link = document.createElement('a');
      link.href = fileUrl;
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
      
      // Show appropriate message for Word documents
      if (file.file_name.toLowerCase().endsWith('.docx')) {
        toast({
          title: "Download started",
          description: `${file.file_name} is being downloaded. This is a Microsoft Word document.`,
          duration: 5000,
        });
      } else if (file.file_name.toLowerCase().endsWith('.zip')) {
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
      errorType: fileName.toLowerCase().endsWith('.zip') ? 'zip' : 
                 fileName.toLowerCase().endsWith('.docx') ? 'docx' : 'general',
    });
    setErrorDialogOpen(true);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (extension === 'docx' || extension === 'doc') {
      return <ExternalLink className="h-5 w-5 text-blue-500" />;
    }
    
    return <FileArchive className="h-5 w-5 text-cyan" />;
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
                      {getFileIcon(file.file_name)}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{file.file_name}</h3>
                      <div className="flex space-x-3 text-xs text-gray-400">
                        <span>{file.file_size}</span>
                        <span>Added: {new Date(file.added_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button 
                      onClick={() => handleFileIssue(file.file_name)}
                      className="mr-2 text-gray-400 hover:text-amber-300"
                      aria-label="File help"
                    >
                      <AlertTriangle className="h-4 w-4" />
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
            ) : errorDetails.errorType === 'docx' ? (
              <>
                <div className="space-y-2">
                  <h4 className="text-white font-medium">Common Word document issues:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Document opens in unformatted view</li>
                    <li>Unable to open the file</li>
                    <li>File appears corrupted</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-white font-medium">Solutions:</h4>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Make sure Microsoft Word or compatible software is installed</li>
                    <li>Try opening with Google Docs or Office Online if available</li>
                    <li>Try downloading the file again</li>
                    <li>Check if your browser has a built-in document viewer that might be interfering</li>
                  </ol>
                </div>
                
                <div className="bg-blue-900/30 border border-blue-700/40 rounded p-3">
                  <p className="text-blue-300 font-medium">Alternative solutions:</p>
                  <p className="text-blue-100 text-xs">If you continue to have issues, try requesting the document in a different format like PDF.</p>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <h4 className="text-white font-medium">General file troubleshooting:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Ensure you have the right software to open this file type</li>
                    <li>Try downloading the file again</li>
                    <li>Check if your antivirus quarantined the file</li>
                  </ul>
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
