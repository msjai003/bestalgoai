
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionEstablished, setSessionEstablished] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Function to directly use a token we find
  const tryToUseToken = async (tokenValue: string) => {
    console.log("Attempting to use token:", tokenValue.substring(0, 10) + "...");
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: tokenValue,
        type: 'recovery'
      });
      
      if (error) {
        console.error("Error verifying OTP:", error);
        setErrorMessage(`Error verifying token: ${error.message}`);
        return false;
      }
      
      console.log("OTP verification successful:", data);
      setSessionEstablished(true);
      toast.success("Token verified successfully");
      return true;
    } catch (err) {
      console.error("Exception during OTP verification:", err);
      return false;
    }
  };

  useEffect(() => {
    // Extract token from URL query params, hash, and pathname
    const extractTokenFromUrl = () => {
      setIsLoading(true);
      setErrorMessage(null);
      
      console.log("Current location:", location);
      
      // Try to extract from hash
      if (location.hash) {
        console.log("Checking hash:", location.hash);
        
        // Check if hash contains an access_token parameter
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        
        if (accessToken) {
          console.log("Found access_token in hash");
          setToken(accessToken);
          handleTokenAuthentication(accessToken);
          return;
        }
        
        // If hash doesn't have params but looks like a token itself
        const rawHash = location.hash.substring(1);
        if (rawHash && rawHash.length > 20) {
          console.log("Using raw hash as token");
          setToken(rawHash);
          handleTokenAuthentication(rawHash);
          return;
        }
      }
      
      // Try to extract from query params
      const searchParams = new URLSearchParams(location.search);
      const queryToken = searchParams.get('token');
      
      if (queryToken) {
        console.log("Found token in query params");
        setToken(queryToken);
        handleTokenAuthentication(queryToken);
        return;
      }

      // No token found in URL
      console.log("No token found in URL");
      setIsLoading(false);
    };
    
    extractTokenFromUrl();
  }, [location]);

  const handleTokenAuthentication = async (tokenValue: string) => {
    setIsLoading(true);
    console.log("Attempting authentication with token");
    
    try {
      // First try with recovery OTP verification
      const otpSuccess = await tryToUseToken(tokenValue);
      
      if (otpSuccess) {
        console.log("OTP verification succeeded");
        setIsLoading(false);
        return;
      }
      
      console.log("OTP verification failed, trying session approach");
      
      // If OTP fails, try with access token
      const { data, error } = await supabase.auth.setSession({
        access_token: tokenValue,
        refresh_token: '',
      });
      
      if (error) {
        console.error("Error setting session:", error);
        setErrorMessage(`Unable to verify token: ${error.message}`);
        setSessionEstablished(false);
      } else {
        console.log("Session established:", data);
        setSessionEstablished(true);
        toast.success("Ready to update your password");
      }
    } catch (error: any) {
      console.error("Exception during token authentication:", error);
      setErrorMessage(`An unexpected error occurred: ${error.message}`);
      setSessionEstablished(false);
    } finally {
      setIsLoading(false);
    }
  };

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
      // First check if we have a valid session
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        console.error('No active session found - trying one more time with token');
        
        if (token) {
          // Try one more time with the token
          const { data, error } = await supabase.auth.setSession({
            access_token: token,
            refresh_token: '',
          });
          
          if (error || !data.session) {
            setErrorMessage('No active session. Please restart the password reset process.');
            setIsLoading(false);
            return;
          }
          
          console.log("Last-minute session recovery succeeded");
        } else {
          setErrorMessage('No active session or token. Please restart the password reset process.');
          setIsLoading(false);
          return;
        }
      }
      
      console.log("Updating password");
      
      // Now update the password
      const { error } = await updatePassword(password);
      
      if (error) {
        console.error('Error updating password:', error);
        setErrorMessage(`Failed to update password: ${error.message}`);
      } else {
        toast.success('Password has been reset successfully!');
        navigate('/auth');
      }
    } catch (error: any) {
      console.error('Exception during password reset:', error);
      setErrorMessage(`An unexpected error occurred: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-charcoalPrimary min-h-screen flex items-center justify-center">
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
          {!token && (
            <div>
              <label htmlFor="token" className="block text-gray-300 mb-2">Reset Token</label>
              <Input
                id="token"
                type="text"
                value={token}
                onChange={(e) => {
                  const newToken = e.target.value;
                  setToken(newToken);
                  if (newToken.trim().length > 30) {
                    handleTokenAuthentication(newToken);
                  }
                }}
                placeholder="Paste your reset token here"
                className="bg-gray-100 text-gray-900 h-11 rounded-md w-full"
              />
            </div>
          )}
          
          <div>
            <label htmlFor="password" className="block text-gray-300 mb-2">New Password</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-gray-100 text-gray-900 h-11 rounded-md w-full"
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-300 mb-2">Confirm Password</label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-gray-100 text-gray-900 h-11 rounded-md w-full"
            />
          </div>
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan hover:bg-cyan/90 text-white py-2 rounded-full"
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
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
