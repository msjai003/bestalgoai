
import { ProfilePictureUpload } from "../ProfilePictureUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface PersonalInfoFormProps {
  fullName: string;
  email: string;
  profilePicture: string;
  editMode: {
    fullName: boolean;
    email: boolean;
  };
  onToggleEditMode: (field: "fullName" | "email") => void;
  onFieldChange: (field: "fullName" | "email", value: string) => void;
  onProfilePictureChange: (url: string) => void;
}

export const PersonalInfoForm = ({
  fullName,
  email,
  profilePicture,
  editMode,
  onToggleEditMode,
  onFieldChange,
  onProfilePictureChange,
}: PersonalInfoFormProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-center mb-6">
        <ProfilePictureUpload 
          currentImageUrl={profilePicture}
          onImageChange={onProfilePictureChange}
        />
      </div>

      <div className="bg-charcoalSecondary/50 rounded-xl p-3 sm:p-4 backdrop-blur-xl border border-gray-700">
        <div className="flex justify-between items-center">
          <Label htmlFor="fullName" className="text-xs sm:text-sm text-cyan/80">Full Name</Label>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-gray-400 hover:text-cyan"
            onClick={() => onToggleEditMode("fullName")}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </div>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => onFieldChange("fullName", e.target.value)}
          className={`w-full bg-transparent border-none mt-1 focus:outline-none text-sm sm:text-base text-white h-8 sm:h-10 px-0 ${!editMode.fullName ? 'cursor-not-allowed opacity-80' : ''}`}
          readOnly={!editMode.fullName}
        />
      </div>
      
      <div className="bg-charcoalSecondary/50 rounded-xl p-3 sm:p-4 backdrop-blur-xl border border-gray-700">
        <div className="flex justify-between items-center">
          <Label htmlFor="email" className="text-xs sm:text-sm text-cyan/80">Email</Label>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-gray-400 hover:text-cyan"
            onClick={() => onToggleEditMode("email")}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </div>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onFieldChange("email", e.target.value)}
          className={`w-full bg-transparent border-none mt-1 focus:outline-none text-sm sm:text-base text-white h-8 sm:h-10 px-0 ${!editMode.email ? 'cursor-not-allowed opacity-80' : ''}`}
          readOnly={!editMode.email}
        />
      </div>
    </div>
  );
};
