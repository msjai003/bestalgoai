
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Shield, ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SecuritySettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SecuritySettingsDialog({ open, onOpenChange }: SecuritySettingsDialogProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically validate and update password via API
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    
    toast.success("Password updated successfully");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleTwoFactorToggle = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast.info(`Two-factor authentication ${!twoFactorEnabled ? "enabled" : "disabled"}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 text-white border border-gray-700 sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl flex items-center gap-2">
            <Shield className="w-5 h-5 text-pink-500" />
            Security Settings
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Manage your account security preferences
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 px-1">
          <div className="py-4 space-y-6">
            {/* Password Management Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Password Management</h2>
              
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-sm text-gray-400">
                    Current Password
                  </Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="bg-gray-900 border-gray-700 focus:border-pink-500 focus:ring-pink-500 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-sm text-gray-400">
                    New Password
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="bg-gray-900 border-gray-700 focus:border-pink-500 focus:ring-pink-500 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm text-gray-400">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="bg-gray-900 border-gray-700 focus:border-pink-500 focus:ring-pink-500 text-white"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                >
                  Update Password
                </Button>
              </form>
            </div>
            
            {/* Two-Factor Authentication Section */}
            <div className="pt-2 border-t border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">Two-Factor Authentication</h2>
                <Switch 
                  checked={twoFactorEnabled} 
                  onCheckedChange={handleTwoFactorToggle} 
                  className="data-[state=checked]:bg-pink-600"
                />
              </div>
              <p className="text-sm text-gray-400">
                Enable 2FA for additional account security
              </p>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="mt-4 pt-2 border-t border-gray-700 flex flex-row sm:justify-between gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="bg-gray-900/70 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => {
              toast.success("Security settings saved");
              onOpenChange(false);
            }}
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
