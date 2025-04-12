
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle, LogOut } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Logout = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Let AuthContext handle the toast, don't show one here
        await signOut();
        // Redirect to home page after logout
        navigate('/');
      } catch (error) {
        console.error("Logout error:", error);
        // Even if there's an error, redirect to home
        navigate('/');
      }
    };

    handleLogout();
  }, [navigate, signOut]);

  return (
    <div className="min-h-screen bg-charcoalPrimary flex items-center justify-center text-white">
      <div className="max-w-md w-full premium-card p-8 shadow-2xl backdrop-blur-lg border border-gray-700/50 rounded-xl">
        <div className="relative mx-auto mb-6 w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-gray-600/20 animate-pulse"></div>
          <div className="absolute inset-0 rounded-full border-t-4 border-gray-400 animate-spin"></div>
          <LogOut className="text-gray-300 h-8 w-8" />
        </div>
        
        <h1 className="text-2xl font-bold text-center text-white mb-4">Logging Out</h1>
        
        <Alert className="bg-charcoalSecondary/60 border-gray-600/30 shadow-md mb-4">
          <AlertTitle className="text-white font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-gray-300" />
            Session Ending
          </AlertTitle>
          <AlertDescription className="text-gray-300 mt-1">
            We're securely ending your session and clearing your credentials.
          </AlertDescription>
        </Alert>
        
        <p className="text-gray-400 text-center text-sm mt-4">You will be redirected to the home page shortly.</p>
        
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2 items-center">
            <div className="h-2 w-2 rounded-full bg-gray-500 animate-ping"></div>
            <div className="h-2 w-2 rounded-full bg-gray-500 animate-ping" style={{ animationDelay: "0.2s" }}></div>
            <div className="h-2 w-2 rounded-full bg-gray-500 animate-ping" style={{ animationDelay: "0.4s" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;
