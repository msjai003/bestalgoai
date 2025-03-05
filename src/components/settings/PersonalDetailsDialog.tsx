
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
import { Camera, Bell, Lock } from "lucide-react";
import { toast } from "sonner";

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

  const handleChangeProfilePicture = () => {
    toast.info("Profile picture upload functionality will be added later");
  };

  const handleSaveChanges = () => {
    toast.success("Personal details updated successfully");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900/95 backdrop-blur-xl border border-gray-700 text-gray-100 p-6 rounded-xl max-w-md w-[90%] shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold mb-4">Personal Details</DialogTitle>
        </DialogHeader>
        
        <div className="relative w-24 h-24 mx-auto mb-8">
          <img 
            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" 
            alt="Profile" 
            className="rounded-full w-full h-full object-cover border-2 border-pink-500"
          />
          <button 
            onClick={handleChangeProfilePicture}
            className="absolute bottom-0 right-0 bg-pink-500 rounded-full p-2 shadow-lg"
          >
            <Camera className="h-4 w-4 text-white" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-xl border border-gray-700">
            <Label htmlFor="fullName" className="text-sm text-gray-400">Full Name</Label>
            <Input
              id="fullName"
              value={formState.fullName}
              onChange={(e) => setFormState({...formState, fullName: e.target.value})}
              className="w-full bg-transparent border-none mt-1 focus:outline-none text-white"
            />
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-xl border border-gray-700">
            <Label htmlFor="email" className="text-sm text-gray-400">Email</Label>
            <Input
              id="email"
              type="email"
              value={formState.email}
              onChange={(e) => setFormState({...formState, email: e.target.value})}
              className="w-full bg-transparent border-none mt-1 focus:outline-none text-white"
            />
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-xl border border-gray-700">
            <Label htmlFor="phone" className="text-sm text-gray-400">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formState.phone}
              onChange={(e) => setFormState({...formState, phone: e.target.value})}
              className="w-full bg-transparent border-none mt-1 focus:outline-none text-white"
            />
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-xl border border-gray-700">
            <Label htmlFor="dateOfBirth" className="text-sm text-gray-400">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              value={formState.dateOfBirth}
              onChange={(e) => setFormState({...formState, dateOfBirth: e.target.value})}
              className="w-full bg-transparent border-none mt-1 focus:outline-none text-white"
            />
          </div>
          
          <div className="mt-8 space-y-4">
            <Button 
              onClick={handleSaveChanges}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 py-6 rounded-xl font-medium shadow-xl border-0"
            >
              Save Changes
            </Button>
            <DialogClose asChild>
              <Button 
                variant="outline" 
                className="w-full border border-gray-700 bg-transparent text-white py-6 rounded-xl font-medium"
              >
                Cancel
              </Button>
            </DialogClose>
          </div>
          
          <div className="mt-6 flex flex-col items-center gap-4">
            <button className="text-pink-500 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Change Password
            </button>
            <button className="text-pink-500 flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notification Settings
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
