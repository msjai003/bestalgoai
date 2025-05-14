
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
  // We don't need to explicitly mark files as premium anymore since they'll come from the database with is_premium set to true
  // Just pass the files directly to the FileItem component
  return (
    <div className="space-y-1">
      {files.map((file) => (
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
