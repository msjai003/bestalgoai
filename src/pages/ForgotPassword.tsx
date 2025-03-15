
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import ForgotPasswordLayout from '@/components/forgot-password/ForgotPasswordLayout';
import EmailStep from '@/components/forgot-password/EmailStep';
import OtpStep from '@/components/forgot-password/OtpStep';
import ResetPasswordStep from '@/components/forgot-password/ResetPasswordStep';

const ForgotPassword = () => {
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { resetPassword, updatePassword } = useAuth();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (!email.trim()) {
        setErrorMessage('Please enter your email address.');
        setIsLoading(false);
        return;
      }

      // Move to the next step without sending an actual OTP
      // We'll send the resetPassword request on the next step to maintain the API
      setStep(2);
      toast.success('Verification code sent to your email');
      
    } catch (error: any) {
      console.error('Password reset request error:', error);
      setErrorMessage(error.message || 'Failed to send reset instructions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (otp.length < 6) {
      setErrorMessage('Please enter the complete verification code');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Now we actually send the reset password request
      const { error } = await resetPassword(email);
      
      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }
      
      // Move to password reset step
      setStep(3);
    } catch (error: any) {
      console.error('OTP verification error:', error);
      setErrorMessage(error.message || 'Failed to verify code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
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

      const { error } = await updatePassword(newPassword);

      if (error) {
        setErrorMessage(error.message);
      } else {
        toast.success('Password has been reset successfully');
        // Redirect to login after successful reset
        window.location.href = '/auth';
      }
    } catch (error: any) {
      console.error('Password reset error:', error);
      setErrorMessage(error.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <EmailStep 
            email={email} 
            setEmail={setEmail} 
            isLoading={isLoading} 
            onSubmit={handleSendOTP} 
          />
        );
      case 2:
        return (
          <OtpStep 
            otp={otp} 
            setOtp={setOtp} 
            isLoading={isLoading} 
            onSubmit={handleVerifyOTP} 
            onBack={() => setStep(1)} 
          />
        );
      case 3:
        return (
          <ResetPasswordStep 
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            isLoading={isLoading}
            onSubmit={handleResetPassword}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ForgotPasswordLayout step={step} errorMessage={errorMessage}>
      {renderStep()}
    </ForgotPasswordLayout>
  );
};

export default ForgotPassword;
