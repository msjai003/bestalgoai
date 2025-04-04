import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Shield, ChevronLeft, ChevronRight, Lock, Bell, Eye, EyeOff } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

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
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  // State for password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Get user email when component mounts
  useEffect(() => {
    const getUserEmail = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    };
    
    getUserEmail();
  }, []);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (!userEmail) {
      toast.error("User email not found. Please try signing in again.");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // First authenticate the user with current password to verify identity
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: currentPassword
      });
      
      if (signInError) {
        console.error("Error verifying current password:", signInError);
        toast.error("Current password is incorrect");
        setIsLoading(false);
        return;
      }
      
      // Update the password in Supabase auth
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (updateError) {
        console.error("Error updating password:", updateError);
        toast.error(updateError.message || "Failed to update password");
        setIsLoading(false);
        return;
      }
      
      // Success
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsLoading(false);
    } catch (error) {
      console.error("Exception during password update:", error);
      toast.error("An error occurred while updating password");
      setIsLoading(false);
    }
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
      <DialogContent className="bg-charcoalPrimary/95 backdrop-blur-xl border border-gray-700 text-charcoalTextPrimary p-4 sm:p-6 rounded-xl w-[95%] max-w-md mx-auto shadow-xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan" />
            Security Settings {currentPage > 1 && `(${currentPage}/${totalPages})`}
          </DialogTitle>
          <DialogDescription className="text-charcoalTextSecondary">
            Manage your account security preferences
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4 mt-2">
          {currentPage === 1 && (
            <div className="space-y-4">
              {/* Password Management Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Password Management</h2>
                
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div className="bg-charcoalSecondary/50 rounded-xl p-3 sm:p-4 backdrop-blur-xl border border-gray-700">
                    <Label htmlFor="current-password" className="text-xs sm:text-sm text-charcoalTextSecondary block mb-1">
                      Current Password
                    </Label>
                    <div className="pl-4 relative">
                      <Input
                        id="current-password"
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full bg-transparent border-none focus:outline-none text-sm sm:text-base text-white h-8 sm:h-10 px-0 pr-8"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-charcoalSecondary/50 rounded-xl p-3 sm:p-4 backdrop-blur-xl border border-gray-700">
                    <Label htmlFor="new-password" className="text-xs sm:text-sm text-charcoalTextSecondary block mb-1">
                      New Password
                    </Label>
                    <div className="pl-4 relative">
                      <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full bg-transparent border-none focus:outline-none text-sm sm:text-base text-white h-8 sm:h-10 px-0 pr-8"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-charcoalSecondary/50 rounded-xl p-3 sm:p-4 backdrop-blur-xl border border-gray-700">
                    <Label htmlFor="confirm-password" className="text-xs sm:text-sm text-charcoalTextSecondary block mb-1">
                      Confirm New Password
                    </Label>
                    <div className="pl-4 relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full bg-transparent border-none focus:outline-none text-sm sm:text-base text-white h-8 sm:h-10 px-0 pr-8"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-cyan text-charcoalPrimary py-5 sm:py-6 rounded-xl text-sm sm:text-base font-medium shadow-xl border-0 hover:bg-cyan/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </div>
            </div>
          )}
          
          {currentPage === 2 && (
            <div className="space-y-4">
              {/* Two-Factor Authentication Section */}
              <div className="bg-charcoalSecondary/50 rounded-xl p-3 sm:p-4 backdrop-blur-xl border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold">Two-Factor Authentication</h2>
                  <Switch 
                    checked={twoFactorEnabled} 
                    onCheckedChange={handleTwoFactorToggle}
                  />
                </div>
                <p className="text-sm text-charcoalTextSecondary">
                  Enable 2FA for additional account security. This adds an extra layer of protection to your account.
                </p>
              </div>
              
              <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                <Button 
                  onClick={handleSaveChanges}
                  className="w-full bg-cyan text-charcoalPrimary py-5 sm:py-6 rounded-xl text-sm sm:text-base font-medium shadow-xl border-0 hover:bg-cyan/90"
                >
                  Save Changes
                </Button>
                <DialogClose asChild>
                  <Button 
                    variant="outline" 
                    className="w-full border border-gray-700 bg-transparent text-white py-5 sm:py-6 rounded-xl text-sm sm:text-base font-medium hover:bg-charcoalSecondary/30"
                  >
                    Cancel
                  </Button>
                </DialogClose>
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
                className={`w-2 h-2 rounded-full ${currentPage === i+1 ? 'bg-cyan' : 'bg-gray-600'}`}
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
