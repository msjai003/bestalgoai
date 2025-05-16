
import React from "react";
import { Lock, Unlock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FileStatusBadgeProps {
  isLockedFile: boolean;
  requiresPayment: boolean;
  hasPaid: boolean;
}

const FileStatusBadge = ({ isLockedFile, requiresPayment, hasPaid }: FileStatusBadgeProps) => {
  if (!isLockedFile) return null;

  if (requiresPayment) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1 mr-2">
        <Lock className="h-3.5 w-3.5" />
        <span>Locked</span>
      </Badge>
    );
  } else if (hasPaid) {
    return (
      <Badge variant="success" className="flex items-center gap-1 mr-2">
        <Unlock className="h-3.5 w-3.5" />
        <span>Unlocked</span>
      </Badge>
    );
  }

  return null;
};

export default FileStatusBadge;
