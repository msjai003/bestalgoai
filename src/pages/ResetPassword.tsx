
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

  useEffect(() => {
    const verifyToken = async () => {
      setIsVerifyingToken(true);
      setError(null);
      
      const token = searchParams.get('token');
      const type = searchParams.get('type');
      const reset = searchParams.get('reset');
      
      console.log('Reset password page loaded with params:', { token: token?.substring(0, 5) + '...', type, reset });
      
      // If reset=true parameter is passed, we assume the session is already set up
      if (reset === 'true') {
        console.log('Reset flag is true, checking for active session');
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData.session) {
          console.log('Active session found, ready for password reset');
          setIsVerifyingToken(false);
          return;
        } else {
          console.log('No active session found with reset=true flag');
        }
      }
      
      if (!token) {
        // Check URL hash for tokens (common in magic links)
        if (window.location.hash && window.location.hash.includes('access_token=')) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          
          console.log('Found tokens in URL hash, attempting to set session');
          
          if (accessToken && refreshToken) {
            try {
              const { data, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
              });
              
              if (error) {
                console.error('Error setting session from hash tokens:', error);
                setError('Failed to authenticate with your reset link. Please request a new one.');
                setIsVerifyingToken(false);
                return;
              }
              
              if (data.session) {
                console.log('Session set successfully from hash tokens');
                setIsVerifyingToken(false);
                return;
              }
            } catch (err) {
              console.error('Exception setting session from hash:', err);
            }
          }
        }
        
        // Check if we already have a session regardless
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          console.log('Active session found without token in URL');
          setIsVerifyingToken(false);
          return;
        }
        
        setError('No reset token found. Please use the link from your email.');
        setIsVerifyingToken(false);
        return;
      }
      
      console.log('Verifying token for password reset...');
      try {
        // Try to verify the token if it's a recovery token
        if (type === 'recovery' || !type) {
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'recovery',
          });
          
          if (error) {
            console.error('Token verification error:', error);
            setError('Invalid or expired password reset link.');
            setIsVerifyingToken(false);
            return;
          }
          
          console.log('Token verified successfully:', !!data?.user);
          toast.success('You can now reset your password');
        }
        
        // Check if we have an active session
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          console.log('No session found after token verification');
          setError('Please click the reset link from your email again as your session has expired.');
          setIsVerifyingToken(false);
          return;
        }
        
        console.log('Session found, ready for password reset');
        setIsVerifyingToken(false);
        
      } catch (err) {
        console.error('Error during token verification:', err);
        setError('Failed to verify your reset token. Please try again with a new reset link.');
        setIsVerifyingToken(false);
      }
    };
    
    verifyToken();
  }, [searchParams]);

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
      const { error: resetError } = await updatePassword(newPassword);

      if (resetError) {
        setError(resetError.message);
      } else {
        setIsSuccess(true);
        toast.success('Password reset successful!');
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
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
