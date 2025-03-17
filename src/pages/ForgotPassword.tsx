
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
      
      // First check if the email exists by trying to reset the password
      const { error: checkError } = await supabase.auth.resetPasswordForEmail(email);
      
      if (checkError) {
        console.error('Password reset request error:', checkError);
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

      // Now update the password for the user
      // Note: In a real implementation, this would require further verification
      // But for this simplified flow, we'll just update the password directly
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        console.error('Password update error:', updateError);
        const apiError = updateError as ApiError;
        if (apiError.status === 504 || apiError.statusCode === 504 || apiError.message?.includes('timeout')) {
          setErrorMessage('The server took too long to respond. Please try again.');
        } else {
          setErrorMessage(updateError.message || 'Failed to update password');
        }
        setIsLoading(false);
        return;
      }

      toast.success('Password has been reset successfully');
      // Redirect to login after successful reset
      window.location.href = '/auth';
      
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      // Check for timeout or network errors
      if (error && ((error as ApiError).status === 504 || error.message?.includes('timeout'))) {
        setErrorMessage('Network timeout. Please check your connection and try again.');
      } else {
        setErrorMessage(error?.message || 'Failed to reset password');
      }
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
            disabled={isLoading}
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
          />
        </div>
        
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-6 rounded-xl shadow-lg"
        >
          {isLoading ? 'Resetting Password...' : 'Reset Password'}
        </Button>
      </form>
    </ForgotPasswordLayout>
  );
};

export default ForgotPassword;
