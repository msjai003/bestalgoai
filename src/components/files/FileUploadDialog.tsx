
import React, { useState } from "react";
import { X, AlertTriangle, Upload } from "lucide-react";
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

      const { data, error } = await uploadFile(selectedFile, bucketId);

      if (error) {
        console.error("Upload error:", error);
        
        // Provide more descriptive errors based on the error message
        if (error.message.includes("already exists")) {
          setUploadError("A file with this name already exists. Please rename your file or use a different name.");
        } else if (error.message.includes("size exceeded")) {
          setUploadError("File size exceeded the allowed limit (max 50MB).");
        } else if (error.message.includes("Bucket not found")) {
          setUploadError("Upload failed: The selected storage bucket was not found.");
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
