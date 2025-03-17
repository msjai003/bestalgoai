
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ForgotPasswordLayout from '@/components/forgot-password/ForgotPasswordLayout';
import EmailStep from '@/components/forgot-password/EmailStep';
import OtpStep from '@/components/forgot-password/OtpStep';
import ResetPasswordStep from '@/components/forgot-password/ResetPasswordStep';
import { useAuth } from '@/contexts/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'email' | 'otp' | 'reset'>('email');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verificationInProgress, setVerificationInProgress] = useState<boolean>(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const { resetPassword, updatePassword } = useAuth();

  // Check for verification ID in URL when component mounts
  useEffect(() => {
    const urlVerificationId = searchParams.get('verification');
    if (urlVerificationId && currentStep === 'email') {
      console.log("Found verification ID in URL, moving to OTP step");
      setVerificationId(urlVerificationId);
      setCurrentStep('otp');
    }
  }, [searchParams, currentStep]);

  const sendOtpToEmail = async (emailAddress: string) => {
    console.log(`Sending OTP to email: ${emailAddress}`);
    
    // Force OTP directly in email by using a custom endpoint
    try {
      // First try with direct OTP
      const { error } = await supabase.auth.signInWithOtp({
        email: emailAddress,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: `${window.location.origin}/forgot-password?otp=true`,
          data: {
            otp_type: 'numeric',
            otp_length: 6,
            otp_in_email: true,  // Request OTP directly in email
          }
        }
      });
      
      if (error) {
        console.error('Error sending OTP:', error);
        throw error;
      }
      
      return true;
    } catch (err) {
      console.error("Failed to send OTP:", err);
      throw err;
    }
  };

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
      
      // Send OTP for re-authentication
      await sendOtpToEmail(email);
      
      // Generate verification ID
      const verificationId = Date.now().toString();
      setVerificationId(verificationId);
      
      // Store email in session for verification
      sessionStorage.setItem(`email_${verificationId}`, email);
      
      // Move to OTP step
      setCurrentStep('otp');
      toast.success('A 6-digit verification code has been sent to your email. Check your email for the numeric code.');
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
        // Try to recover email from session storage
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

      console.log(`Verifying OTP: ${otp}`);
      
      if (!verificationId) {
        setErrorMessage('Verification session expired. Please restart the process.');
        setIsLoading(false);
        return;
      }
      
      // Get stored email
      const storedEmail = sessionStorage.getItem(`email_${verificationId}`);
      if (!storedEmail) {
        setErrorMessage('Verification session not found. Please restart the process.');
        setIsLoading(false);
        return;
      }
      
      setEmail(storedEmail);
      
      // Verify OTP using re-authentication
      try {
        console.log(`Verifying OTP for email: ${storedEmail}`);
        
        // Using supabase.auth.verifyOtp for re-authentication
        const { data, error } = await supabase.auth.verifyOtp({
          email: storedEmail,
          token: otp,
          type: 'email'
        });
        
        if (error) {
          console.error('OTP verification error:', error);
          setErrorMessage('Invalid verification code. Please try again.');
          setIsLoading(false);
          return;
        }
        
        console.log("OTP verification response:", data);
        
        // Move to reset step
        console.log("OTP verified successfully, moving to reset step");
        setCurrentStep('reset');
        toast.success('Verification successful');
      } catch (verifyError: any) {
        console.error('Error during OTP verification:', verifyError);
        setErrorMessage(verifyError?.message || 'Error verifying code');
        setIsLoading(false);
      }
      
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
      
      // Use the session from OTP verification to update password directly
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        console.error('Password update error:', error);
        setErrorMessage(error.message || 'Failed to update password');
        setIsLoading(false);
        return;
      }
        
      // Password updated successfully
      console.log("Password updated successfully");
      toast.success('Password has been reset successfully');
      
      // Clean up verification session if it exists
      if (verificationId) {
        sessionStorage.removeItem(`email_${verificationId}`);
      }
      
      setTimeout(() => {
        navigate('/auth');
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

  return (
    <ForgotPasswordLayout 
      step={currentStep === 'email' ? 1 : currentStep === 'otp' ? 2 : 3}
      errorMessage={errorMessage}
      verificationInProgress={verificationInProgress}
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
          onResendOtp={handleResendOtp}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          email={email}
        />
      )}
      
      {currentStep === 'reset' && (
        <ResetPasswordStep 
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          isLoading={isLoading}
          onSubmit={handleResetPassword}
        />
      )}
    </ForgotPasswordLayout>
  );
};

export default ForgotPassword;
