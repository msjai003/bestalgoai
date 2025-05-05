
import React from "react";
import { File, Folder } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type FileItem = {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: string;
  updatedAt: string;
};

const mockFiles: FileItem[] = [
  {
    id: "1",
    name: "Trading Strategy",
    type: "folder",
    updatedAt: "2025-05-01"
  },
  {
    id: "2",
    name: "Analysis Report",
    type: "file",
    size: "2.4 MB",
    updatedAt: "2025-04-28"
  },
  {
    id: "3",
    name: "Market Data",
    type: "file",
    size: "4.1 MB",
    updatedAt: "2025-05-03"
  },
  {
    id: "4",
    name: "Backtest Results",
    type: "folder",
    updatedAt: "2025-04-30"
  }
];

const FilesSection = () => {
  return (
    <section id="files-section" className="mt-6">
      <h2 className="text-xl font-bold text-white mb-4">Files</h2>
      <Card className="bg-charcoalSecondary border border-gray-800/40 shadow-lg">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 gap-2">
            {mockFiles.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center gap-3 p-3 hover:bg-charcoalPrimary/50 rounded-md transition-colors cursor-pointer"
              >
                {item.type === "folder" ? (
                  <Folder className="text-cyan h-5 w-5" />
                ) : (
                  <File className="text-gray-300 h-5 w-5" />
                )}
                
                <div className="flex-1">
                  <p className="text-white font-medium">{item.name}</p>
                  <p className="text-gray-400 text-xs">
                    {item.type === "folder" ? "Folder" : `${item.size}`} • Updated {item.updatedAt}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {mockFiles.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">No files available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default FilesSection;
