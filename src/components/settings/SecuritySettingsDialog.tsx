
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Shield, ChevronLeft, ChevronRight, Lock, Bell } from "lucide-react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 2;

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

  const handleSaveChanges = () => {
    toast.success("Security settings saved");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900/95 backdrop-blur-xl border border-gray-700 text-gray-100 p-4 sm:p-6 rounded-xl w-[95%] max-w-md mx-auto shadow-xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-pink-500" />
            Security Settings {currentPage > 1 && `(${currentPage}/${totalPages})`}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Manage your account security preferences
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          {currentPage === 1 && (
            <div className="space-y-4">
              {/* Password Management Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Password Management</h2>
                
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 backdrop-blur-xl border border-gray-700">
                    <Label htmlFor="current-password" className="text-xs sm:text-sm text-gray-400">
                      Current Password
                    </Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full bg-transparent border-none mt-1 focus:outline-none text-sm sm:text-base text-white h-8 sm:h-10 px-0"
                    />
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 backdrop-blur-xl border border-gray-700">
                    <Label htmlFor="new-password" className="text-xs sm:text-sm text-gray-400">
                      New Password
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full bg-transparent border-none mt-1 focus:outline-none text-sm sm:text-base text-white h-8 sm:h-10 px-0"
                    />
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 backdrop-blur-xl border border-gray-700">
                    <Label htmlFor="confirm-password" className="text-xs sm:text-sm text-gray-400">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full bg-transparent border-none mt-1 focus:outline-none text-sm sm:text-base text-white h-8 sm:h-10 px-0"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 py-5 sm:py-6 rounded-xl text-sm sm:text-base font-medium shadow-xl border-0"
                  >
                    Update Password
                  </Button>
                </form>
              </div>
            </div>
          )}
          
          {currentPage === 2 && (
            <div className="space-y-4">
              {/* Two-Factor Authentication Section */}
              <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 backdrop-blur-xl border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold">Two-Factor Authentication</h2>
                  <Switch 
                    checked={twoFactorEnabled} 
                    onCheckedChange={handleTwoFactorToggle} 
                    className="data-[state=checked]:bg-pink-600"
                  />
                </div>
                <p className="text-sm text-gray-400">
                  Enable 2FA for additional account security. This adds an extra layer of protection to your account.
                </p>
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
                  Advanced Security Options
                </button>
                <button className="text-pink-500 flex items-center gap-2 text-sm sm:text-base">
                  <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
                  Security Notifications
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
}
