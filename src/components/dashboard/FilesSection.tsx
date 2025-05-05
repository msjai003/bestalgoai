
import React from "react";
import { File, Folder, BookText, BookOpen } from "lucide-react";
import QuickAccessItem from "./QuickAccessItem";

const FilesSection = () => {
  return (
    <section id="files-section" className="mt-8">
      <h2 className="text-xl font-semibold text-white mb-4">Files</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <QuickAccessItem
          icon={Folder}
          text="Trading Strategy"
          route="/strategy-selection"
        />
        
        <QuickAccessItem
          icon={BookText}
          text="Analysis Report"
          route="/backtest-report"
        />
        
        <QuickAccessItem
          icon={File}
          text="Market Data" 
          route="/orders"
        />
        
        <QuickAccessItem
          icon={BookOpen}
          text="Backtest Results"
          route="/zenflow-backtest-report"
        />
        
        <QuickAccessItem
          icon={BookText}
          text="Brokers"
          route="/broker-integration"
        />
        
        <QuickAccessItem
          icon={File}
          text="Results"
          route="/orders"
        />
      </div>
    </section>
  );
};

export default FilesSection;
