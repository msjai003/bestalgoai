
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pencil, Bell, Lock } from "lucide-react";
import { DialogClose } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface ContactInfoFormProps {
  phone: string;
  editMode: {
    phone: boolean;
  };
  onToggleEditMode: (field: "phone") => void;
  onFieldChange: (field: "phone", value: string) => void;
  onSaveChanges: () => void;
  onOpenSecuritySettings: () => void;
}

export const ContactInfoForm = ({
  phone,
  editMode,
  onToggleEditMode,
  onFieldChange,
  onSaveChanges,
  onOpenSecuritySettings,
}: ContactInfoFormProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 backdrop-blur-xl border border-gray-700">
        <div className="flex justify-between items-center">
          <Label htmlFor="phone" className="text-xs sm:text-sm text-gray-400">Phone</Label>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-gray-400 hover:text-white"
            onClick={() => onToggleEditMode("phone")}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </div>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => onFieldChange("phone", e.target.value)}
          className={`w-full bg-transparent border-none mt-1 focus:outline-none text-sm sm:text-base text-white h-8 sm:h-10 px-0 ${!editMode.phone ? 'cursor-not-allowed opacity-80' : ''}`}
          readOnly={!editMode.phone}
        />
      </div>
      
      <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
        <Button 
          onClick={onSaveChanges}
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
        <button 
          className="text-pink-500 flex items-center gap-2 text-sm sm:text-base"
          onClick={onOpenSecuritySettings}
        >
          <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
          Change Password
        </button>
        <button 
          className="text-pink-500 flex items-center gap-2 text-sm sm:text-base"
          onClick={() => navigate('/notifications')}
        >
          <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
          Notification Settings
        </button>
      </div>
    </div>
  );
};
