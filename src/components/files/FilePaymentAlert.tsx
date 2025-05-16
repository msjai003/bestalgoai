
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FilePaymentAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProceed: () => void;
}

const FilePaymentAlert = ({ open, onOpenChange, onProceed }: FilePaymentAlertProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-charcoalSecondary border-gray-700 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Premium Content</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            This ZIP file is locked and requires a one-time payment of ₹1 to unlock and download.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogAction onClick={() => onOpenChange(false)} className="bg-gray-700 hover:bg-gray-600 text-white">
            Cancel
          </AlertDialogAction>
          <AlertDialogAction onClick={onProceed} className="bg-cyan hover:bg-cyan/80 text-white">
            Proceed to Payment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FilePaymentAlert;
