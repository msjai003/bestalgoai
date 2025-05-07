
import React from "react";
import { FileArchive } from "lucide-react";

const EmptyFilesState: React.FC = () => {
  return (
    <div className="text-center py-8 flex flex-col items-center justify-center">
      <FileArchive className="h-12 w-12 mb-3 text-gray-500" />
      <p className="text-gray-400">Check back later for available files</p>
    </div>
  );
};

export default EmptyFilesState;
