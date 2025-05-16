
import React from "react";
import { Badge } from "@/components/ui/badge";

interface FileTypeBadgeProps {
  type: string;
  name: string;
}

const FileTypeBadge = ({ type, name }: FileTypeBadgeProps) => {
  const isZipFile = type === 'zip' || name.toLowerCase().endsWith('.zip');
  
  if (!isZipFile) return null;

  return (
    <Badge variant="outline" className="ml-0 sm:ml-2">
      ZIP
    </Badge>
  );
};

export default FileTypeBadge;
