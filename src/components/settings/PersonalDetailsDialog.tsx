
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, Lock, ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProfilePictureUpload } from "./ProfilePictureUpload";

interface PersonalDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PersonalDetailsDialog = ({
  open,
  onOpenChange,
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
    phone: true,
    dateOfBirth: true
  });

  const toggleEditMode = (field: keyof typeof editMode) => {
    setEditMode(prev => ({
      ...prev,
      [field]: !prev[field]
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
            <div className="space-y-4">
              <div className="flex justify-center mb-6">
                <ProfilePictureUpload 
                  currentImageUrl={profilePicture}
                  onImageChange={setProfilePicture}
                />
              </div>

              <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 backdrop-blur-xl border border-gray-700">
                <div className="flex justify-between items-center">
                  <Label htmlFor="fullName" className="text-xs sm:text-sm text-gray-400">Full Name</Label>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-gray-400 hover:text-white"
                    onClick={() => toggleEditMode('fullName')}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Input
                  id="fullName"
                  value={formState.fullName}
                  onChange={(e) => setFormState({...formState, fullName: e.target.value})}
                  className="w-full bg-transparent border-none mt-1 focus:outline-none text-sm sm:text-base text-white h-8 sm:h-10 px-0"
                  readOnly={!editMode.fullName}
                  style={{ opacity: editMode.fullName ? 1 : 0.8 }}
                />
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 backdrop-blur-xl border border-gray-700">
                <div className="flex justify-between items-center">
                  <Label htmlFor="email" className="text-xs sm:text-sm text-gray-400">Email</Label>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-gray-400 hover:text-white"
                    onClick={() => toggleEditMode('email')}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Input
                  id="email"
                  type="email"
                  value={formState.email}
                  onChange={(e) => setFormState({...formState, email: e.target.value})}
                  className="w-full bg-transparent border-none mt-1 focus:outline-none text-sm sm:text-base text-white h-8 sm:h-10 px-0"
                  readOnly={!editMode.email}
                  style={{ opacity: editMode.email ? 1 : 0.8 }}
                />
              </div>
            </div>
          )}
          
          {currentPage === 2 && (
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 backdrop-blur-xl border border-gray-700">
                <Label htmlFor="phone" className="text-xs sm:text-sm text-gray-400">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formState.phone}
                  onChange={(e) => setFormState({...formState, phone: e.target.value})}
                  className="w-full bg-transparent border-none mt-1 focus:outline-none text-sm sm:text-base text-white h-8 sm:h-10 px-0"
                />
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 backdrop-blur-xl border border-gray-700">
                <Label htmlFor="dateOfBirth" className="text-xs sm:text-sm text-gray-400">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  value={formState.dateOfBirth}
                  onChange={(e) => setFormState({...formState, dateOfBirth: e.target.value})}
                  className="w-full bg-transparent border-none mt-1 focus:outline-none text-sm sm:text-base text-white h-8 sm:h-10 px-0"
                />
              </div>
              
              <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                <Button 
                  onClick={handleSaveChanges}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 py-5 sm:py-6 rounded-xl text-sm sm:text-base font-medium shadow-xl border-0"
                >
                  Save Changes
                </Button>
                <DialogClose asChild>
                  <Button 
                    variant="outline" 
                    className="w-full border border-gray-700 bg-transparent text-white py-5 sm:py-6 rounded-xl text-sm sm:text-base font-medium"
                  >
                    Cancel
                  </Button>
                </DialogClose>
              </div>
              
              <div className="mt-5 sm:mt-6 flex flex-col items-center gap-3 sm:gap-4">
                <button className="text-pink-500 flex items-center gap-2 text-sm sm:text-base">
                  <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
                  Change Password
                </button>
                <button className="text-pink-500 flex items-center gap-2 text-sm sm:text-base">
                  <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
                  Notification Settings
                </button>
              </div>
            </div>
          )}
        </ScrollArea>
        
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
          <Button 
            onClick={goToPrevPage} 
            disabled={currentPage === 1}
            variant="ghost" 
            className={`px-3 ${currentPage === 1 ? 'invisible' : ''}`}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          
          <div className="flex gap-1">
            {Array.from({length: totalPages}).map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full ${currentPage === i+1 ? 'bg-pink-500' : 'bg-gray-600'}`}
              />
            ))}
          </div>
          
          <Button 
            onClick={goToNextPage} 
            disabled={currentPage === totalPages}
            variant="ghost" 
            className={`px-3 ${currentPage === totalPages ? 'invisible' : ''}`}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
