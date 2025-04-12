
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Sign out without showing a toast notification
        await signOut();
        // We won't redirect here - we'll just show the UI below
      } catch (error) {
        console.error("Logout error:", error);
      }
    };

    handleLogout();
  }, [signOut]);

  return (
    <div className="min-h-screen bg-charcoalPrimary flex items-center justify-center text-white">
      <div className="text-center premium-card p-8 shadow-xl backdrop-blur-md max-w-md w-full">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-medium mb-3">Logged Out</h1>
        
        <div className="mb-6 p-4 rounded-xl bg-white/10">
          <p className="text-black font-medium bg-white rounded-lg py-3 shadow-sm">
            Successfully signed out
          </p>
        </div>
        
        <Link to="/">
          <Button 
            variant="secondary" 
            className="w-full py-6 text-base font-medium hover:bg-charcoalSecondary/70"
          >
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Logout;
