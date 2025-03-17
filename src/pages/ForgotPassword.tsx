
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import ForgotPasswordLayout from '@/components/forgot-password/ForgotPasswordLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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
          // User exists, proceed with password update
          // Send a password reset link to the user's email
          const { data, error: updateError } = await supabase.auth.admin.updateUserById(
            email,
            { password: newPassword }
          );

          if (updateError) {
            console.error('Password update error:', updateError);
            
            // Handle rate limit exceeded error
            if (updateError.message.includes('rate limit') || (updateError as ApiError).code === 'over_email_send_rate_limit') {
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
              setErrorMessage(updateError.message || 'Failed to update password');
            }
          } else {
            // Password reset initiated successfully
            toast.success('Password has been reset successfully');
            // Navigate to login page
            navigate('/auth');
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
