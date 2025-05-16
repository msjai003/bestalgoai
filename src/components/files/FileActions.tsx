
import React from "react";
import { Download, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileActionsProps {
  isLockedFile: boolean;
  requiresPayment: boolean;
  onUnlock: () => void;
  onDownload: () => void;
  isDownloading: boolean;
  isMobile: boolean;
}

const FileActions = ({ 
  isLockedFile, 
  requiresPayment, 
  onUnlock, 
  onDownload, 
  isDownloading,
  isMobile 
}: FileActionsProps) => {
  if (isLockedFile && requiresPayment) {
    return (
      <Button
        onClick={onUnlock}
        variant="outline" 
        size={isMobile ? "sm" : "sm"}
        className="bg-cyan hover:bg-cyan/80 text-white flex items-center"
      >
        <Lock className="h-4 w-4 mr-1" />
        <span>Unlock</span>
      </Button>
    );
  }

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
