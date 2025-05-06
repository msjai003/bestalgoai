import React, { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { FileArchive, Download, AlertTriangle, FileWarning, File, Archive, Loader, FileCog, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth/AuthContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

interface FileItem {
  id: string;
  name: string;
  size: string;
  created_at: string;
  type: string;
  url: string;
  bucket: string;
}

const BUCKET_NAMES = {
  APP_FILES: 'app-files',
  EXE_FILES: 'app-exe-files'
};

const Files = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  // State for file upload dialog
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // State for bucket selection - Using tabs to switch between buckets
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
        errorType: fileExtension === 'zip' ? 'zip' : 
                   fileExtension === 'docx' ? 'docx' : 
                   fileExtension === 'exe' ? 'exe' : 'general',
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
        return <FileCog className="h-5 w-5 text-orange-500" />;
      default:
        return <File className="h-5 w-5 text-cyan" />;
    }
  };

  const getBucketDisplayName = (bucketId: string) => {
    switch (bucketId) {
      case BUCKET_NAMES.APP_FILES:
        return "Document Files";
      case BUCKET_NAMES.EXE_FILES:
        return "Executable Files";
      default:
        return bucketId;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setUploadError(null); // Clear any previous errors
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file to upload");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      // Check file size (max 50MB)
      if (selectedFile.size > 50 * 1024 * 1024) {
        setUploadError("File is too large. Maximum size is 50MB.");
        setUploading(false);
        return;
      }

      // Check filename for special characters
      const fileName = selectedFile.name;
      if (/[#%&{}\<>*?/$!'":@+`|=]/g.test(fileName)) {
        setUploadError("Filename contains special characters. Please rename your file before uploading.");
        setUploading(false);
        return;
      }

      const { data, error } = await supabase
        .storage
        .from(selectedBucket)
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error("Upload error:", error);
        
        // Provide more descriptive errors based on the error message
        if (error.message.includes("already exists")) {
          setUploadError("A file with this name already exists. Please rename your file or use a different name.");
        } else if (error.message.includes("size exceeded")) {
          setUploadError("File size exceeded the allowed limit (max 50MB).");
        } else {
          setUploadError(`Upload failed: ${error.message}`);
        }
        return;
      }

      toast({
        title: "Upload successful",
        description: `${fileName} has been uploaded successfully.`,
        variant: "default",
      });

      setUploadDialogOpen(false);
      setSelectedFile(null);
      fetchFiles(); // Refresh file list
    } catch (error: any) {
      console.error("Exception during upload:", error);
      setUploadError(`An unexpected error occurred: ${error.message}`);
    } finally {
      setUploading(false);
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

        <Tabs 
          defaultValue={BUCKET_NAMES.APP_FILES}
          value={selectedBucket}
          onValueChange={setSelectedBucket}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value={BUCKET_NAMES.APP_FILES} className="data-[state=active]:text-cyan">
              <File className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>
            <TabsTrigger value={BUCKET_NAMES.EXE_FILES} className="data-[state=active]:text-cyan">
              <FileCog className="h-4 w-4 mr-2" />
              Applications
            </TabsTrigger>
          </TabsList>

          {[BUCKET_NAMES.APP_FILES, BUCKET_NAMES.EXE_FILES].map((bucketId) => (
            <TabsContent key={bucketId} value={bucketId} className="mt-0">
              <div className="bg-charcoalSecondary rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg text-white font-medium">
                    {getBucketDisplayName(bucketId)} 
                  </h2>
                  <Button 
                    onClick={() => setUploadDialogOpen(true)}
                    size="sm" 
                    className="text-cyan border-cyan hover:bg-cyan hover:text-charcoalPrimary"
                    variant="outline"
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Upload
                  </Button>
                </div>

                {files.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <FileArchive className="h-10 w-10 mx-auto mb-2 text-gray-500" />
                    <p>No files available in this section.</p>
                    {bucketId === BUCKET_NAMES.EXE_FILES && (
                      <p className="text-sm mt-2 text-gray-500">Trading applications will appear here when they become available.</p>
                    )}
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
            </TabsContent>
          ))}
        </Tabs>
      </main>
      
      {/* File Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="bg-charcoalSecondary border-gray-700 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
            <DialogDescription className="text-gray-300">
              Upload a file to the {getBucketDisplayName(selectedBucket)} bucket.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <label htmlFor="file" className="text-sm text-white">
                Select File
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="file"
                  type="file"
                  className="flex h-10 w-full rounded-md border border-gray-700 bg-charcoalPrimary px-3 py-2 text-sm text-white file:border-0 file:bg-transparent file:text-cyan file:text-sm file:font-medium"
                  onChange={handleFileChange}
                />
                {selectedFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedFile(null)}
                    className="h-7 w-7 rounded-full p-0 text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear</span>
                  </Button>
                )}
              </div>
              {selectedFile && (
                <p className="text-xs text-gray-400">
                  {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </p>
              )}
            </div>
            
            {uploadError && (
              <div className="bg-red-900/30 border border-red-700/30 text-red-200 text-sm rounded-md p-3">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-300">Upload Failed</p>
                    <p>{uploadError}</p>
                    
                    {/* Show specific help based on the error */}
                    {uploadError.includes("special characters") && (
                      <ul className="list-disc pl-5 mt-2 text-xs space-y-1">
                        <li>Remove special characters like #, %, &, {}, etc. from the filename</li>
                        <li>Use only letters, numbers, dashes, underscores, and periods</li>
                      </ul>
                    )}
                    
                    {uploadError.includes("already exists") && (
                      <ul className="list-disc pl-5 mt-2 text-xs space-y-1">
                        <li>Try using a different filename</li>
                        <li>Add a version number or date to the filename</li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-900/30 border border-blue-700/30 rounded p-3 text-sm">
              <h4 className="text-blue-300 font-medium">Upload Tips</h4>
              <ul className="list-disc pl-5 mt-1 text-xs space-y-1 text-blue-100">
                <li>Maximum file size: 50MB</li>
                <li>Avoid special characters in filenames (no #, %, &, {}, etc.)</li>
                <li>Use only letters, numbers, dashes, underscores, and periods</li>
                <li>Supported file types: PDF, Word, Excel, ZIP, images, etc.</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setUploadDialogOpen(false)}
              className="bg-transparent text-white hover:bg-gray-700"
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="bg-cyan text-charcoalPrimary hover:bg-cyan/90"
            >
              {uploading ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>Upload</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
                    <li>"Failed to upload 1 file!"</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-white font-medium">Solutions:</h4>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Make sure your ZIP file is not corrupted</li>
                    <li>Try uploading a smaller file (under 50MB)</li>
                    <li>Try a different web browser</li>
                    <li>Try using the "Save As" feature to rename the file before uploading</li>
                    <li>If downloading: Try extracting with a different program (WinRAR, 7-Zip, Windows built-in extractor)</li>
                    <li>Check if your antivirus is blocking the upload or extraction</li>
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
              Issues with uploading or opening {zipFileDetails.fileName}? Here's how to fix common problems:
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <h4 className="text-white font-medium">Common upload errors:</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                <li>"Failed to upload 1 file!" - Server may have rejected the file</li>
                <li>Upload seems to complete but file doesn't appear</li>
                <li>Upload starts but never completes</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-white font-medium">Upload solutions:</h4>
              <ol className="list-decimal pl-5 space-y-2 text-gray-300 text-sm">
                <li><span className="font-medium">Check file size:</span> Make sure your file is under 50MB</li>
                <li><span className="font-medium">Rename your file:</span> Try a simpler filename with no special characters</li>
                <li><span className="font-medium">Try a different browser:</span> Some browsers handle file uploads better than others</li>
                <li><span className="font-medium">Try smaller files:</span> Break large ZIPs into smaller archives</li>
                <li><span className="font-medium">Check network connection:</span> Ensure stable internet during upload</li>
              </ol>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-white font-medium">Common extraction errors:</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                <li>"CRC failed in file..." - The ZIP file may be damaged</li>
                <li>"Unable to open file as archive" - The file might be incomplete</li>
                <li>"Unexpected end of data" - Download was interrupted</li>
                <li>"The archive is either in unknown format or damaged"</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-white font-medium">Extraction solutions:</h4>
              <ol className="list-decimal pl-5 space-y-2 text-gray-300 text-sm">
                <li><span className="font-medium">Try different extraction software:</span> WinRAR, 7-Zip, and Windows built-in extraction each handle ZIP files differently</li>
                <li><span className="font-medium">Download again:</span> The file may have been corrupted during the initial download</li>
                <li><span className="font-medium">Use 'Save as' instead of direct download:</span> Right-click the download button and select "Save link as..." for better download integrity</li>
