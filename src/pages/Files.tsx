
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { FileArchive, Download, AlertTriangle, Upload, FileWarning, File, Archive, Trash2, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface FileItem {
  id: string;
  name: string;
  size: string; // Changed from number to string since we're storing the formatted size
  created_at: string;
  type: string;
  url: string;
  bucket: string;
}

const BUCKET_NAMES = {
  APP_FILES: 'app-files',
  EXE_FILES: 'exe-files'
};

const Files = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorDetails, setErrorDetails] = useState({
    fileName: "",
    errorType: "",
  });
  
  // State for file corruption alert dialog
  const [corruptionAlertOpen, setCorruptionAlertOpen] = useState(false);
  const [corruptFileDetails, setCorruptFileDetails] = useState({
    fileName: "",
    fileType: ""
  });

  // State for zip file error dialog
  const [zipErrorDialogOpen, setZipErrorDialogOpen] = useState(false);
  const [zipFileDetails, setZipFileDetails] = useState({
    fileName: ""
  });

  // State for bucket selection
  const [selectedBucket, setSelectedBucket] = useState(BUCKET_NAMES.APP_FILES);

  useEffect(() => {
    fetchFiles();
  }, [selectedBucket]);

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .storage
        .from(selectedBucket)
        .list();
      
      if (error) {
        console.error("Error fetching files:", error);
        toast({
          title: "Error fetching files",
          description: "Could not load file list. Please try again later.",
          variant: "destructive",
        });
        return;
      }
      
      // Filter out folders (.emptyFolders)
      const actualFiles = data?.filter(item => !item.id.includes('.emptyFolders')) || [];
      
      // Get URLs for each file
      const filesWithUrls = await Promise.all(actualFiles.map(async (file) => {
        const { data: urlData } = supabase
          .storage
          .from(selectedBucket)
          .getPublicUrl(file.name);
          
        // Get file type
        let fileType = 'unknown';
        const extension = file.name.split('.').pop()?.toLowerCase();
        
        if (extension === 'pdf') fileType = 'pdf';
        else if (['doc', 'docx'].includes(extension || '')) fileType = 'docx';
        else if (['zip', 'rar', '7z'].includes(extension || '')) fileType = 'zip';
        else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) fileType = 'image';
        else if (['exe'].includes(extension || '')) fileType = 'exe';
        
        // Format size
        const formattedSize = formatFileSize(file.metadata?.size || 0);
        
        return {
          id: file.id,
          name: file.name,
          size: formattedSize,
          created_at: file.created_at,
          type: fileType,
          url: urlData.publicUrl,
          bucket: selectedBucket
        };
      }));
      
      setFiles(filesWithUrls);
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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        
        // Upload file
        const { error } = await supabase
          .storage
          .from(selectedBucket)
          .upload(file.name, file, {
            cacheControl: '3600',
            upsert: true
          });
          
        if (error) {
          console.error("Error uploading file:", error);
          toast({
            title: "Upload failed",
            description: `Failed to upload ${file.name}. ${error.message}`,
            variant: "destructive",
          });
          continue;
        }
        
        toast({
          title: "File uploaded",
          description: `${file.name} has been successfully uploaded.`,
        });
      }
      
      // Refresh file list
      fetchFiles();
    } catch (error) {
      console.error("Exception during upload:", error);
      toast({
        title: "Upload error",
        description: "An unexpected error occurred during upload.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleDelete = async (fileName: string, bucket: string) => {
    try {
      const { error } = await supabase
        .storage
        .from(bucket)
        .remove([fileName]);
        
      if (error) {
        console.error("Error deleting file:", error);
        toast({
          title: "Delete failed",
          description: `Failed to delete ${fileName}.`,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "File deleted",
        description: `${fileName} has been successfully deleted.`,
      });
      
      // Refresh file list
      fetchFiles();
    } catch (error) {
      console.error("Exception during delete:", error);
      toast({
        title: "Delete error",
        description: "An unexpected error occurred while deleting the file.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (file: FileItem) => {
    setDownloadingId(file.id);
    
    try {
      // Show specific pre-download warnings based on file type
      if (file.type === 'docx') {
        toast({
          title: "Downloading Word Document",
          description: "Microsoft Word document is being downloaded. Make sure you have Microsoft Word or a compatible app installed.",
          duration: 5000,
        });
      } else if (file.type === 'zip') {
        toast({
          title: "Downloading ZIP File",
          description: "ZIP archive is being downloaded. You'll need an extraction tool like WinRAR, 7-Zip or the built-in extractor.",
          duration: 5000,
        });
      } else if (file.type === 'exe') {
        toast({
          title: "Downloading Executable File",
          description: "Executable file is being downloaded. Make sure to scan it with antivirus software before running.",
          duration: 5000,
        });
      }
      
      // Create a download link and trigger download
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show appropriate message based on file type
      if (file.type === 'docx') {
        // Add a slight delay before showing this notification so it doesn't compete with the download toast
        setTimeout(() => {
          toast({
            title: "Word Document Downloaded",
            description: "If the document shows corruption errors, please click the help icon for troubleshooting steps.",
            duration: 7000,
          });
        }, 2000);
      } else if (file.type === 'zip') {
        toast({
          title: "ZIP Archive Downloaded",
          description: `${file.name} is being downloaded. If you have trouble opening the file, check the File Troubleshooting section.`,
          duration: 5000,
        });
      } else if (file.type === 'exe') {
        toast({
          title: "Executable Downloaded",
          description: "Remember to verify the source of this file before executing it.",
          duration: 5000,
        });
      } else {
        toast({
          title: "Download started",
          description: `${file.name} is being downloaded.`,
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
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'docx') {
      setCorruptFileDetails({
        fileName,
        fileType: 'docx'
      });
      setCorruptionAlertOpen(true);
    } else if (fileExtension === 'zip') {
      setZipFileDetails({
        fileName
      });
      setZipErrorDialogOpen(true);
    } else {
      setErrorDetails({
        fileName,
        errorType: fileName.toLowerCase().endsWith('.zip') ? 'zip' : 
                  fileName.toLowerCase().endsWith('.docx') ? 'docx' : 
                  fileName.toLowerCase().endsWith('.exe') ? 'exe' : 'general',
      });
      setErrorDialogOpen(true);
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'docx':
        return <File className="h-5 w-5 text-blue-500" />;
      case 'zip':
        return <Archive className="h-5 w-5 text-purple-500" />;
      case 'pdf':
        return <File className="h-5 w-5 text-red-500" />;
      case 'image':
        return <File className="h-5 w-5 text-green-500" />;
      case 'exe':
        return <File className="h-5 w-5 text-orange-500" />;
      default:
        return <File className="h-5 w-5 text-cyan" />;
    }
  };

  const getBucketDisplayName = (bucketId: string) => {
    switch (bucketId) {
      case BUCKET_NAMES.APP_FILES:
        return "Regular Files";
      case BUCKET_NAMES.EXE_FILES:
        return "Executable Files";
      default:
        return bucketId;
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
          <p className="text-gray-400 mt-1">Upload and download trading resources and templates</p>
        </div>

        {/* Bucket Selector */}
        <div className="bg-charcoalSecondary rounded-lg p-4 mb-4">
          <h2 className="text-white font-medium mb-2">Select Storage</h2>
          <div className="flex flex-wrap gap-2">
            {Object.values(BUCKET_NAMES).map((bucket) => (
              <Button
                key={bucket}
                variant={selectedBucket === bucket ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedBucket(bucket)}
                className={selectedBucket === bucket 
                  ? "bg-cyan text-charcoalPrimary hover:bg-cyan/80" 
                  : "text-cyan border-cyan hover:bg-cyan/20"}
              >
                {getBucketDisplayName(bucket)}
              </Button>
            ))}
          </div>
        </div>

        <div className="bg-charcoalSecondary rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-medium">Upload Files</h2>
            <label className="cursor-pointer">
              <input 
                type="file" 
                className="hidden" 
                onChange={handleUpload}
                multiple
                disabled={isUploading}
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="text-cyan border-cyan hover:bg-cyan hover:text-charcoalPrimary"
                disabled={isUploading}
              >
                {isUploading ? (
                  <div className="flex items-center">
                    <div className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin mr-2"></div>
                    <span>Uploading...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Upload className="h-4 w-4 mr-1" />
                    <span>Upload</span>
                  </div>
                )}
              </Button>
            </label>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {selectedBucket === BUCKET_NAMES.APP_FILES 
              ? "Upload ZIP files, documents, or other trading resources to share."
              : "Upload executable files that can be downloaded and run."}
          </p>
        </div>

        <div className="bg-charcoalSecondary rounded-lg p-4">
          <h2 className="text-lg text-white font-medium mb-3">
            {getBucketDisplayName(selectedBucket)}
          </h2>
          
          {files.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <FileArchive className="h-10 w-10 mx-auto mb-2 text-gray-500" />
              <p>No files available. Upload a file to get started.</p>
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
                      {getFileIcon(file.type)}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{file.name}</h3>
                      <div className="flex space-x-3 text-xs text-gray-400">
                        <span>{file.size}</span>
                        <span>Added: {new Date(file.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button 
                      onClick={() => handleFileIssue(file.name)}
                      className="mr-2 text-gray-400 hover:text-amber-300"
                      aria-label="File help"
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </button>
                    <Button
                      onClick={() => handleDelete(file.name, file.bucket)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20 mr-2"
                      aria-label="Delete file"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
      
      {/* Regular troubleshooting dialog */}
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
            ) : errorDetails.errorType === 'exe' ? (
              <>
                <div className="space-y-2">
                  <h4 className="text-white font-medium">Common executable file issues:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>File blocked by security software</li>
                    <li>"Windows protected your PC" warning</li>
                    <li>Application fails to run</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-white font-medium">Solutions:</h4>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Verify the source is trustworthy before running</li>
                    <li>Scan with antivirus software before executing</li>
                    <li>Right-click and select "Run as administrator" if needed</li>
                    <li>Check if you need to bypass SmartScreen (only for trusted applications)</li>
                  </ol>
                </div>
                
                <div className="bg-amber-900/30 border border-amber-700/40 rounded p-3">
                  <p className="text-amber-300 font-medium">Security Warning:</p>
                  <p className="text-amber-100 text-xs">Only run executable files from sources you trust. Always scan with antivirus software before running.</p>
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
      
      {/* Word document corruption alert dialog */}
      <AlertDialog open={corruptionAlertOpen} onOpenChange={setCorruptionAlertOpen}>
        <AlertDialogContent className="bg-charcoalSecondary border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <FileWarning className="h-5 w-5 text-amber-400 mr-2" />
              Microsoft Word Document Issues
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              You may encounter "file is corrupt and cannot be opened" errors when opening {corruptFileDetails.fileName}. This could be due to:
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <h4 className="text-white font-medium">Common causes:</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                <li>Microsoft Word product activation issues</li>
                <li>Incompatible Word version</li>
                <li>Browser download handling problems</li>
                <li>Missing Office components</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-white font-medium">Solutions:</h4>
              <ol className="list-decimal pl-5 space-y-2 text-gray-300 text-sm">
                <li>Try a different application like Google Docs, LibreOffice or WPS Office</li>
                <li>Save the file with a right-click and "Save link as..." instead of direct download</li>
                <li>Verify your Microsoft Office installation and activation status</li>
                <li>Request the document in a different format (like PDF) by contacting support</li>
              </ol>
            </div>
            
            <div className="bg-blue-900/30 border border-blue-700/40 rounded p-3 mt-4">
              <p className="text-blue-300 font-medium text-sm">Need more help?</p>
              <p className="text-blue-100 text-xs">Contact our support team and mention you're having trouble with Word document activation or file corruption.</p>
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-charcoalPrimary text-white border-gray-700 hover:bg-gray-700">Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* ZIP file specific alert dialog */}
      <AlertDialog open={zipErrorDialogOpen} onOpenChange={setZipErrorDialogOpen}>
        <AlertDialogContent className="bg-charcoalSecondary border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <FileArchive className="h-5 w-5 text-purple-400 mr-2" />
              ZIP Archive Troubleshooting
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Issues with opening or extracting {zipFileDetails.fileName}? Here's how to fix common problems:
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <h4 className="text-white font-medium">Common ZIP extraction errors:</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                <li>"CRC failed in file..." - The ZIP file may be damaged</li>
                <li>"Unable to open file as archive" - The file might be incomplete</li>
                <li>"Unexpected end of data" - Download was interrupted</li>
                <li>"The archive is either in unknown format or damaged"</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-white font-medium">Solutions:</h4>
              <ol className="list-decimal pl-5 space-y-2 text-gray-300 text-sm">
                <li><span className="font-medium">Try different extraction software:</span> WinRAR, 7-Zip, and Windows built-in extraction each handle ZIP files differently</li>
                <li><span className="font-medium">Download again:</span> The file may have been corrupted during the initial download</li>
                <li><span className="font-medium">Use 'Save as' instead of direct download:</span> Right-click the download button and select "Save link as..." for better download integrity</li>
                <li><span className="font-medium">Check your antivirus:</span> Security software might be blocking extraction or quarantining the file</li>
                <li><span className="font-medium">Try repair tools:</span> Software like Advanced ZIP Repair or Zip Repair Pro can fix corrupted archives</li>
              </ol>
            </div>
            
            <div className="bg-blue-900/30 border border-blue-700/40 rounded p-3 mt-4">
              <p className="text-blue-300 font-medium text-sm">Recommended extraction tools:</p>
              <ul className="list-disc pl-5 space-y-1 text-blue-100 text-xs">
                <li>7-Zip (free, lightweight): www.7-zip.org</li>
                <li>WinRAR (trial, powerful): www.rarlab.com</li>
                <li>Windows built-in extractor (right-click &gt; Extract All)</li>
              </ul>
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-charcoalPrimary text-white border-gray-700 hover:bg-gray-700">Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <BottomNav />
    </div>
  );
};

export default Files;
