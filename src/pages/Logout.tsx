import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, CheckCircle, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Logout = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [error, setError] = useState<string | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  };

  useEffect(() => {
    const handleLogout = async () => {
      try {
        setIsLoggingOut(true);
        
        clearTimers();
        
        await signOut();
        
        setIsLoggingOut(false);
        
        let seconds = 3;
        setCountdown(seconds);
        
        countdownTimerRef.current = setInterval(() => {
          seconds -= 1;
          setCountdown(seconds);
          
          if (seconds <= 0) {
            clearTimers();
            timerRef.current = setTimeout(() => {
              window.location.href = '/';
            }, 200);
          }
        }, 1000);
      } catch (error) {
        console.error("Logout error:", error);
        clearTimers();
        setError("There was a problem signing out. Please try again.");
        setIsLoggingOut(false);
      }
    };

    handleLogout();

    return () => {
      clearTimers();
    };
  }, [signOut]);

  const handleManualRedirect = () => {
    clearTimers();
    window.location.href = '/';
  };

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
          ) : error ? (
            <div className="text-amber-400">
              <AlertTriangle className="h-12 w-12" />
            </div>
          ) : (
            <div className="text-green-400 animate-scale-in">
              <CheckCircle className="h-12 w-12" />
            </div>
          )}
        </div>
        
        <h1 className="text-2xl font-bold text-center text-white mb-4">
          {isLoggingOut 
            ? "Signing Out" 
            : error 
              ? "Sign Out Issue" 
              : "Successfully Signed Out"}
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
        ) : error ? (
          <Alert className="bg-gray-700/70 border-l-4 border-amber-500 border-gray-600/50 shadow-md mb-4 animate-fade-in">
            <AlertTitle className="text-white font-medium flex items-center gap-2">
              Sign Out Issue
            </AlertTitle>
            <AlertDescription className="text-gray-300 mt-1">
              {error} You can still return to the home page.
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
            : error 
              ? "You can manually return to the home page by clicking below." 
              : "You'll be redirected to the home page shortly."}
        </p>
        
        <div className="mt-6 flex justify-center">
          {isLoggingOut ? (
            <div className="flex space-x-2 items-center">
              <div className="h-2 w-2 rounded-full bg-gray-500 animate-ping"></div>
              <div className="h-2 w-2 rounded-full bg-gray-500 animate-ping" style={{ animationDelay: "0.2s" }}></div>
              <div className="h-2 w-2 rounded-full bg-gray-500 animate-ping" style={{ animationDelay: "0.4s" }}></div>
            </div>
          ) : error ? (
            <button
              onClick={handleManualRedirect}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
            >
              Return to Home
            </button>
          ) : (
            <button
              onClick={handleManualRedirect}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
            >
              Go to Home Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Logout;
