
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Home, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Check if this might be an auth callback that wasn't caught by our routes
    if (location.pathname.includes('/auth/') && location.pathname.includes('/callback')) {
      handlePossibleAuthCallback();
    }
  }, [location.pathname]);

  const handlePossibleAuthCallback = async () => {
    setIsCheckingAuth(true);
    try {
      console.log("Detected possible auth callback on 404 page:", location.pathname);
      
      // Check if we have an active session
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData.session) {
        console.log("Found active session on 404 page, redirecting to dashboard");
        toast.success("Authentication successful! Redirecting to dashboard...");
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        console.log("No active session found on 404 page");
        setIsCheckingAuth(false);
      }
    } catch (error) {
      console.error("Error checking auth in 404 page:", error);
      setIsCheckingAuth(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-charcoalPrimary text-white">
        <Loader className="h-8 w-8 animate-spin text-cyan mx-auto mb-4" />
        <p className="text-gray-300">Checking authentication status...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoalPrimary text-white">
      <div className="text-center p-8 max-w-md mx-auto bg-charcoalSecondary rounded-xl border border-gray-700/50 shadow-xl">
        <div className="mb-6">
          <div className="h-24 w-24 mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan to-purple-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan to-purple-500">404</h1>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-3 text-white">Page Not Found</h2>
        <p className="text-gray-300 mb-4">The page you're looking for doesn't exist or has been moved.</p>
        
        <div className="bg-charcoalPrimary/40 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-gray-400">
            <span className="font-semibold text-gray-300">Current URL:</span>{" "}
            <span className="break-all text-red-400">{location.pathname}</span>
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-cyan to-purple-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
          >
            <Home className="h-4 w-4" />
            Go to Home
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-charcoalPrimary border border-gray-700 rounded-lg text-gray-300 font-medium hover:bg-charcoalPrimary/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
