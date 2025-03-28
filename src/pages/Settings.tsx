
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Bell, User, HelpCircle, Shield, ChevronRight, LogOut } from "lucide-react";
import { SecuritySettingsDialog } from "@/components/settings/SecuritySettingsDialog";
import { PersonalDetailsDialog } from "@/components/settings/PersonalDetails/PersonalDetailsDialog";
import { ProfilePictureUpload } from "@/components/settings/ProfilePictureUpload";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{
    full_name: string;
    email: string;
    profile_picture: string | null;
  }>({
    full_name: "",
    email: "",
    profile_picture: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        console.log("Fetching profile for user ID:", user.id);
        
        const { data, error } = await supabase
          .from('user_profiles')
          .select('full_name, email, profile_picture')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          setUserProfile({
            full_name: "",
            email: user.email || "",
            profile_picture: null
          });
        } else if (data) {
          console.log("Profile data retrieved:", data);
          setUserProfile({
            full_name: data.full_name || "",
            email: data.email || "",
            profile_picture: data.profile_picture
          });
          
          if (data.profile_picture) {
            setProfilePicture(data.profile_picture);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleProfilePictureChange = async (newImageUrl: string) => {
    if (!user) {
      toast.error("You must be logged in to update your profile picture");
      return;
    }
    
    setProfilePicture(newImageUrl);
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ profile_picture: newImageUrl })
        .eq('id', user.id);
          
      if (error) {
        toast.error("Failed to update profile picture");
        console.error("Error updating profile picture:", error);
      } else {
        toast.success("Profile picture uploaded successfully");
        setUserProfile(prev => ({
          ...prev,
          profile_picture: newImageUrl
        }));
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error("Failed to update profile picture");
    }
  };

  const openSecuritySettings = () => {
    setActiveDialog("securitySettings");
  };

  return (
    <div className="min-h-screen bg-charcoalPrimary text-charcoalTextPrimary">
      <header className="fixed top-0 left-0 right-0 bg-charcoalPrimary/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Button 
            variant="ghost" 
            className="p-2 hover:bg-charcoalSecondary hover:text-cyan"
            onClick={() => navigate('/dashboard')}
          >
            <i className="fa-solid fa-arrow-left text-lg"></i>
          </Button>
          <h1 className="text-lg font-semibold text-cyan">Settings</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="p-2 hover:bg-charcoalSecondary hover:text-cyan">
                  <HelpCircle className="w-5 h-5 text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-[250px] bg-charcoalSecondary text-charcoalTextPrimary border-gray-700">
                <p className="text-sm">Need help? Hover over any setting to learn more, or visit our Help Center for detailed guidance.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      <main className="pt-16 pb-24">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin h-8 w-8 border-4 border-cyan rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <>
            <section className="px-4 py-6">
              <div className="flex items-center space-x-4">
                <ProfilePictureUpload 
                  currentImageUrl={profilePicture}
                  onImageChange={handleProfilePictureChange}
                />
                <div>
                  <h2 className="text-lg font-semibold">{userProfile.full_name || "User"}</h2>
                  <p className="text-sm text-charcoalTextSecondary">{userProfile.email || "No email available"}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 mt-2 rounded-full text-xs font-medium bg-cyan/20 text-cyan">
                    Premium Trader
                  </span>
                </div>
              </div>
            </section>

            <section className="px-4">
              <div className="space-y-4">
                <div className="bg-charcoalSecondary/50 rounded-xl p-4 shadow-lg backdrop-blur-sm border border-gray-800/50">
                  <h3 className="text-sm font-medium text-cyan/80 mb-3">Account Settings</h3>
                  <div className="space-y-3">
                    <SettingsLink 
                      icon={<User className="w-5 h-5 text-cyan" />} 
                      label="Personal Details" 
                      onClick={() => setActiveDialog("personalDetails")}
                    />
                    <SettingsLink 
                      icon={<Shield className="w-5 h-5 text-cyan" />} 
                      label="Security Settings" 
                      onClick={() => setActiveDialog("securitySettings")}
                    />
                    <SettingsLink 
                      icon={<Bell className="w-5 h-5 text-cyan" />} 
                      label="Notifications" 
                      onClick={() => navigate("/notifications")}
                      className="bg-cyan/10 hover:bg-cyan/20" // Added cyan background
                    />
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        <section className="fixed bottom-0 left-0 right-0 p-4 bg-charcoalPrimary/95 backdrop-blur-lg border-t border-gray-800">
          <Button 
            variant="default"
            size="default"
            className="w-full flex items-center justify-center gap-2 bg-cyan hover:bg-cyan/90 rounded-lg font-medium shadow-lg transition-colors text-charcoalPrimary"
            onClick={() => navigate('/logout')}
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </section>
      </main>

      <SecuritySettingsDialog
        open={activeDialog === "securitySettings"}
        onOpenChange={(open) => setActiveDialog(open ? "securitySettings" : null)}
      />
      <PersonalDetailsDialog
        open={activeDialog === "personalDetails"}
        onOpenChange={(open) => setActiveDialog(open ? "personalDetails" : null)}
        onOpenSecuritySettings={openSecuritySettings}
      />
    </div>
  );
};

const SettingsLink = ({ 
  icon, 
  label, 
  onClick,
  className = "" 
}: { 
  icon: React.ReactNode; 
  label: string; 
  onClick?: () => void;
  className?: string;
}) => (
  <button 
    className={`flex items-center justify-between py-3 px-2 w-full text-left rounded-lg hover:bg-charcoalSecondary/50 transition-colors ${className}`}
    onClick={onClick}
  >
    <div className="flex items-center space-x-3">
      {icon}
      <span>{label}</span>
    </div>
    <ChevronRight className="w-4 h-4 text-gray-500" />
  </button>
);

export default Settings;
