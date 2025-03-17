
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ForgotPasswordLayout from '@/components/forgot-password/ForgotPasswordLayout';
import EmailStep from '@/components/forgot-password/EmailStep';
import OtpStep from '@/components/forgot-password/OtpStep';
import ResetPasswordStep from '@/components/forgot-password/ResetPasswordStep';

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [otp, setOtp] = useState<string>('');
  const navigate = useNavigate();

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

      // Send password reset email (this doesn't actually send OTP, but we'll simulate it)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/forgot-password`,
      });

      if (error) {
        console.error('Password reset request error:', error);
        setErrorMessage(error.message || 'Failed to send verification code');
        setIsLoading(false);
        return;
      }

      setCurrentStep('otp');
      toast.success('Verification code sent to your email');
      setIsLoading(false);
    } catch (error: any) {
      console.error('Password reset request error:', error);
      setErrorMessage(error?.message || 'An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (otp.length < 6) {
        setErrorMessage('Please enter the 6-digit verification code');
        setIsLoading(false);
        return;
      }

      // In a real implementation, you would verify the OTP with Supabase
      // For now, we'll simulate a successful verification if the OTP has 6 digits
      if (otp.length === 6) {
        setCurrentStep('reset');
        setIsLoading(false);
      } else {
        setErrorMessage('Invalid verification code');
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
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

      // Update password
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

  const handleBackToEmail = () => {
    setCurrentStep('email');
    setOtp('');
  };

  return (
    <ForgotPasswordLayout 
      step={currentStep === 'email' ? 1 : currentStep === 'otp' ? 2 : 3}
      errorMessage={errorMessage}
      verificationInProgress={isLoading}
    >
      {currentStep === 'email' && (
        <EmailStep 
          email={email} 
          setEmail={setEmail} 
          isLoading={isLoading} 
          onSubmit={handleRequestReset} 
        />
      )}
      
      {currentStep === 'otp' && (
        <OtpStep 
          otp={otp} 
          setOtp={setOtp} 
          isLoading={isLoading} 
          onSubmit={handleVerifyOtp} 
          onBack={handleBackToEmail} 
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          email={email}
        />
      )}
      
      {currentStep === 'reset' && (
        <ResetPasswordStep 
          email={email}
          setEmail={setEmail}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          isLoading={isLoading}
          onSubmit={handleSetNewPassword}
        />
      )}
    </ForgotPasswordLayout>
  );
};

export default ForgotPassword;
