
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Logout = () => {
  const { signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performLogout = async () => {
      try {
        await signOut();
        setIsLoggingOut(false);
      } catch (error) {
        console.error("Logout error:", error);
        setError("There was a problem signing out. Please try again.");
        setIsLoggingOut(false);
      }
    };

    performLogout();
  }, [signOut]);

  const handleGoHome = () => {
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
        
        {isLoggingOut ? null : error ? (
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
              You have been securely logged out.
            </AlertDescription>
          </Alert>
        )}
        
        {!isLoggingOut && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleGoHome}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
            >
              Return to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logout;
