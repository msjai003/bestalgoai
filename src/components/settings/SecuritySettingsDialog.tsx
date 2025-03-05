
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Shield, Key, Smartphone, Lock, Eye } from "lucide-react";

interface SecuritySettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SecuritySettingsDialog({ open, onOpenChange }: SecuritySettingsDialogProps) {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    twoFactorEnabled: true,
    biometricLoginEnabled: false,
    loginNotifications: true,
    deviceManagement: true,
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Here you would typically save the security settings to an API
    toast.success("Security settings updated successfully");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 text-white border border-gray-700 sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl">Security Settings</DialogTitle>
          <DialogDescription className="text-gray-400">
            Manage your account security and privacy
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4 overflow-y-auto">
          <div className="space-y-6 py-3">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-pink-500 flex items-center gap-2">
                <Lock size={16} />
                Password
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  className="bg-gray-900/50 border-0 focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-opacity-50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="bg-gray-900/50 border-0 focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-opacity-50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  className="bg-gray-900/50 border-0 focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-opacity-50"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-pink-500 flex items-center gap-2">
                <Shield size={16} />
                Two-Factor Authentication
              </h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Enable 2FA</p>
                  <p className="text-xs text-gray-400">Receive verification codes via SMS or authenticator app</p>
                </div>
                <Switch 
                  checked={formData.twoFactorEnabled}
                  onCheckedChange={(checked) => handleChange("twoFactorEnabled", checked)}
                  className="data-[state=checked]:bg-pink-600"
                />
              </div>
              
              {formData.twoFactorEnabled && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Configure 2FA
                </Button>
              )}
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-pink-500 flex items-center gap-2">
                <Eye size={16} />
                Login & Security
              </h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Biometric Login</p>
                  <p className="text-xs text-gray-400">Use fingerprint or face ID to log in on this device</p>
                </div>
                <Switch 
                  checked={formData.biometricLoginEnabled}
                  onCheckedChange={(checked) => handleChange("biometricLoginEnabled", checked)}
                  className="data-[state=checked]:bg-pink-600"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Login Notifications</p>
                  <p className="text-xs text-gray-400">Get notified of new logins to your account</p>
                </div>
                <Switch 
                  checked={formData.loginNotifications}
                  onCheckedChange={(checked) => handleChange("loginNotifications", checked)}
                  className="data-[state=checked]:bg-pink-600"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Device Management</p>
                  <p className="text-xs text-gray-400">View and manage devices logged into your account</p>
                </div>
                <Switch 
                  checked={formData.deviceManagement}
                  onCheckedChange={(checked) => handleChange("deviceManagement", checked)}
                  className="data-[state=checked]:bg-pink-600"
                />
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
              >
                <Key className="w-4 h-4 mr-2" />
                View Active Sessions
              </Button>
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
            onClick={handleSave}
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
