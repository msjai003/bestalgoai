import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle, Info } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVerifyingToken, setIsVerifyingToken] = useState(true);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    console.log("ResetPassword page loaded with pathname:", location.pathname);
    console.log("Current search params:", Object.fromEntries(searchParams.entries()));
    console.log("Current hash:", window.location.hash);
    console.log("Full URL:", window.location.href);
    
    const verifyToken = async () => {
      setIsVerifyingToken(true);
      setError(null);
      
      // Extract token from URL, query params, or hash
      let token = searchParams.get('token');
      const fullUrl = window.location.href;
      
      console.log('Reset password page loaded with token param:', token ? `${token.substring(0, 5)}...` : 'null');

      try {
        // Check if we have a hash from magic link
        if (window.location.hash && window.location.hash.includes('access_token=')) {
          console.log('Found magic link hash, processing...');
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');

          if (accessToken && refreshToken) {
            console.log('Setting session from hash tokens');
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });

            if (error) {
              console.error('Error setting session from magic link:', error);
              setError('Your password reset link is invalid or has expired.');
              setIsVerifyingToken(false);
              return;
            }

            if (data.session) {
              console.log('Successfully set session from magic link');
              toast.success('You can now reset your password');
              setIsVerifyingToken(false);
              return;
            }
          }
        } 
        
        // If we have a token in query params, verify it
        else if (token) {
          try {
            console.log('Verifying token...');
            
            // Verify the token directly
            const { data, error } = await supabase.auth.verifyOtp({
              token_hash: token,
              type: 'recovery'
            });

            if (error) {
              console.error('Token verification error:', error);
              
              // Try a second time with decoded token
              try {
                const decodedToken = decodeURIComponent(token);
                console.log('Trying with decoded token');
                const { data: secondData, error: secondError } = await supabase.auth.verifyOtp({
                  token_hash: decodedToken,
                  type: 'recovery'
                });
                
                if (secondError) {
                  console.error('Second token verification attempt failed:', secondError);
                  setError('Invalid or expired password reset link.');
                  setIsVerifyingToken(false);
                  return;
                }
                
                if (secondData) {
                  console.log('Token verified successfully on second attempt');
                  setIsVerifyingToken(false);
                  return;
                }
              } catch (secondAttemptError) {
                console.error('Error in second verification attempt:', secondAttemptError);
              }
              
              setError('Invalid or expired password reset link.');
              setIsVerifyingToken(false);
              return;
            }

            if (data) {
              console.log('Token verified successfully');
              toast.success('You can now reset your password');
              setIsVerifyingToken(false);
              return;
            }
          } catch (verifyError) {
            console.error('Exception during token verification:', verifyError);
            setError('An error occurred while verifying your reset token.');
            setIsVerifyingToken(false);
            return;
          }
        }

        // As a last resort, check if we have an active session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log('Active session found, allowing password reset');
          setIsVerifyingToken(false);
          return;
        }

        // If we get here, we don't have a valid token, hash or session
        console.error('No valid reset token or session found');
        setError('No valid reset token found. Please request a new password reset link.');
        setIsVerifyingToken(false);
      } catch (err) {
        console.error('Error during token verification:', err);
        setError('An error occurred while verifying your reset token.');
        setIsVerifyingToken(false);
      }
    };

    verifyToken();
  }, [searchParams, location]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        setError('Your session has expired. Please request a new password reset link.');
        setIsLoading(false);
        return;
      }

      const { error: resetError } = await updatePassword(newPassword);

      if (resetError) {
        console.error('Error updating password:', resetError);
        setError(resetError.message);
        setIsLoading(false);
      } else {
        setIsSuccess(true);
        toast.success('Password reset successful!');
        
        // Sign out the user after successful password reset
        await supabase.auth.signOut();
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 2000);
      }
    } catch (err: any) {
      console.error('Exception in password reset:', err);
      setError(err.message || 'Failed to reset password');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-charcoalPrimary min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Reset Your Password</h1>
          <p className="text-gray-400">Please enter your new password below</p>
        </div>

        {isVerifyingToken && (
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 text-cyan animate-spin mb-4" />
            <p className="text-white">Verifying your reset link...</p>
          </div>
        )}

        {error && (
          <Alert className="bg-charcoalDanger/10 border-charcoalDanger/30">
            <AlertTriangle className="h-4 w-4 text-charcoalDanger" />
            <AlertDescription className="text-red-200 ml-2">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {isSuccess && (
          <Alert className="bg-cyan/10 border-cyan/30">
            <Info className="h-4 w-4 text-cyan" />
            <AlertDescription className="text-gray-200 ml-2">
              Password reset successful! Redirecting to login page...
            </AlertDescription>
          </Alert>
        )}

        {!isVerifyingToken && !error && (
          <form onSubmit={handleResetPassword} className="space-y-6 premium-card p-6 border border-cyan/30">
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-password" className="text-gray-300">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="bg-charcoalSecondary/50 border-gray-700 text-white h-11 rounded-xl"
                  disabled={isLoading || isSuccess}
                  autoComplete="new-password"
                />
              </div>

              <div>
                <Label htmlFor="confirm-password" className="text-gray-300">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="bg-charcoalSecondary/50 border-gray-700 text-white h-11 rounded-xl"
                  disabled={isLoading || isSuccess}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || isSuccess}
              variant="gradient"
              className="w-full rounded-xl shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
