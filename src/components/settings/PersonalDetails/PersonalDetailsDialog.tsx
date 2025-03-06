
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { ContactInfoForm } from "./ContactInfoForm";
import { DialogNavigation } from "./DialogNavigation";

interface PersonalDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenSecuritySettings?: () => void;
}

export const PersonalDetailsDialog = ({
  open,
  onOpenChange,
  onOpenSecuritySettings,
}: PersonalDetailsDialogProps) => {
  const [formState, setFormState] = useState({
    fullName: "Rahul Sharma",
    email: "rahul.s@gmail.com",
    phone: "+91 98765 43210",
    dateOfBirth: "15 Aug 1990",
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 2;
  const [profilePicture, setProfilePicture] = useState<string>(
    "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
  );
  const [editMode, setEditMode] = useState({
    fullName: false,
    email: false,
    phone: false,
    dateOfBirth: false
  });

  const toggleEditMode = (field: keyof typeof editMode) => {
    setEditMode(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleFieldChange = (field: keyof typeof formState, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = () => {
    toast.success("Personal details updated successfully");
    onOpenChange(false);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to handle opening the security settings dialog
  const handleOpenSecuritySettings = () => {
    // Close the current dialog first
    onOpenChange(false);
    // Then open the security settings dialog
    if (onOpenSecuritySettings) {
      setTimeout(() => {
        onOpenSecuritySettings();
      }, 100); // Small delay to ensure proper dialog transition
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900/95 backdrop-blur-xl border border-gray-700 text-gray-100 p-4 sm:p-6 rounded-xl w-[95%] max-w-md mx-auto shadow-xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-semibold mb-4">
            Personal Details {currentPage > 1 && `(${currentPage}/${totalPages})`}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          {currentPage === 1 && (
            <PersonalInfoForm
              fullName={formState.fullName}
              email={formState.email}
              profilePicture={profilePicture}
              editMode={{
                fullName: editMode.fullName,
                email: editMode.email
              }}
              onToggleEditMode={(field) => toggleEditMode(field)}
              onFieldChange={handleFieldChange}
              onProfilePictureChange={setProfilePicture}
            />
          )}
          
          {currentPage === 2 && (
            <ContactInfoForm
              phone={formState.phone}
              dateOfBirth={formState.dateOfBirth}
              editMode={{
                phone: editMode.phone,
                dateOfBirth: editMode.dateOfBirth
              }}
              onToggleEditMode={(field) => toggleEditMode(field)}
              onFieldChange={handleFieldChange}
              onSaveChanges={handleSaveChanges}
              onOpenSecuritySettings={handleOpenSecuritySettings}
            />
          )}
        </ScrollArea>
        
        <DialogNavigation
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={goToPrevPage}
          onNextPage={goToNextPage}
        />
      </DialogContent>
    </Dialog>
  );
};
