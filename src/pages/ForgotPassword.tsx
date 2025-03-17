
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ForgotPasswordLayout from '@/components/forgot-password/ForgotPasswordLayout';
import EmailStep from '@/components/forgot-password/EmailStep';
import OtpStep from '@/components/forgot-password/OtpStep';
import ResetPasswordStep from '@/components/forgot-password/ResetPasswordStep';

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
  const [hasValidToken, setHasValidToken] = useState<boolean>(false);
  const [verificationInProgress, setVerificationInProgress] = useState<boolean>(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);

  // Check for token in URL when component mounts (for when user returns after clicking email link)
  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      setVerificationInProgress(true);
      
      // If token exists in URL, this means the user has clicked the reset link in their email
      setTimeout(() => {
        setVerificationInProgress(false);
        setHasValidToken(true);
        setCurrentStep('reset');
        toast.info('Please set your new password');
      }, 1500);
    }
  }, [searchParams]);

  const generateAndSendOTP = async (email: string) => {
    // Generate a random 6-digit OTP
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    
    try {
      // Store the OTP in the session storage temporarily (In a production app, this would be stored securely on the server)
      // For demo purposes, we're using sessionStorage which is more secure than localStorage
      const expiryTime = new Date().getTime() + 10 * 60 * 1000; // 10 minutes expiry
      const verificationId = Date.now().toString();
      sessionStorage.setItem(`otp_${verificationId}`, JSON.stringify({
        email,
        otp: generatedOTP,
        expiry: expiryTime
      }));
      setVerificationId(verificationId);
      
      // In a real implementation, you would send an email with the OTP using a server or edge function
      // For demo, we'll show the OTP in a toast message (NEVER do this in production)
      console.log("Generated OTP:", generatedOTP);
      
      // Send email with Supabase's email service
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/forgot-password?verification=${verificationId}`,
      });
      
      if (error) throw error;
      
      // Simulate sending OTP - in a real app, you'd include the OTP in the email template
      toast.info(`For demo purposes, your OTP is: ${generatedOTP}`, { duration: 10000 });
      
      return { success: true };
    } catch (error: any) {
      console.error("Error generating/sending OTP:", error);
      throw new Error(error.message || "Failed to send verification code");
    }
  };

  const verifyOTP = (inputOTP: string) => {
    if (!verificationId) {
      return { valid: false, message: "Verification session expired" };
    }
    
    const storedData = sessionStorage.getItem(`otp_${verificationId}`);
    if (!storedData) {
      return { valid: false, message: "Verification session not found" };
    }
    
    const { otp: storedOTP, expiry, email: storedEmail } = JSON.parse(storedData);
    
    // Check if OTP has expired
    if (Date.now() > expiry) {
      sessionStorage.removeItem(`otp_${verificationId}`);
      return { valid: false, message: "Verification code has expired" };
    }
    
    // Verify the OTP
    if (inputOTP !== storedOTP) {
      return { valid: false, message: "Invalid verification code" };
    }
    
    return { valid: true, email: storedEmail };
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

      const { success } = await generateAndSendOTP(email);

      if (success) {
        setCurrentStep('otp');
        toast.success('Verification code sent to your email');
      }
      
    } catch (error: any) {
      console.error('Password reset request error:', error);
      setErrorMessage(error?.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (!otp.trim() || otp.length !== 6) {
        setErrorMessage('Please enter a valid 6-digit verification code');
        setIsLoading(false);
        return;
      }

      const { valid, message } = verifyOTP(otp);
      
      if (!valid) {
        setErrorMessage(message);
        setIsLoading(false);
        return;
      }
      
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

      // For demo purposes, we simulate password update
      // In a real implementation with Supabase token, this would work
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

  // Check for verification ID in URL
  useEffect(() => {
    const urlVerificationId = searchParams.get('verification');
    if (urlVerificationId && currentStep === 'email') {
      setVerificationId(urlVerificationId);
      setCurrentStep('otp');
    }
  }, [searchParams, currentStep]);

  return (
    <ForgotPasswordLayout 
      step={currentStep === 'email' ? 1 : currentStep === 'otp' ? 2 : 3}
      errorMessage={errorMessage}
      verificationInProgress={verificationInProgress}
    >
      {currentStep === 'email' && !hasValidToken && (
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
      
      {(currentStep === 'reset' || hasValidToken) && (
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
