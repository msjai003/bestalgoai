
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ForgotPasswordLayout from '@/components/forgot-password/ForgotPasswordLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resetRequested, setResetRequested] = useState<boolean>(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we have a reset token in the URL
  useEffect(() => {
    const hashParams = new URLSearchParams(location.hash.substring(1));
    const type = hashParams.get('type');
    const accessToken = hashParams.get('access_token');
    
    if (type === 'recovery' && accessToken) {
      setResetToken(accessToken);
      // Get user email if available
      const getUserEmail = async () => {
        const { data, error } = await supabase.auth.getUser(accessToken);
        if (data?.user?.email && !error) {
          setEmail(data.user.email);
        }
      };
      getUserEmail();
    }
  }, [location]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (!email.trim()) {
        setErrorMessage('Please enter your email address.');
        setIsLoading(false);
        return;
      }

      // Send password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/forgot-password`,
      });

      if (error) {
        console.error('Password reset request error:', error);
        setErrorMessage(error.message || 'Failed to send reset email');
        setIsLoading(false);
        return;
      }

      setResetRequested(true);
      toast.success('Password reset link sent to your email');
      setIsLoading(false);
    } catch (error: any) {
      console.error('Password reset request error:', error);
      setErrorMessage(error?.message || 'An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
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

      // Update password using the reset token
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        console.error('Password update error:', error);
        setErrorMessage(error.message || 'Failed to update password');
        setIsLoading(false);
        return;
      }
      
      toast.success('Password has been reset successfully');
      setTimeout(() => {
        navigate('/auth');
      }, 1500);
    } catch (error: any) {
      console.error('Password update error:', error);
      setErrorMessage(error?.message || 'An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <ForgotPasswordLayout 
      step={resetToken ? 2 : 1}
      errorMessage={errorMessage}
      verificationInProgress={false}
    >
      {resetToken ? (
        // Show password reset form when we have a token
        <form onSubmit={handleSetNewPassword} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-gray-300 mb-2 block">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-gray-800/50 border-gray-700 text-white h-12 mb-4"
              disabled={true} // Email is readonly when resetting password
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-6 rounded-xl shadow-lg"
          >
            {isLoading ? 'Updating Password...' : 'Update Password'}
          </Button>
        </form>
      ) : resetRequested ? (
        // Show confirmation message after reset email is sent
        <div className="text-center py-6">
          <h3 className="text-xl font-semibold mb-4">Check Your Email</h3>
          <p className="text-gray-400 mb-6">
            We've sent a password reset link to <span className="text-white">{email}</span>.
            Click the link in the email to reset your password.
          </p>
          <p className="text-gray-400 mb-6">
            If you don't see the email, check your spam folder.
          </p>
          <Button
            type="button"
            onClick={() => setResetRequested(false)}
            className="mt-4 bg-gray-700 hover:bg-gray-600 text-white"
          >
            Try Again
          </Button>
        </div>
      ) : (
        // Show email input form initially
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
              disabled={isLoading}
            />
          </div>
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-6 rounded-xl shadow-lg"
          >
            {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
          </Button>
        </form>
      )}
    </ForgotPasswordLayout>
  );
};

export default ForgotPassword;
