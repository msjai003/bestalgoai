
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Check if this might be an auth URL that's failing
    if (location.pathname.includes('auth/v1') || 
        location.pathname.includes('verify') || 
        location.pathname.includes('callback') ||
        location.pathname.includes('recovery') ||
        location.search.includes('type=recovery') ||
        location.pathname === '/reset-password') {
      console.error("Auth link 404 detected, redirecting to auth handler");
      
      // For auth verification links, redirect to the AuthVerifyHandler
      setTimeout(() => {
        navigate('/auth/v1/verify' + location.search + location.hash, { replace: true });
      }, 100);
      return;
    }
  }, [location.pathname, location.search, location.hash, navigate]);

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
            <span className="break-all text-red-400">{location.pathname + location.search}</span>
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
        
        {(location.pathname.includes('callback') || 
          location.pathname.includes('verify') ||
          location.pathname.includes('recovery') ||
          location.search.includes('type=recovery')) && (
          <div className="mt-6">
            <Link 
              to="/auth" 
              className="text-cyan hover:underline"
            >
              Return to Login Page
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotFound;
