
import React, { useState } from "react";
import Header from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { FileArchive, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FileItem {
  id: string;
  name: string;
  size: string;
  dateAdded: string;
}

const FILES_DATA: FileItem[] = [
  { 
    id: "1", 
    name: "strategy_pack_v1.zip", 
    size: "2.4 MB", 
    dateAdded: "2025-04-25" 
  },
  { 
    id: "2", 
    name: "trading_templates.zip", 
    size: "1.8 MB", 
    dateAdded: "2025-05-01" 
  },
  { 
    id: "3", 
    name: "historical_data_pack.zip", 
    size: "4.2 MB", 
    dateAdded: "2025-05-03" 
  }
];

const Files = () => {
  const { toast } = useToast();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = (file: FileItem) => {
    setDownloadingId(file.id);
    
    // Simulate download delay
    setTimeout(() => {
      setDownloadingId(null);
      toast({
        title: "Download complete",
        description: `${file.name} has been downloaded successfully.`,
      });
    }, 1500);
    
    // In a real implementation, this would trigger the actual file download
    // For demonstration, we'll just show the download complete toast
  };

  return (
    <div className="bg-charcoalPrimary min-h-screen">
      <Header />
      <main className="pt-16 pb-20 px-4">
        <div className="mt-4 mb-6">
          <h1 className="text-2xl font-semibold text-white">Files</h1>
          <p className="text-gray-400 mt-1">Download trading resources and templates</p>
        </div>

        <div className="bg-charcoalSecondary rounded-lg p-4">
          {FILES_DATA.map((file) => (
            <div 
              key={file.id} 
              className="flex items-center justify-between py-3 px-2 border-b border-gray-800 last:border-0"
            >
              <div className="flex items-center">
                <div className="bg-charcoalPrimary/60 p-2 rounded-lg mr-3">
                  <FileArchive className="h-5 w-5 text-cyan" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{file.name}</h3>
                  <div className="flex space-x-3 text-xs text-gray-400">
                    <span>{file.size}</span>
                    <span>Added: {file.dateAdded}</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => handleDownload(file)}
                variant="outline"
                size="sm"
                className="text-cyan border-cyan hover:bg-cyan hover:text-charcoalPrimary"
                disabled={downloadingId === file.id}
              >
                {downloadingId === file.id ? (
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
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Files;
