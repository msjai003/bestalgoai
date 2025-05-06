
import React, { useState } from "react";
import { Download, AlertTriangle, File, Archive, FileCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatFileSize } from "@/utils/storageUtils";

interface FileItemProps {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
  created_at: string;
  bucket: string;
  onShowHelp: (fileName: string) => void;
}

const FileItem = ({
  id,
  name,
  size,
  type,
  url,
  created_at,
  bucket,
  onShowHelp
}: FileItemProps) => {
  const { toast } = useToast();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

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

  const handleDownload = async () => {
    setDownloadingId(id);
    
    try {
      // Show specific pre-download warnings based on file type
      if (type === 'docx') {
        toast({
          title: "Downloading Word Document",
          description: "Microsoft Word document is being downloaded. Make sure you have Microsoft Word or a compatible app installed.",
          duration: 5000,
        });
      } else if (type === 'zip') {
        toast({
          title: "Downloading ZIP File",
          description: "ZIP archive is being downloaded. You'll need an extraction tool like WinRAR, 7-Zip or the built-in extractor.",
          duration: 5000,
        });
      } else if (type === 'exe') {
        toast({
          title: "Downloading Executable File",
          description: "Executable file is being downloaded. Make sure to scan it with antivirus software before running.",
          duration: 5000,
        });
      }
      
      // Create a download link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show appropriate message based on file type
      if (type === 'docx') {
        // Add a slight delay before showing this notification so it doesn't compete with the download toast
        setTimeout(() => {
          toast({
            title: "Word Document Downloaded",
            description: "If the document shows corruption errors, please click the help icon for troubleshooting steps.",
            duration: 7000,
          });
        }, 2000);
      } else if (type === 'zip') {
        toast({
          title: "ZIP Archive Downloaded",
          description: `${name} is being downloaded. If you have trouble opening the file, check the File Troubleshooting section.`,
          duration: 5000,
        });
      } else if (type === 'exe') {
        toast({
          title: "Executable Downloaded",
          description: "Remember to verify the source of this file before executing it.",
          duration: 5000,
        });
      } else {
        toast({
          title: "Download started",
          description: `${name} is being downloaded.`,
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

  return (
    <div className="flex items-center justify-between py-3 px-2 border-b border-gray-800 last:border-0">
      <div className="flex items-center">
        <div className="bg-charcoalPrimary/60 p-2 rounded-lg mr-3">
          {getFileIcon(type)}
        </div>
        <div>
          <h3 className="text-white font-medium">{name}</h3>
          <div className="flex space-x-3 text-xs text-gray-400">
            <span>{size}</span>
            <span>Added: {new Date(created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <button 
          onClick={() => onShowHelp(name)}
          className="mr-2 text-gray-400 hover:text-amber-300"
          aria-label="File help"
        >
          <AlertTriangle className="h-4 w-4" />
        </button>
        <Button
          onClick={handleDownload}
          variant="outline"
          size="sm"
          className="text-cyan border-cyan hover:bg-cyan hover:text-charcoalPrimary"
          disabled={downloadingId === id}
        >
          {downloadingId === id ? (
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
  );
};

export default FileItem;
