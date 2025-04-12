
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Logout = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(true);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        setIsLoggingOut(true);
        
        // Let AuthContext handle the toast, don't show one here
        await signOut();
        
        // Signal success
        setIsLoggingOut(false);
        
        // Start countdown before redirect
        let seconds = 3;
        setCountdown(seconds);
        
        const timer = setInterval(() => {
          seconds -= 1;
          setCountdown(seconds);
          
          if (seconds <= 0) {
            clearInterval(timer);
            navigate('/');
          }
        }, 1000);
        
        return () => clearInterval(timer);
      } catch (error) {
        console.error("Logout error:", error);
        // Even if there's an error, redirect to home
        navigate('/');
      }
    };

    handleLogout();
  }, [navigate, signOut]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <div className="max-w-md w-full bg-gray-800/70 p-8 shadow-2xl backdrop-blur-lg border border-gray-700/50 rounded-xl">
        <div className="relative mx-auto mb-6 w-16 h-16 flex items-center justify-center">
          {isLoggingOut ? (
            <>
              <div className="absolute inset-0 rounded-full border-4 border-gray-600/20"></div>
              <div className="absolute inset-0 rounded-full border-t-4 border-gray-400 animate-spin"></div>
              <LogOut className="text-gray-300 h-8 w-8" />
            </>
          ) : (
            <div className="text-green-400 animate-scale-in">
              <CheckCircle className="h-12 w-12" />
            </div>
          )}
        </div>
        
        <h1 className="text-2xl font-bold text-center text-white mb-4">
          {isLoggingOut ? "Signing Out" : "Successfully Signed Out"}
        </h1>
        
        {isLoggingOut ? (
          <Alert className="bg-gray-700/70 border border-gray-600/50 shadow-md mb-4 animate-fade-in">
            <AlertTitle className="text-white font-medium flex items-center gap-2">
              Session Termination
            </AlertTitle>
            <AlertDescription className="text-gray-300 mt-1">
              We're securely ending your session and clearing your credentials.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="bg-gray-700/70 border-l-4 border-green-500 border-gray-600/50 shadow-md mb-4 animate-fade-in">
            <AlertTitle className="text-white font-medium flex items-center gap-2">
              Session Ended
            </AlertTitle>
            <AlertDescription className="text-gray-300 mt-1">
              You have been securely logged out. Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
            </AlertDescription>
          </Alert>
        )}
        
        <p className="text-gray-400 text-center text-sm mt-4">
          {isLoggingOut 
            ? "Please wait while we complete the process..." 
            : "You'll be redirected to the home page shortly."}
        </p>
        
        <div className="mt-6 flex justify-center">
          {isLoggingOut && (
            <div className="flex space-x-2 items-center">
              <div className="h-2 w-2 rounded-full bg-gray-500 animate-ping"></div>
              <div className="h-2 w-2 rounded-full bg-gray-500 animate-ping" style={{ animationDelay: "0.2s" }}></div>
              <div className="h-2 w-2 rounded-full bg-gray-500 animate-ping" style={{ animationDelay: "0.4s" }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Logout;
