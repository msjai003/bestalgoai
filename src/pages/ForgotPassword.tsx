
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import ForgotPasswordLayout from '@/components/forgot-password/ForgotPasswordLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

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
  const { resetPassword } = useAuth();

  const handleResetPassword = async (e: React.FormEvent) => {
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
      
      // Check if cooldown is active
      if (cooldownActive) {
        setErrorMessage(`Too many attempts. Please wait before trying again (${cooldownTime} seconds remaining).`);
        setIsLoading(false);
        return;
      }
      
      // First check if the email exists in Supabase
      const { data: userExists, error: checkError } = await supabase.auth.resetPasswordForEmail(email);
      
      if (checkError) {
        console.error('Password reset request error:', checkError);
        
        // Handle rate limit exceeded error
        if (checkError.message.includes('rate limit') || (checkError as ApiError).code === 'over_email_send_rate_limit') {
          setCooldownActive(true);
          // Set a 60-second cooldown (adjust as needed)
          const cooldownPeriod = 60;
          setCooldownTime(cooldownPeriod);
          
          // Start cooldown timer
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
          
          setErrorMessage(`Email rate limit exceeded. Please wait ${cooldownPeriod} seconds before trying again.`);
          setIsLoading(false);
          return;
        }
        
        if (checkError.message.includes('user not found')) {
          setErrorMessage('No account found with this email address');
        } else {
          // Handle timeout errors specifically - safely check status property
          const apiError = checkError as ApiError;
          if (apiError.status === 504 || apiError.statusCode === 504 || apiError.message?.includes('timeout')) {
            setErrorMessage('The server took too long to respond. Please try again.');
          } else {
            setErrorMessage(checkError.message || 'Failed to reset password');
          }
        }
        setIsLoading(false);
        return;
      }

      // Since resetPasswordForEmail does not immediately change the password but sends an email,
      // we need to inform the user that further instructions were sent
      toast.success('Password reset instructions have been sent to your email');
      
      // Reset the form and show a helpful message
      setNewPassword('');
      setConfirmPassword('');
      setErrorMessage('Check your email for password reset instructions');
      setIsLoading(false);
      
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      // Check for timeout or network errors
      if (error && ((error as ApiError).status === 504 || error.message?.includes('timeout'))) {
        setErrorMessage('Network timeout. Please check your connection and try again.');
      } else {
        setErrorMessage(error?.message || 'Failed to reset password');
      }
      setIsLoading(false);
    }
  };

  return (
    <ForgotPasswordLayout step={1} errorMessage={errorMessage}>
      <form onSubmit={handleResetPassword} className="space-y-6">
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
      
        <div>
          <Label htmlFor="newPassword" className="text-gray-300 mb-2 block">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            className="bg-gray-800/50 border-gray-700 text-white h-12 mb-4"
            disabled={isLoading || cooldownActive}
          />
        </div>
      
        <div>
          <Label htmlFor="confirmPassword" className="text-gray-300 mb-2 block">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
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
          {isLoading ? 'Resetting Password...' : 'Reset Password'}
        </Button>
      </form>
    </ForgotPasswordLayout>
  );
};

export default ForgotPassword;
