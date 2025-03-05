
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PersonalDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PersonalDetailsDialog({ open, onOpenChange }: PersonalDetailsDialogProps) {
  const [formData, setFormData] = useState({
    fullName: "Rahul Sharma",
    email: "rahul.s@gmail.com",
    phone: "+91 9876543210",
    address: "123 Trading Street, Mumbai 400001",
    bio: "Professional trader specializing in algorithmic trading strategies for 5+ years."
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Here you would typically save the data to an API or state management
    toast.success("Personal details updated successfully");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 text-white border border-gray-800 sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-bold">Personal Details</DialogTitle>
          <DialogDescription className="text-gray-400">
            Update your personal information below
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4 overflow-y-auto">
          <div className="space-y-4 py-3">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm text-gray-300">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:bg-gray-700 focus:text-white focus:border-[#FF00D4] focus-visible:outline-none focus-visible:ring-0 focus-visible:border-[#FF00D4] hover:bg-gray-700 hover:text-white hover:border-[#FF00D4] active:bg-gray-700 active:text-white active:border-[#FF00D4]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-gray-300">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:bg-gray-700 focus:text-white focus:border-[#FF00D4] focus-visible:outline-none focus-visible:ring-0 focus-visible:border-[#FF00D4] hover:bg-gray-700 hover:text-white hover:border-[#FF00D4] active:bg-gray-700 active:text-white active:border-[#FF00D4]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm text-gray-300">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:bg-gray-700 focus:text-white focus:border-[#FF00D4] focus-visible:outline-none focus-visible:ring-0 focus-visible:border-[#FF00D4] hover:bg-gray-700 hover:text-white hover:border-[#FF00D4] active:bg-gray-700 active:text-white active:border-[#FF00D4]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm text-gray-300">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:bg-gray-700 focus:text-white focus:border-[#FF00D4] focus-visible:outline-none focus-visible:ring-0 focus-visible:border-[#FF00D4] hover:bg-gray-700 hover:text-white hover:border-[#FF00D4] active:bg-gray-700 active:text-white active:border-[#FF00D4]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm text-gray-300">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:bg-gray-700 focus:text-white focus:border-[#FF00D4] focus-visible:outline-none focus-visible:ring-0 focus-visible:border-[#FF00D4] hover:bg-gray-700 hover:text-white hover:border-[#FF00D4] active:bg-gray-700 active:text-white active:border-[#FF00D4]"
                rows={3}
              />
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="mt-4 pt-4 border-t border-gray-800 flex flex-col sm:flex-row sm:justify-between gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto bg-gray-900/50 border border-gray-700 rounded-lg text-white hover:bg-gray-700 hover:text-white hover:border-[#FF00D4]"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="w-full sm:w-auto bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-6 rounded-lg shadow-lg hover:from-[#FF00D4] hover:to-purple-700"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
