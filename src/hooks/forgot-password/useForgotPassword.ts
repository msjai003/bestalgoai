
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useResetFormState } from './useResetFormState';
import { useEmailVerification } from './useEmailVerification';
import { useMagicLinkVerification } from './useMagicLinkVerification';

export const useForgotPassword = () => {
  const navigate = useNavigate();
  const {
    email,
    setEmail,
    otp,
    setOtp,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    setIsLoading,
    errorMessage,
    setErrorMessage,
    currentStep,
    setCurrentStep,
    verificationInProgress,
    setVerificationInProgress,
    verificationId,
    setVerificationId,
    resetLinkSent,
    setResetLinkSent,
    magicLinkSessionActive,
    setMagicLinkSessionActive,
  } = useResetFormState();

  const { sendOtpToEmail, verifyOtp } = useEmailVerification();

  useMagicLinkVerification(
    setEmail,
    setMagicLinkSessionActive,
    setCurrentStep,
    setVerificationInProgress,
    setErrorMessage,
    verificationId,
  );

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

      console.log(`Requesting password reset for email: ${email}`);
      
      await sendOtpToEmail(email);
      
      const newVerificationId = Date.now().toString();
      setVerificationId(newVerificationId);
      
      sessionStorage.setItem(`email_${newVerificationId}`, email);
      
      setResetLinkSent(true);
      setCurrentStep('otp');
      toast.success('A reset link has been sent to your email. Check your email for the link or use the numeric code.');
      console.log("Email sent successfully, moved to OTP step");
      
    } catch (error: any) {
      console.error('Password reset request error:', error);
      setErrorMessage(error?.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      if (!email) {
        if (verificationId) {
          const storedEmail = sessionStorage.getItem(`email_${verificationId}`);
          if (storedEmail) {
            setEmail(storedEmail);
            await sendOtpToEmail(storedEmail);
            toast.success('New verification code sent to your email');
            return;
          }
        }
        throw new Error('Email address not found. Please go back and enter your email.');
      }
      
      await sendOtpToEmail(email);
      toast.success('New verification code sent to your email');
    } catch (error: any) {
      console.error('Error resending OTP:', error);
      toast.error(error?.message || 'Failed to resend verification code');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (!otp.trim() || otp.length !== 6) {
        setErrorMessage('Please enter a valid 6-digit verification code');
        setIsLoading(false);
        return;
      }

      if (!verificationId) {
        setErrorMessage('Verification session expired. Please restart the process.');
        setIsLoading(false);
        return;
      }
      
      const storedEmail = sessionStorage.getItem(`email_${verificationId}`);
      if (!storedEmail) {
        setErrorMessage('Verification session not found. Please restart the process.');
        setIsLoading(false);
        return;
      }
      
      setEmail(storedEmail);
      
      await verifyOtp(storedEmail, otp);
      setCurrentStep('reset');
      toast.success('Verification successful');
      
    } catch (error: any) {
      console.error('OTP verification error:', error);
      setErrorMessage(error?.message || 'An unexpected error occurred');
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

      console.log("Updating password...");
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        console.error('Password update error:', error);
        setErrorMessage(error.message || 'Failed to update password');
        setIsLoading(false);
        return;
      }
        
      console.log("Password updated successfully");
      toast.success('Password has been reset successfully');
      
      if (verificationId) {
        sessionStorage.removeItem(`email_${verificationId}`);
      }
      
      setTimeout(() => {
        navigate('/auth', { replace: true });
      }, 1500);
      
    } catch (error: any) {
      console.error('Password update error:', error);
      setErrorMessage(error?.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setCurrentStep('email');
    setOtp('');
    setErrorMessage(null);
  };

  return {
    email,
    setEmail,
    otp,
    setOtp,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    errorMessage,
    currentStep,
    verificationInProgress,
    resetLinkSent,
    verificationId,
    
    handleRequestReset,
    handleResendOtp,
    handleVerifyOtp,
    handleBackToEmail,
    handleResetPassword
  };
};

export type { ResetStep } from './useResetFormState';
