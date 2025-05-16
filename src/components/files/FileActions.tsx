
import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileActionsProps {
  onDownload: () => void;
  isDownloading: boolean;
  isMobile: boolean;
}

const FileActions = ({ 
  onDownload, 
  isDownloading,
  isMobile 
}: FileActionsProps) => {
  return (
    <Button
      onClick={onDownload}
      variant="ghost"
      size={isMobile ? "sm" : "sm"}
      className="text-cyan hover:text-cyan hover:bg-transparent flex items-center"
      disabled={isDownloading}
    >
      <Download className="h-5 w-5" />
      <span className="ml-1 sm:ml-2">Download</span>
    </Button>
  );
};

export default FileActions;
