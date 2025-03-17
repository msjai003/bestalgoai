
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import ForgotPasswordLayout from '@/components/forgot-password/ForgotPasswordLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import ResetPasswordStep from '@/components/forgot-password/ResetPasswordStep';

// Custom error type that might include status
interface ApiError extends Error {
  status?: number;
  statusCode?: number;
  code?: string;
}

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cooldownActive, setCooldownActive] = useState<boolean>(false);
  const [cooldownTime, setCooldownTime] = useState<number>(0);
  const [resetStage, setResetStage] = useState<'request' | 'reset'>('request');
  const [verificationInProgress, setVerificationInProgress] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check if we have an access token in the URL (this means the user clicked the reset link in email)
  useEffect(() => {
    const checkForResetToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get('access_token');
      const type = params.get('type');
      
      if (accessToken && type === 'recovery') {
        // If we have a recovery token, we're in the reset stage
        setVerificationInProgress(true);
        try {
          // Set the session with the token
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: '',
          });
          
          if (error) {
            console.error('Error setting session:', error);
            setErrorMessage('Invalid or expired reset link. Please try again.');
            setResetStage('request');
            setVerificationInProgress(false);
          } else {
            // Successfully authenticated with the token
            setResetStage('reset');
            toast.success('Email verified successfully! Please set your new password');
            setVerificationInProgress(false);
          }
        } catch (error) {
          console.error('Error processing reset token:', error);
          setErrorMessage('An error occurred. Please try again.');
          setResetStage('request');
          setVerificationInProgress(false);
        }
      } else {
        // No token, so we're in the request stage
        setResetStage('request');
        setVerificationInProgress(false);
      }
    };
    
    checkForResetToken();
  }, []);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      // Validate inputs
      if (!email.trim()) {
        setErrorMessage('Please enter your email address.');
        setIsLoading(false);
        return;
      }
      
      // Check if cooldown is active
      if (cooldownActive) {
        setErrorMessage(`Too many attempts. Please wait before trying again (${cooldownTime} seconds remaining).`);
        setIsLoading(false);
        return;
      }
      
      // First, sign in with email and password to verify user exists
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: 'temporary-for-check-only' // We're just checking if the user exists
      });

      // If user doesn't exist, signInError will occur
      if (signInError) {
        // Check if the error is "Invalid login credentials" which means the user exists
        // but password is wrong (which is what we expect)
        if (signInError.message.includes('Invalid login credentials')) {
          // User exists, proceed with password reset
          const { data, error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/forgot-password`,
          });
          
          if (resetError) {
            console.error('Password reset error:', resetError);
            
            // Handle rate limit exceeded error
            if (resetError.message.includes('rate limit') || (resetError as ApiError).code === 'over_email_send_rate_limit') {
              setCooldownActive(true);
              const cooldownPeriod = 60;
              setCooldownTime(cooldownPeriod);
              
              const timer = setInterval(() => {
                setCooldownTime(prev => {
                  if (prev <= 1) {
                    clearInterval(timer);
                    setCooldownActive(false);
                    return 0;
                  }
                  return prev - 1;
                });
              }, 1000);
              
              setErrorMessage(`Rate limit exceeded. Please wait ${cooldownPeriod} seconds before trying again.`);
            } else {
              setErrorMessage(resetError.message || 'Failed to send password reset email');
            }
          } else {
            // Successfully sent the reset email
            toast.success('Password reset link has been sent to your email');
            setErrorMessage(null);
          }
        } else if (signInError.message.includes('user not found') || signInError.message.includes('Invalid user credentials')) {
          setErrorMessage('No account found with this email address');
        } else {
          setErrorMessage(signInError.message || 'Failed to verify account');
        }
      } else {
        // If sign in succeeded with our dummy password, something is wrong
        setErrorMessage('Unexpected authentication response. Please try again.');
      }
    } catch (error: any) {
      console.error('Password reset error:', error);
      setErrorMessage(error?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      // Validate new password
      if (!newPassword.trim() || !confirmPassword.trim()) {
        setErrorMessage('Please enter both password fields');
        setIsLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setErrorMessage('Passwords do not match');
        setIsLoading(false);
        return;
      }

      if (newPassword.length < 8) {
        setErrorMessage('Password must be at least 8 characters');
        setIsLoading(false);
        return;
      }

      // Update the user's password
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Password update error:', error);
        setErrorMessage(error.message || 'Failed to update password');
        setIsLoading(false);
      } else {
        toast.success('Password has been reset successfully');
        // Add a slight delay before redirecting to login
        setTimeout(() => {
          navigate('/auth');
        }, 1500);
      }
    } catch (error: any) {
      console.error('Error setting new password:', error);
      setErrorMessage(error.message || 'Error updating password');
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setResetStage('request');
    setErrorMessage(null);
  };

  return (
    <ForgotPasswordLayout 
      step={resetStage === 'request' ? 1 : 2} 
      errorMessage={errorMessage}
      verificationInProgress={verificationInProgress}
    >
      {resetStage === 'request' ? (
        // Email request form
        <form onSubmit={handleRequestReset} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-gray-300 mb-2 block">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-gray-800/50 border-gray-700 text-white h-12"
              disabled={isLoading || cooldownActive}
            />
          </div>
          
          {cooldownActive && (
            <div className="text-amber-400 text-sm font-medium mt-2">
              Too many attempts. Please wait {cooldownTime} seconds before trying again.
            </div>
          )}
          
          <Button
            type="submit"
            disabled={isLoading || cooldownActive}
            className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-6 rounded-xl shadow-lg"
          >
            {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
          </Button>
        </form>
      ) : (
        // Using the ResetPasswordStep component for the password reset form
        <ResetPasswordStep
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          isLoading={isLoading}
          onSubmit={handleSetNewPassword}
          onBack={handleBack}
        />
      )}
    </ForgotPasswordLayout>
  );
};

export default ForgotPassword;
