
import React, { useState, useEffect } from "react";
import { FileArchive, Download, Loader, Server, FileCog, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { connectToFtp, listFtpFiles, downloadFtpFile, FtpFile, FtpConnectionConfig } from "@/utils/ftpService";
import { supabase } from "@/integrations/supabase/client";

interface FtpFilesListProps {
  config: FtpConnectionConfig;
  onFileDownloaded?: (filename: string) => void;
}

const FtpFilesList: React.FC<FtpFilesListProps> = ({ config, onFileDownloaded }) => {
  const { toast } = useToast();
  const [files, setFiles] = useState<FtpFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<{ [key: string]: number }>({});
  const [isDownloading, setIsDownloading] = useState<{ [key: string]: boolean }>({});

  const connectAndFetchFiles = async () => {
    setIsConnecting(true);
    setIsLoading(true);
    
    try {
      const connected = await connectToFtp(config);
      
      if (connected) {
        setIsConnected(true);
        const filesList = await listFtpFiles(config);
        setFiles(filesList);
        
        if (filesList.length === 0) {
          toast({
            title: "No files found",
            description: "No files were found on the FTP server.",
            variant: "default",
          });
        }
      } else {
        setIsConnected(false);
        toast({
          title: "Connection failed",
          description: "Could not connect to FTP server. Please check credentials.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while connecting to the FTP server.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    connectAndFetchFiles();
  }, []);

  const handleFileDownload = async (file: FtpFile) => {
    setIsDownloading({ ...isDownloading, [file.path]: true });
    setDownloadProgress({ ...downloadProgress, [file.path]: 0 });
    
    toast({
      title: "Download started",
      description: `Downloading ${file.name}...`,
      variant: "default",
    });

    try {
      const result = await downloadFtpFile(config, file.path, (progress) => {
        setDownloadProgress(prev => ({
          ...prev,
          [file.path]: progress
        }));
      });

      if (result.success) {
        toast({
          title: "Download complete",
          description: `${file.name} has been downloaded.`,
          variant: "default",
        });
        
        // Here we would typically save the file to Supabase storage
        // In a real implementation, this would happen server-side
        // For demo, we'll simulate this process
        
        try {
          // Mock uploading to Supabase storage
          toast({
            title: "Processing file",
            description: "Saving file to your account...",
            variant: "default",
          });
          
          // Simulate a slight delay
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // In production, instead of this mock, the file would already be in Supabase
          // and we would just update the UI to reflect that
          
          if (onFileDownloaded) {
            onFileDownloaded(file.name);
          }
          
          toast({
            title: "File ready",
            description: "The file has been added to your files section.",
            variant: "default",
          });
        } catch (error) {
          console.error("Error saving file:", error);
          toast({
            title: "Processing error",
            description: "There was an error saving the file.",
            variant: "destructive",
          });
        }
        
      } else {
        toast({
          title: "Download failed",
          description: result.message || "Failed to download file.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Download error",
        description: "An error occurred during the download.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading({ ...isDownloading, [file.path]: false });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-charcoalSecondary rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg text-white font-medium flex items-center">
          <Server className="h-5 w-5 mr-2 text-cyan" />
          FTP Files
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={connectAndFetchFiles}
          disabled={isConnecting}
          className="text-cyan border-cyan hover:bg-cyan hover:text-charcoalPrimary"
        >
          {isConnecting ? (
            <Loader className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <Loader className="h-8 w-8 animate-spin text-cyan mx-auto mb-4" />
          <p className="text-gray-400">Connecting to FTP server...</p>
        </div>
      ) : !isConnected ? (
        <div className="text-center py-8 text-gray-400">
          <Server className="h-10 w-10 mx-auto mb-2 text-gray-500" />
          <p>Could not connect to the FTP server.</p>
          <p className="text-sm mt-2 text-gray-500">Please check your connection details.</p>
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <FileArchive className="h-10 w-10 mx-auto mb-2 text-gray-500" />
          <p>No files available on this FTP server.</p>
        </div>
      ) : (
        <div>
          {files.map((file) => (
            <div 
              key={file.path} 
              className="flex items-center justify-between py-3 px-2 border-b border-gray-800 last:border-0"
            >
              <div className="flex items-center">
                <div className="bg-charcoalPrimary/60 p-2 rounded-lg mr-3">
                  <FileCog className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{file.name}</h3>
                  <div className="flex space-x-3 text-xs text-gray-400">
                    <span>{formatFileSize(file.size)}</span>
                    <span>
                      Added: {file.lastModified.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => handleFileDownload(file)}
                variant="outline"
                size="sm"
                className="text-cyan border-cyan hover:bg-cyan hover:text-charcoalPrimary"
                disabled={isDownloading[file.path]}
              >
                {isDownloading[file.path] ? (
                  <div className="flex items-center">
                    <div className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin mr-2"></div>
                    <span>{downloadProgress[file.path]}%</span>
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
  );
};

export default FtpFilesList;
