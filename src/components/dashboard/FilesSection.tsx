
import React from "react";
import { File, Folder, BookText, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

type FileItem = {
  id: string;
  name: string;
  type: "file" | "folder";
  icon: React.ComponentType<{ className?: string }>;
  route: string;
};

const mockFiles: FileItem[] = [
  {
    id: "1",
    name: "Trading Strategy",
    type: "folder",
    icon: Folder,
    route: "/strategy-selection"
  },
  {
    id: "2",
    name: "Analysis Report",
    type: "file",
    icon: BookText,
    route: "/backtest-report"
  },
  {
    id: "3",
    name: "Market Data",
    type: "file",
    icon: File,
    route: "/orders"
  },
  {
    id: "4",
    name: "Backtest Results",
    type: "folder",
    icon: BookOpen,
    route: "/zenflow-backtest-report"
  }
];

const FilesSection = () => {
  return (
    <section id="files-section" className="mt-8">
      <h2 className="text-xl font-semibold text-white mb-4">Files</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {mockFiles.map((item) => (
          <Link 
            key={item.id} 
            to={item.route} 
            className="block"
          >
            <Card className="bg-charcoalSecondary rounded-xl p-4 border border-gray-800/40 flex items-center hover:border-cyan/30 transition-all">
              <div className="bg-charcoalPrimary/60 p-2.5 rounded-lg mr-3">
                <item.icon className="h-5 w-5 text-cyan" />
              </div>
              <span className="text-gray-200">{item.name}</span>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FilesSection;
