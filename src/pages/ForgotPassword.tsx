
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
  const [magicLinkSessionActive, setMagicLinkSessionActive] = useState<boolean>(false);
  const { resetPassword, updatePassword } = useAuth();

  // Check for verification ID, magic link tokens, and other parameters when component mounts
  useEffect(() => {
    const checkForMagicLink = async () => {
      const urlVerificationId = searchParams.get('verification');
      const type = searchParams.get('type');
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      
      // If this is a magic link authentication
      if (type === 'recovery' || accessToken || refreshToken) {
        console.log("Magic link authentication detected");
        setVerificationInProgress(true);
        
        try {
          // Get the user's session after magic link click
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Error getting session:', error);
            setErrorMessage('Your password reset link is invalid or has expired.');
            setVerificationInProgress(false);
            return;
          }
          
          if (data.session) {
            console.log("Active session found from magic link");
            // Extract email from the session
            const userEmail = data.session.user.email;
            if (userEmail) {
              setEmail(userEmail);
              setMagicLinkSessionActive(true);
              // Skip directly to the password reset step
              setCurrentStep('reset');
              toast.success('You can now set your new password');
            } else {
              setErrorMessage('Could not retrieve your email. Please try again.');
            }
          } else {
            setErrorMessage('Your password reset link is invalid or has expired.');
          }
        } catch (error) {
          console.error('Error processing magic link:', error);
          setErrorMessage('An error occurred while processing your password reset link.');
        } finally {
          setVerificationInProgress(false);
        }
        return;
      }
      
      // Original verification ID logic
      if (urlVerificationId && currentStep === 'email') {
        console.log("Found verification ID in URL, moving to OTP step");
        setVerificationId(urlVerificationId);
        setCurrentStep('otp');
      }
    };
    
    checkForMagicLink();
  }, [searchParams, currentStep]);

  // Modified to address the TypeScript error
  const sendOtpToEmail = async (emailAddress: string) => {
    console.log(`Sending OTP to email: ${emailAddress}`);
    
    try {
      // Use signInWithOtp instead of resetPasswordForEmail to use the data property
      const { error } = await supabase.auth.signInWithOtp({
        email: emailAddress,
        options: {
          shouldCreateUser: false,
          // Disable magic link redirect by providing a fake redirect URL
          emailRedirectTo: `${window.location.origin}/forgot-password-disabled-redirect-do-not-use`,
          data: {
            force_otp: true,
            otp_type: 'numeric',
            otp_length: 6,
            otp_in_email: true,
            disable_magic_link: true,
            send_otp_only: true
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
      
      try {
        console.log(`Verifying OTP for email: ${storedEmail}`);
        
        // Manual verification of the OTP code
        const { data, error } = await supabase.auth.verifyOtp({
          email: storedEmail,
          token: otp,
          type: 'email'  // Use 'email' type since we used signInWithOtp
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
      
      // Use the session from OTP verification or magic link to update password directly
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
