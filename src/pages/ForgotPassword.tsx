
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import ForgotPasswordLayout from '@/components/forgot-password/ForgotPasswordLayout';
import EmailStep from '@/components/forgot-password/EmailStep';
import OtpStep from '@/components/forgot-password/OtpStep';

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

      // Send the actual reset password email
      const { error } = await resetPassword(email);
      
      if (error) {
        console.error('Password reset request error:', error);
        
        // Handle timeout errors specifically
        if (error.status === 504 || error.message?.includes('timeout')) {
          setErrorMessage('The server took too long to respond. Please try again.');
        } else {
          setErrorMessage(error.message || 'Failed to send reset instructions');
        }
        
        setIsLoading(false);
        return;
      }
      
      // Move to the OTP step
      setStep(2);
      toast.success('Verification code sent to your email');
      
    } catch (error: any) {
      console.error('Password reset request error:', error);
      
      // Check for timeout or network errors
      if (error.status === 504 || error.message?.includes('timeout')) {
        setErrorMessage('Network timeout. Please check your connection and try again.');
      } else {
        setErrorMessage(error.message || 'Failed to send reset instructions');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      // Validate OTP
      if (otp.length < 6) {
        setErrorMessage('Please enter the complete verification code');
        setIsLoading(false);
        return;
      }

      // Validate passwords
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
      
      // Update the password
      const { error: updateError } = await updatePassword(newPassword);

      if (updateError) {
        // Handle timeout errors specifically
        if (updateError.status === 504 || updateError.message?.includes('timeout')) {
          setErrorMessage('The server took too long to respond. Please try again.');
        } else {
          setErrorMessage(updateError.message);
        }
      } else {
        toast.success('Password has been reset successfully');
        // Redirect to login after successful reset
        window.location.href = '/auth';
      }
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      // Check for timeout or network errors
      if (error.status === 504 || error.message?.includes('timeout')) {
        setErrorMessage('Network timeout. Please check your connection and try again.');
      } else {
        setErrorMessage(error.message || 'Failed to reset password');
      }
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
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            isLoading={isLoading} 
            onSubmit={handleResetPassword} 
            onBack={() => setStep(1)} 
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
