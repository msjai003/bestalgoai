
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';
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

  // Function to directly authenticate with a token
  const authenticateWithToken = async (tokenValue: string) => {
    console.log("Authenticating with token:", tokenValue.substring(0, 10) + "...");
    setIsLoading(true);
    
    try {
      // First try with recovery OTP verification
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: tokenValue,
        type: 'recovery'
      });
      
      if (error) {
        console.error("Error verifying OTP:", error);
        
        // If OTP verification fails, try setting session with token
        const sessionResult = await supabase.auth.setSession({
          access_token: tokenValue,
          refresh_token: '',
        });
        
        if (sessionResult.error) {
          console.error("Error setting session:", sessionResult.error);
          setErrorMessage(`Unable to verify reset token. Please try the password reset process again.`);
          setSessionEstablished(false);
          setIsLoading(false);
          return false;
        } else {
          console.log("Session established successfully");
          setSessionEstablished(true);
          setIsLoading(false);
          return true;
        }
      } else {
        console.log("OTP verification successful:", data);
        setSessionEstablished(true);
        setIsLoading(false);
        return true;
      }
    } catch (err) {
      console.error("Exception during authentication:", err);
      setErrorMessage(`An unexpected error occurred. Please try again.`);
      setIsLoading(false);
      return false;
    }
  };

  // Extract token from URL on component mount
  useEffect(() => {
    const extractAndUseToken = () => {
      setIsLoading(true);
      setErrorMessage(null);
      
      console.log("Analyzing current URL:", location);
      
      let foundToken = '';
      
      // Try to extract from hash fragment (#)
      if (location.hash) {
        console.log("Checking hash:", location.hash);
        
        // Check if hash contains an access_token parameter
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        
        if (accessToken) {
          console.log("Found access_token in hash parameters");
          foundToken = accessToken;
        } else {
          // If hash doesn't have params but looks like a token itself
          const rawHash = location.hash.substring(1);
          if (rawHash && rawHash.length > 20) {
            console.log("Using raw hash as token");
            foundToken = rawHash;
          }
        }
      }
      
      // If no token in hash, try search params (?)
      if (!foundToken) {
        const searchParams = new URLSearchParams(location.search);
        const queryToken = searchParams.get('token');
        
        if (queryToken) {
          console.log("Found token in query parameters");
          foundToken = queryToken;
        }
      }
      
      // If token found, authenticate with it
      if (foundToken) {
        setToken(foundToken);
        authenticateWithToken(foundToken);
      } else {
        console.log("No token found in URL");
        setIsLoading(false);
      }
    };
    
    extractAndUseToken();
  }, [location]);

  // Verify session before updating password
  const verifySessionBeforeUpdate = async () => {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
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
      const hasSession = await verifySessionBeforeUpdate();
      
      if (!hasSession) {
        console.log('No active session found - attempting to recover session with token');
        
        if (token && !await authenticateWithToken(token)) {
          setErrorMessage('Authentication failed. Please restart the password reset process.');
          setIsLoading(false);
          return;
        }
      }
      
      // Double-check session after recovery attempt
      const sessionCheck = await verifySessionBeforeUpdate();
      if (!sessionCheck) {
        setErrorMessage('Unable to establish a valid session. Please restart the password reset process.');
        setIsLoading(false);
        return;
      }
      
      console.log("Session verified. Updating password now");
      
      // Now update the password - we removed the toast notification here
      const { error } = await updatePassword(password);
      
      if (error) {
        console.error('Error updating password:', error);
        setErrorMessage(`Failed to update password: ${error.message}`);
      } else {
        // Navigate to auth page without showing a toast notification
        setTimeout(() => navigate('/auth'), 1000);
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
                    authenticateWithToken(newToken);
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
              placeholder="Enter your new password"
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
              placeholder="Enter your confirm password"
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
