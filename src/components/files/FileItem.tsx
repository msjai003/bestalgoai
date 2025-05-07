
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
      // Open Google Drive link in a new tab
      window.open(url, '_blank');
      
      toast({
        title: "Download link opened",
        description: `${name} is being downloaded from Google Drive.`,
      });
    } catch (error) {
      console.error("Error during download:", error);
      toast({
        title: "Download failed",
        description: "Could not open the download link. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="flex items-center justify-center py-3 px-2 border-b border-gray-800 last:border-0 hover:bg-charcoalPrimary/30 rounded-md transition-colors">
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
