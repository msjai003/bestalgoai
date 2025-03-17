
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
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

      // First check if account exists
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: 'temporary-for-check-only'
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          // Send reset password email and then update password in one step
          const { data: resetData, error: resetError } = await supabase.auth.resetPasswordForEmail(email);
          
          if (resetError) {
            console.error('Password reset error:', resetError);
            setErrorMessage(resetError.message || 'Failed to reset password');
            setIsLoading(false);
            return;
          }
          
          // Create a new session for the user
          const { data: sessionData, error: sessionError } = await supabase.auth.signInWithOtp({
            email
          });
          
          if (sessionError) {
            console.error('Session creation error:', sessionError);
            setErrorMessage(sessionError.message || 'Failed to authenticate');
            setIsLoading(false);
            return;
          }
          
          // Update password
          const { data: updateData, error: updateError } = await supabase.auth.updateUser({
            password: newPassword
          });
          
          if (updateError) {
            console.error('Password update error:', updateError);
            setErrorMessage(updateError.message || 'Failed to update password');
            setIsLoading(false);
            return;
          }
          
          toast.success('Password has been reset successfully');
          setTimeout(() => {
            navigate('/auth');
          }, 1500);
        } else if (signInError.message.includes('user not found') || signInError.message.includes('Invalid user credentials')) {
          setErrorMessage('No account found with this email address');
          setIsLoading(false);
        } else {
          setErrorMessage(signInError.message || 'Failed to verify account');
          setIsLoading(false);
        }
      } else {
        // User exists and has valid credentials, let's update the password
        const { data: updateData, error: updateError } = await supabase.auth.updateUser({
          password: newPassword
        });
        
        if (updateError) {
          console.error('Password update error:', updateError);
          setErrorMessage(updateError.message || 'Failed to update password');
          setIsLoading(false);
          return;
        }
        
        toast.success('Password has been reset successfully');
        setTimeout(() => {
          navigate('/auth');
        }, 1500);
      }
    } catch (error: any) {
      console.error('Password reset error:', error);
      setErrorMessage(error?.message || 'An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <ForgotPasswordLayout 
      step={1}
      errorMessage={errorMessage}
      verificationInProgress={false}
    >
      <form onSubmit={handleResetPassword} className="space-y-6">
        <div>
          <Label htmlFor="email" className="text-gray-300 mb-2 block">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="bg-gray-800/50 border-gray-700 text-white h-12 mb-4"
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
          {isLoading ? 'Resetting Password...' : 'Reset Password'}
        </Button>
      </form>
    </ForgotPasswordLayout>
  );
};

export default ForgotPassword;
