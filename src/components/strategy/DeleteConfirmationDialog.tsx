
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  strategyName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmationDialog = ({
  open,
  onOpenChange,
  strategyName,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Confirm Wishlist Removal
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Are you sure you want to remove <span className="font-semibold text-pink-400">{strategyName}</span> from your wishlist? You can add it back later if you change your mind.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button 
            variant="secondary" 
            className="bg-gray-700 hover:bg-gray-600 text-gray-200"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={onConfirm}
          >
            Yes, Remove From Wishlist
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
