
import React from "react";
import FileItem from "@/components/files/FileItem";

interface FileData {
  id: number;
  name: string;
  size: string;
  created_at: string;
  type: string;
  url: string;
  bucket: string;
  is_premium: boolean;
}

interface FilesListProps {
  files: FileData[];
  hasPremium: boolean;
  onPaymentSuccess?: () => void;
}

const FilesList: React.FC<FilesListProps> = ({ files, hasPremium, onPaymentSuccess }) => {
  // Mark ALL files as premium/locked
  const enhancedFiles = files.map(file => ({
    ...file,
    is_premium: true
  }));

  return (
    <div className="space-y-1">
      {enhancedFiles.map((file) => (
        <FileItem
          key={file.id}
          id={file.id}
          name={file.name}
          size={file.size}
          type={file.type}
          url={file.url}
          created_at={file.created_at}
          bucket={file.bucket}
          hasPremium={hasPremium}
          is_premium={file.is_premium}
        />
      ))}
    </div>
  );
};

export default FilesList;
