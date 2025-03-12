
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Bell, Building, TrendingUp, Shield, User, HelpCircle } from "lucide-react";
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
  const [profilePicture, setProfilePicture] = useState<string>(
    "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
  );
  const [userProfile, setUserProfile] = useState<{
    full_name: string;
    email: string;
  }>({
    full_name: "",
    email: ""
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          // Get user profile from Supabase
          const { data, error } = await supabase
            .from('user_profiles')
            .select('full_name, email')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching user profile:', error);
            return;
          }

          if (data) {
            setUserProfile({
              full_name: data.full_name,
              email: data.email
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const openSecuritySettings = () => {
    setActiveDialog("securitySettings");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Button 
            variant="ghost" 
            className="p-2"
            onClick={() => navigate('/dashboard')}
          >
            <i className="fa-solid fa-arrow-left text-lg"></i>
          </Button>
          <h1 className="text-lg font-semibold">Settings</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="p-2">
                  <HelpCircle className="w-5 h-5 text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-[250px] bg-gray-800 text-gray-100 border-gray-700">
                <p className="text-sm">Need help? Hover over any setting to learn more, or visit our Help Center for detailed guidance.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      <main className="pt-16 pb-24">
        <section className="px-4 py-6">
          <div className="flex items-center space-x-4">
            <ProfilePictureUpload 
              currentImageUrl={profilePicture}
              onImageChange={setProfilePicture}
            />
            <div>
              <h2 className="text-lg font-semibold">{userProfile.full_name || "User"}</h2>
              <p className="text-sm text-gray-400">{userProfile.email || "No email available"}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 mt-2 rounded-full text-xs font-medium bg-gradient-to-r from-pink-600 to-purple-600">
                Premium Trader
              </span>
            </div>
          </div>
        </section>

        <section className="px-4">
          <div className="space-y-4">
            <div className="bg-gray-800/50 rounded-xl p-4 shadow-lg backdrop-blur-sm">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Account Settings</h3>
              <div className="space-y-3">
                <SettingsLink 
                  icon={<User className="w-5 h-5 text-pink-500" />} 
                  label="Personal Details" 
                  onClick={() => setActiveDialog("personalDetails")}
                />
                <SettingsLink 
                  icon={<Shield className="w-5 h-5 text-pink-500" />} 
                  label="Security Settings" 
                  onClick={() => setActiveDialog("securitySettings")}
                />
                <SettingsLink 
                  icon={<Bell className="w-5 h-5 text-pink-500" />} 
                  label="Notifications" 
                  onClick={() => navigate("/notifications")}
                />
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4 shadow-lg backdrop-blur-sm">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Trading Settings</h3>
              <div className="space-y-3">
                <SettingsLink 
                  icon={<Building className="w-5 h-5 text-pink-500" />} 
                  label="Broker Integration" 
                  onClick={() => navigate("/broker-integration")}
                />
                <SettingsLink 
                  icon={<TrendingUp className="w-5 h-5 text-pink-500" />} 
                  label="Risk Management" 
                  onClick={() => navigate("/risk-management")}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
          <Button 
            className="w-full py-6 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg font-medium shadow-lg hover:from-pink-700 hover:to-purple-700"
            onClick={() => navigate('/logout')}
          >
            Logout
          </Button>
        </section>
      </main>

      {/* Dialogs */}
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
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  onClick?: () => void;
}) => (
  <button 
    className="flex items-center justify-between py-2 w-full text-left"
    onClick={onClick}
  >
    <div className="flex items-center space-x-3">
      {icon}
      <span>{label}</span>
    </div>
    <i className="fa-solid fa-chevron-right text-gray-500"></i>
  </button>
);

export default Settings;
