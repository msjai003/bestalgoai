import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { FileArchive, AlertTriangle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth/AuthContext";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel
} from "@/components/ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { STORAGE_BUCKETS, formatFileSize } from "@/utils/storageUtils";
import FileItem from "@/components/files/FileItem";
import FileUploadDialog from "@/components/files/FileUploadDialog";

interface FileItem {
  id: string;
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

  // State for bucket selection - Using tabs to switch between buckets
  const [selectedBucket, setSelectedBucket] = useState(STORAGE_BUCKETS.APP_FILES);

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
        else if (['exe', 'msi'].includes(extension || '')) fileType = 'exe';
        
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

  const handleFileIssue = (fileName: string) => {
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'docx') {
      setCorruptFileDetails({
        fileName,
        fileType: 'docx'
      });
      setCorruptionAlertOpen(true);
    } else if (fileExtension === 'zip' || fileExtension === 'rar' || fileExtension === '7z') {
      setZipFileDetails({
        fileName
      });
      setZipErrorDialogOpen(true);
    } else {
      setErrorDetails({
        fileName,
        errorType: fileExtension === 'zip' ? 'zip' : 
                   fileExtension === 'docx' ? 'docx' : 
                   fileExtension === 'exe' || fileExtension === 'msi' ? 'exe' : 'general',
      });
      setErrorDialogOpen(true);
    }
  };

  const getBucketDisplayName = (bucketId: string) => {
    switch (bucketId) {
      case STORAGE_BUCKETS.APP_FILES:
        return "Document Files";
      case STORAGE_BUCKETS.EXE_FILES:
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
          <p className="text-gray-400 mt-1">Download trading resources and templates</p>
        </div>

        <Tabs 
          defaultValue={STORAGE_BUCKETS.APP_FILES}
          value={selectedBucket}
          onValueChange={setSelectedBucket}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value={STORAGE_BUCKETS.APP_FILES} className="data-[state=active]:text-cyan">
              Documents
            </TabsTrigger>
            <TabsTrigger value={STORAGE_BUCKETS.EXE_FILES} className="data-[state=active]:text-cyan">
              Applications
            </TabsTrigger>
          </TabsList>

          {[STORAGE_BUCKETS.APP_FILES, STORAGE_BUCKETS.EXE_FILES].map((bucketId) => (
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
                    Upload
                  </Button>
                </div>

                {files.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <FileArchive className="h-10 w-10 mx-auto mb-2 text-gray-500" />
                    <p>No files available in this section.</p>
                    {bucketId === STORAGE_BUCKETS.EXE_FILES && (
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
                      <FileItem 
                        key={file.id}
                        {...file}
                        onShowHelp={handleFileIssue}
                      />
                    ))}
                  </>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
      
      {/* File Upload Dialog */}
      <FileUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        bucketId={selectedBucket}
        onSuccess={fetchFiles}
      />
      
      {/* Regular troubleshooting dialog */}
      <AlertDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <AlertDialogContent className="bg-charcoalSecondary border-gray-700 text-white sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>File Troubleshooting Guide</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Troubleshooting tips for {errorDetails.fileName}
            </AlertDialogDescription>
          </AlertDialogHeader>
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
          
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-charcoalPrimary text-white border-gray-700 hover:bg-gray-700">Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Word document corruption alert dialog */}
      <AlertDialog open={corruptionAlertOpen} onOpenChange={setCorruptionAlertOpen}>
        <AlertDialogContent className="bg-charcoalSecondary border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
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
              </ol>
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-charcoalPrimary text-white border-gray-700 hover:bg-gray-700">Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Files;
