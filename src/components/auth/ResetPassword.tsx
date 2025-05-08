
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenProcessed, setTokenProcessed] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Parse URL for error messages on component mount
  useEffect(() => {
    const url = new URL(window.location.href);
    const errorCode = url.searchParams.get('error_code');
    const errorDescription = url.searchParams.get('error_description');
    
    if (errorCode === 'otp_expired' || url.pathname.includes('error=access_denied')) {
      setErrorMessage('Your password reset link has expired. Please request a new one.');
      setTokenValid(false);
      setTokenProcessed(true);
    } else if (errorDescription) {
      setErrorMessage(decodeURIComponent(errorDescription).replace(/\+/g, ' '));
      setTokenValid(false);
      setTokenProcessed(true);
    }
  }, [location]);

  // Extract and process token from URL
  useEffect(() => {
    const processToken = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      
      try {
        // First check if we already have a valid session
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          console.log("Valid session found, proceeding with password reset");
          setTokenValid(true);
          setTokenProcessed(true);
          setIsLoading(false);
          return;
        }
        
        // Extract token from URL - checking multiple possible locations
        let tokenValue = '';
        
        // Try hash fragment first (most common format from Supabase)
        if (location.hash) {
          const hashParams = new URLSearchParams(location.hash.substring(1));
          tokenValue = hashParams.get('access_token') || '';
          
          // If no structured params, try the whole hash
          if (!tokenValue && location.hash.length > 10) {
            tokenValue = location.hash.substring(1);
          }
        }
        
        // If not in hash, check query params
        if (!tokenValue) {
          const searchParams = new URLSearchParams(location.search);
          tokenValue = searchParams.get('token') || '';
        }
        
        // If no token found in common places, look for it in the path segments
        if (!tokenValue && location.pathname.includes('/')) {
          const pathSegments = location.pathname.split('/');
          // Look for a segment that looks like a token (long string)
          for (const segment of pathSegments) {
            if (segment.length > 20) {
              tokenValue = segment;
              break;
            }
          }
        }
        
        // If still no token, check if it's in the next part of the URL after reset-password
        if (!tokenValue && location.pathname.includes('reset-password')) {
          const parts = location.pathname.split('reset-password');
          if (parts.length > 1 && parts[1].length > 1) {
            // Remove any leading slash and take what appears to be the token
            tokenValue = parts[1].replace(/^\/+/, '');
          }
        }
        
        if (!tokenValue) {
          console.log("No token found in URL");
          setErrorMessage("No password reset token found. Please request a new password reset link.");
          setTokenValid(false);
          setTokenProcessed(true);
          setIsLoading(false);
          return;
        }
        
        console.log("Token found, attempting verification...");
        setToken(tokenValue);
        
        // Try to verify the token or establish a session with it
        try {
          // First try with recovery token verification
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenValue,
            type: 'recovery'
          });
          
          if (error) {
            console.error("Error verifying recovery token:", error);
            
            // Try setting the session with the token
            const sessionResult = await supabase.auth.setSession({
              access_token: tokenValue,
              refresh_token: '',
            });
            
            if (sessionResult.error) {
              console.error("Error setting session:", sessionResult.error);
              setErrorMessage("Your password reset link is invalid or has expired. Please request a new one.");
              setTokenValid(false);
            } else {
              console.log("Session established with token");
              setTokenValid(true);
            }
          } else {
            console.log("OTP verification successful");
            setTokenValid(true);
          }
        } catch (err) {
          console.error("Exception during token verification:", err);
          setErrorMessage("An error occurred while verifying your reset token. Please try again or request a new link.");
          setTokenValid(false);
        }
      } finally {
        setTokenProcessed(true);
        setIsLoading(false);
      }
    };
    
    processToken();
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    // Validate password fields
    if (!password.trim() || !confirmPassword.trim()) {
      setErrorMessage('Please fill in both password fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setErrorMessage('Password should be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check session before proceeding
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setErrorMessage('Your session has expired. Please restart the password reset process.');
        setIsLoading(false);
        return;
      }
      
      // Update the password
      const { error } = await updatePassword(password);
      
      if (error) {
        console.error('Error updating password:', error);
        setErrorMessage(`Failed to update password: ${error.message}`);
      } else {
        toast.success('Password updated successfully! You can now log in with your new password.');
        setTimeout(() => navigate('/auth'), 2000);
      }
    } catch (error: any) {
      console.error('Exception during password reset:', error);
      setErrorMessage(`An unexpected error occurred: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestNewLink = () => {
    navigate('/auth');
    setTimeout(() => toast.info('Please use the "Forgot Password" option on the login page to request a new link.'), 500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Render a different UI based on token verification status
  if (!tokenProcessed) {
    return (
      <div className="bg-charcoalPrimary min-h-screen flex items-center justify-center p-4">
        <div className="bg-charcoalSecondary p-8 rounded-xl border border-gray-700/50 shadow-xl max-w-md w-full text-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyan mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white">Verifying reset link...</h1>
          <p className="text-gray-400 mt-2">Please wait while we verify your password reset link.</p>
        </div>
      </div>
    );
  }

  // Render error UI if token is invalid
  if (tokenProcessed && !tokenValid) {
    return (
      <div className="bg-charcoalPrimary min-h-screen flex items-center justify-center p-4">
        <div className="bg-charcoalSecondary p-8 rounded-xl border border-gray-700/50 shadow-xl max-w-md w-full">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-white text-center mb-2">Password Reset Failed</h1>
          <Alert className="bg-charcoalDanger/10 border-charcoalDanger/30 mb-6" variant="destructive">
            <AlertDescription className="text-red-200">
              {errorMessage || "Your password reset link is invalid or has expired."}
            </AlertDescription>
          </Alert>
          <p className="text-gray-400 text-center mb-6">Password reset links are only valid for a limited time. Please request a new link to reset your password.</p>
          <Button
            onClick={handleRequestNewLink}
            className="w-full bg-cyan hover:bg-cyan/90 text-white py-2 rounded-xl"
          >
            Return to Login
          </Button>
          <div className="mt-4 text-center">
            <Link to="/auth" className="text-cyan hover:underline text-sm">
              <ChevronLeft className="h-4 w-4 inline mr-1" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render the password reset form
  return (
    <div className="bg-charcoalPrimary min-h-screen flex items-center justify-center p-4">
      <div className="bg-charcoalSecondary p-8 rounded-xl border border-gray-700/50 shadow-xl max-w-md w-full">
        <h1 className="text-2xl font-bold text-white text-center mb-2">Reset Password</h1>
        <p className="text-gray-400 text-center mb-8">Enter your new password below</p>
        
        {errorMessage && (
          <Alert className="bg-charcoalDanger/10 border-charcoalDanger/30 mb-6" variant="destructive">
            <AlertTriangle className="h-4 w-4 text-charcoalDanger" />
            <AlertDescription className="text-red-200 ml-2">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-gray-300 mb-2">New Password</label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                className="bg-charcoalPrimary/50 text-white h-11 rounded-xl border border-gray-700 focus:border-cyan focus:ring-2 focus:ring-cyan/30 shadow-sm w-full pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-300 mb-2">Confirm Password</label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className="bg-charcoalPrimary/50 text-white h-11 rounded-xl border border-gray-700 focus:border-cyan focus:ring-2 focus:ring-cyan/30 shadow-sm w-full pr-10"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan hover:bg-cyan/90 text-white py-2 rounded-xl shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Password...
              </>
            ) : (
              'Update Password'
            )}
          </Button>
          
          <div className="mt-4 text-center">
            <Link to="/auth" className="text-cyan hover:underline text-sm">
              <ChevronLeft className="h-4 w-4 inline mr-1" />
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
