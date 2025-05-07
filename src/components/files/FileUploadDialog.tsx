
import React, { useState } from "react";
import { X, AlertTriangle, Upload, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { STORAGE_BUCKETS, formatFileSize, uploadFile } from "@/utils/storageUtils";
import { useToast } from "@/hooks/use-toast";
import { testStorageAccess } from "@/lib/supabase/connection";

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bucketId: string;
  onSuccess: () => void;
}

const FileUploadDialog = ({
  open,
  onOpenChange,
  bucketId,
  onSuccess
}: FileUploadDialogProps) => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [checkingBuckets, setCheckingBuckets] = useState(false);

  const getBucketDisplayName = (bucket: string) => {
    switch (bucket) {
      case STORAGE_BUCKETS.APP_FILES:
        return "Document Files";
      case STORAGE_BUCKETS.EXE_FILES:
        return "Executable Files";
      default:
        return bucket;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setUploadError(null); // Clear any previous errors
      
      // Check for potential issues with the file
      if (file.size > 50 * 1024 * 1024) {
        setUploadError("File is too large. Maximum size is 50MB.");
        return;
      }
      
      // Check filename for special characters
      if (/[#%&{}\<>*?/$!'":@+`|=]/g.test(file.name)) {
        setUploadError("Filename contains special characters which may cause upload issues. Consider renaming your file before uploading.");
      }
    }
  };

  const checkStorageAccess = async () => {
    setCheckingBuckets(true);
    try {
      const result = await testStorageAccess();
      if (!result.success) {
        setUploadError(`Storage access check failed: ${result.message}`);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error checking storage access:", error);
      setUploadError("Could not verify storage access. Please try again later.");
      return false;
    } finally {
      setCheckingBuckets(false);
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
      // First check if storage is accessible
      const storageAccessible = await checkStorageAccess();
      if (!storageAccessible) {
        setUploading(false);
        return;
      }

      // Check file size (max 50MB)
      if (selectedFile.size > 50 * 1024 * 1024) {
        setUploadError("File is too large. Maximum size is 50MB.");
        setUploading(false);
        return;
      }

      console.log(`Uploading ${selectedFile.name} (${selectedFile.type}) to bucket: ${bucketId}`);
      
      // For ZIP files, we include some additional logging to help diagnose issues
      if (selectedFile.name.toLowerCase().endsWith('.zip')) {
        console.log("Uploading a ZIP file with the following properties:");
        console.log("- Name:", selectedFile.name);
        console.log("- Size:", formatFileSize(selectedFile.size));
        console.log("- Type:", selectedFile.type);
        console.log("- Last modified:", new Date(selectedFile.lastModified).toISOString());
      }

      const { data, error } = await uploadFile(selectedFile, bucketId);

      if (error) {
        console.error("Upload error:", error);
        
        // Provide more descriptive errors based on the error message
        if (error.message.includes("already exists")) {
          setUploadError("A file with this name already exists. Please rename your file or use a different name.");
        } else if (error.message.includes("size exceeded")) {
          setUploadError("File size exceeded the allowed limit (max 50MB).");
        } else if (error.message.includes("Bucket not found")) {
          setUploadError("Upload failed: The selected storage bucket was not found. Please contact support.");
        } else {
          setUploadError(`Upload failed: ${error.message}`);
        }
        return;
      }

      toast({
        title: "Upload successful",
        description: `${selectedFile.name} has been uploaded successfully.`,
        variant: "default",
      });

      onOpenChange(false);
      setSelectedFile(null);
      onSuccess(); // Refresh file list
    } catch (error: any) {
      console.error("Exception during upload:", error);
      setUploadError(`An unexpected error occurred: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-charcoalSecondary border-gray-700 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription className="text-gray-300">
            Upload a file to the {getBucketDisplayName(bucketId)} bucket.
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
                {selectedFile.name.toLowerCase().endsWith('.zip') && (
                  <span className="ml-2 text-cyan-400">ZIP file detected</span>
                )}
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
                  
                  {uploadError.includes("Bucket not found") && (
                    <ul className="list-disc pl-5 mt-2 text-xs space-y-1">
                      <li>There might be a configuration issue with the storage buckets</li>
                      <li>Try refreshing the page or contacting support</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {selectedFile && selectedFile.name.toLowerCase().endsWith('.zip') && (
            <div className="bg-blue-900/30 border border-blue-700/30 rounded p-3 text-sm">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-blue-300 font-medium">ZIP File Upload Tips</h4>
                  <ul className="list-disc pl-5 mt-1 text-xs space-y-1 text-blue-100">
                    <li>Ensure your ZIP file is not password protected</li>
                    <li>Avoid deeply nested folder structures within the ZIP</li>
                    <li>If upload fails, try using a different ZIP compression tool</li>
                    <li>For large files, check that your internet connection is stable</li>
                  </ul>
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
              {bucketId === STORAGE_BUCKETS.APP_FILES ? (
                <li>Supported file types: PDF, Word, Excel, ZIP, images, etc.</li>
              ) : (
                <li>Supported file types: EXE, MSI, ZIP archives with executables</li>
              )}
            </ul>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="bg-transparent text-white hover:bg-gray-700"
            disabled={uploading || checkingBuckets}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={!selectedFile || uploading || checkingBuckets}
            className="bg-cyan text-charcoalPrimary hover:bg-cyan/90"
          >
            {checkingBuckets ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin mr-2"></div>
                Checking storage...
              </>
            ) : uploading ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-1" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadDialog;
