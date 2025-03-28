
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { DialogClose } from "@/components/ui/dialog";

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
  return (
    <div className="space-y-4">
      <div className="bg-charcoalSecondary/50 rounded-xl p-3 sm:p-4 backdrop-blur-xl border border-gray-700">
        <div className="flex justify-between items-center">
          <Label htmlFor="phone" className="text-xs sm:text-sm text-cyan/80">Phone</Label>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-gray-400 hover:text-cyan"
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
          className="w-full bg-cyan text-charcoalPrimary py-5 sm:py-6 rounded-xl text-sm sm:text-base font-medium shadow-xl border-0 hover:bg-cyan/90"
        >
          Save Changes
        </Button>
        <DialogClose asChild>
          <Button 
            variant="outline" 
            className="w-full border border-gray-700 bg-transparent text-white py-5 sm:py-6 rounded-xl text-sm sm:text-base font-medium hover:bg-charcoalSecondary/30 hover:text-cyan"
          >
            Cancel
          </Button>
        </DialogClose>
      </div>
    </div>
  );
};
