
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";
import { STORAGE_BUCKETS, listFiles, getFileUrl } from "@/utils/storageUtils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUploadDialog from "@/components/files/FileUploadDialog";

const Files = () => {
  const { toast } = useToast();
  const [documentFiles, setDocumentFiles] = useState<any[]>([]);
  const [appFiles, setAppFiles] = useState<any[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [isLoadingApps, setIsLoadingApps] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState(STORAGE_BUCKETS.APP_FILES);

  const fetchFiles = async () => {
    try {
      setIsLoadingDocs(true);
      const { data: docFiles, error: docError } = await listFiles(STORAGE_BUCKETS.APP_FILES);
      
      if (docError) {
        console.error("Error fetching document files:", docError);
        toast({
          title: "Error",
          description: "Failed to load document files. Please try again.",
          variant: "destructive",
        });
      } else {
        setDocumentFiles(docFiles || []);
      }
      
      setIsLoadingDocs(false);
      
      setIsLoadingApps(true);
      const { data: exeFiles, error: exeError } = await listFiles(STORAGE_BUCKETS.EXE_FILES);
      
      if (exeError) {
        console.error("Error fetching application files:", exeError);
        toast({
          title: "Error",
          description: "Failed to load application files. Please try again.",
          variant: "destructive",
        });
      } else {
        setAppFiles(exeFiles || []);
      }
      
      setIsLoadingApps(false);
    } catch (error) {
      console.error("Error in fetchFiles:", error);
      setIsLoadingDocs(false);
      setIsLoadingApps(false);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading files.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleOpenUploadDialog = (bucketId: string) => {
    setSelectedBucket(bucketId);
    setUploadDialogOpen(true);
  };

  const handleFileUploadSuccess = () => {
    fetchFiles();
  };

  const downloadFile = (fileName: string, bucketId: string) => {
    try {
      const fileUrl = getFileUrl(fileName, bucketId);
      window.open(fileUrl, "_blank");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: "Download Error",
        description: "Failed to download the file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderFileGrid = (files: any[], bucketId: string, isLoading: boolean) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-10">
          <div className="h-6 w-6 border-2 border-current border-r-transparent rounded-full animate-spin"></div>
          <span className="ml-2">Loading files...</span>
        </div>
      );
    }

    if (files.length === 0) {
      return (
        <div className="text-center py-8 text-gray-400">
          <p>No files found</p>
          <Button 
            onClick={() => handleOpenUploadDialog(bucketId)}
            className="mt-4 bg-cyan text-charcoalPrimary hover:bg-cyan/90"
          >
            Upload File
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
        {files.map((file) => (
          <div 
            key={file.name} 
            className="bg-charcoalSecondary rounded-lg p-4 flex flex-col items-center justify-center hover:bg-charcoalSecondary/80 transition-colors cursor-pointer"
            onClick={() => downloadFile(file.name, bucketId)}
          >
            <Download className="h-8 w-8 text-cyan mb-2" />
            <span className="text-xs text-center text-gray-400 truncate w-full">{file.name}</span>
          </div>
        ))}
        <div 
          className="bg-charcoalSecondary bg-opacity-30 rounded-lg p-4 flex flex-col items-center justify-center border border-dashed border-gray-700 hover:border-cyan hover:bg-charcoalSecondary/50 transition-colors cursor-pointer"
          onClick={() => handleOpenUploadDialog(bucketId)}
        >
          <div className="h-8 w-8 rounded-full border-2 border-gray-500 flex items-center justify-center mb-2">
            <span className="text-gray-500 text-lg">+</span>
          </div>
          <span className="text-xs text-center text-gray-500">Upload New</span>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 pt-8 pb-24">
      <h1 className="text-2xl font-semibold mb-6">Files</h1>
      
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents" className="mt-4">
          <div className="bg-charcoalPrimary rounded-lg border border-gray-800">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-medium">Document Files</h2>
              <Button 
                onClick={() => handleOpenUploadDialog(STORAGE_BUCKETS.APP_FILES)}
                className="bg-cyan text-charcoalPrimary hover:bg-cyan/90"
                size="sm"
              >
                Upload
              </Button>
            </div>
            {renderFileGrid(documentFiles, STORAGE_BUCKETS.APP_FILES, isLoadingDocs)}
          </div>
        </TabsContent>
        
        <TabsContent value="applications" className="mt-4">
          <div className="bg-charcoalPrimary rounded-lg border border-gray-800">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-medium">Application Files</h2>
              <Button 
                onClick={() => handleOpenUploadDialog(STORAGE_BUCKETS.EXE_FILES)}
                className="bg-cyan text-charcoalPrimary hover:bg-cyan/90"
                size="sm"
              >
                Upload
              </Button>
            </div>
            {renderFileGrid(appFiles, STORAGE_BUCKETS.EXE_FILES, isLoadingApps)}
          </div>
        </TabsContent>
      </Tabs>
      
      <FileUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        bucketId={selectedBucket}
        onSuccess={handleFileUploadSuccess}
      />
    </div>
  );
};

export default Files;
