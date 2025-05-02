
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

  useEffect(() => {
    // Extract token from URL query params and hash
    const extractTokenFromUrl = () => {
      const searchParams = new URLSearchParams(location.search);
      const urlToken = searchParams.get('token');
      
      if (urlToken) {
        console.log("Found token in query params");
        setToken(urlToken);
        setupSessionWithToken(urlToken);
        return;
      }
      
      // Check hash for tokens (for compatibility with various link formats)
      if (location.hash) {
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const hashToken = hashParams.get('access_token');
        
        if (hashToken) {
          console.log("Found token in hash fragment");
          setToken(hashToken);
          setupSessionWithToken(hashToken);
          return;
        }
        
        // Some Supabase tokens might be after the # without params
        const potentialToken = location.hash.substring(1);
        if (potentialToken && potentialToken.length > 30) {
          console.log("Found potential token in hash");
          setToken(potentialToken);
          setupSessionWithToken(potentialToken);
          return;
        }
      }
      
      // If no token found in URL
      console.log("No token found in URL");
    };
    
    extractTokenFromUrl();
  }, [location]);

  // Setup session with token immediately when component loads or token changes
  const setupSessionWithToken = async (tokenToUse: string) => {
    if (!tokenToUse) {
      console.log("No token provided to setupSessionWithToken");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      console.log("Attempting to set session with token:", tokenToUse.substring(0, 10) + "...");
      
      // First attempt to set the session with the token
      const { data, error } = await supabase.auth.setSession({
        access_token: tokenToUse,
        refresh_token: '',
      });
      
      if (error) {
        console.error('Error setting session:', error);
        setErrorMessage(`Invalid or expired token: ${error.message}`);
        setSessionEstablished(false);
      } else {
        console.log("Session established successfully:", data);
        setSessionEstablished(true);
        toast.success('Ready to update your password');
      }
    } catch (error: any) {
      console.error('Exception during session setup:', error);
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
      // If session isn't established yet, try to establish it now
      if (!sessionEstablished && token) {
        console.log("Session not yet established, attempting to set it now");
        
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: token,
          refresh_token: '',
        });
        
        if (sessionError) {
          console.error('Error setting session during password update:', sessionError);
          setErrorMessage(`Cannot update password: ${sessionError.message}. Please try the password reset process again.`);
          setIsLoading(false);
          return;
        }
        
        console.log("Session set successfully before password update");
      }
      
      // Verify we have a valid session before updating password
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        console.error('No active session found before password update');
        setErrorMessage('No active session found. Please restart the password reset process.');
        setIsLoading(false);
        return;
      }
      
      console.log("Valid session confirmed, updating password");
      
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

  // Updated UI to match the provided image
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
                    setupSessionWithToken(newToken);
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
            disabled={isLoading || (!sessionEstablished && !!token)}
            className="w-full bg-cyan hover:bg-cyan/90 text-white py-2 rounded-full" 
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Password...
              </>
            ) : !sessionEstablished && token ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying Token...
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
