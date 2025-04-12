
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";

const Logout = () => {
  const { signOut } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await signOut();
        // We don't need to show an error if the session is already gone
        // as that's actually the desired end state
      } catch (error) {
        console.error("Logout error:", error);
        // We're not showing an error alert anymore for session not found errors
      }
    };

    // Show toast notification for successful logout
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
      variant: "success",
    });
    
    performLogout();
  }, [signOut]);

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <div className="max-w-md w-full bg-gray-800/70 p-8 shadow-2xl backdrop-blur-lg border border-gray-700/50 rounded-xl">
        <div className="relative mx-auto mb-6 w-16 h-16 flex items-center justify-center">
          <div className="text-green-400 animate-scale-in">
            <CheckCircle className="h-12 w-12" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-white mb-4">
          Successfully Signed Out
        </h1>
        
        <Alert className="bg-gray-700/70 border-l-4 border-green-500 border-gray-600/50 shadow-md mb-4 animate-fade-in">
          <AlertTitle className="text-white font-medium flex items-center gap-2">
            Session Ended
          </AlertTitle>
          <AlertDescription className="text-gray-300 mt-1">
            You have been securely logged out.
          </AlertDescription>
        </Alert>
        
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleGoHome}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
