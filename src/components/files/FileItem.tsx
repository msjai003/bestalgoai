
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
      <div className="flex-1 truncate text-white font-medium">{name}</div>
      <Button
        onClick={handleDownload}
        variant="ghost"
        size="sm"
        className="text-cyan hover:bg-transparent"
        disabled={downloadingId === id}
      >
        {downloadingId === id ? (
          <div className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin"></div>
        ) : (
          <Download className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
};

export default FileItem;
