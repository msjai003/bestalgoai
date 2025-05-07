
import React, { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FileItemProps {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
  created_at: string;
  bucket: string;
}

const FileItem = ({
  id,
  name,
  size,
  type,
  url,
  created_at,
  bucket,
}: FileItemProps) => {
  const { toast } = useToast();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async () => {
    setDownloadingId(id);
    
    try {
      // Create a download link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: `${name} is being downloaded.`,
      });
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
    <div className="flex items-center justify-between py-3 px-2 border-b border-gray-800 last:border-0 hover:bg-charcoalPrimary/30 rounded-md transition-colors">
      <div className="flex items-center overflow-hidden">
        <div className="truncate">
          <h3 className="text-white font-medium truncate">{name}</h3>
          <div className="text-xs text-gray-400">
            <span>{size}</span>
          </div>
        </div>
      </div>
      <Button
        onClick={handleDownload}
        variant="outline"
        size="sm"
        className="text-cyan border-cyan hover:bg-cyan hover:text-charcoalPrimary min-w-[110px] whitespace-nowrap"
        disabled={downloadingId === id}
      >
        {downloadingId === id ? (
          <div className="flex items-center">
            <div className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin mr-2"></div>
            <span>Downloading...</span>
          </div>
        ) : (
          <>
            <Download className="h-4 w-4 mr-1" />
            <span>Download</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default FileItem;
