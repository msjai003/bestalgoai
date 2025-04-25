
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

type ResetStep = 'email' | 'otp' | 'reset';

export const useForgotPassword = () => {
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<ResetStep>('email');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verificationInProgress, setVerificationInProgress] = useState<boolean>(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [magicLinkSessionActive, setMagicLinkSessionActive] = useState<boolean>(false);
  const [resetLinkSent, setResetLinkSent] = useState<boolean>(false);

  useEffect(() => {
    const checkForMagicLink = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');
      const reset = searchParams.get('reset');
      
      console.log("Checking for magic link or parameters in URL");
      console.log("URL parameters:", { token, type, reset });
      
      if (token && (type === 'recovery' || reset === 'true')) {
        console.log("Recovery token detected in URL");
        setVerificationInProgress(true);
        
        try {
          console.log("Attempting to verify recovery token");
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'recovery',
          });
          
          if (error) {
            console.error("Error verifying token:", error);
            setErrorMessage('Your password reset link is invalid or has expired.');
            setVerificationInProgress(false);
            return;
          }
          
          console.log("Token verification successful, checking session");
          const sessionData = await supabase.auth.getSession();
          
          if (sessionData.data.session) {
            console.log("Active session found from recovery token");
            const userEmail = sessionData.data.session.user.email;
            if (userEmail) {
              setEmail(userEmail);
              setMagicLinkSessionActive(true);
              setCurrentStep('reset');
              toast.success('You can now set your new password');
            } else {
              setErrorMessage('Could not retrieve your email. Please try again.');
            }
          } else {
            console.error("No session found after token verification");
            setErrorMessage('Your password reset link is invalid or has expired.');
          }
        } catch (error) {
          console.error('Error processing recovery token:', error);
          setErrorMessage('An error occurred while processing your password reset link.');
        } finally {
          setVerificationInProgress(false);
        }
        return;
      }
      
      const urlHash = window.location.hash;
      if (urlHash && urlHash.includes('access_token')) {
        console.log("Magic link authentication detected in hash");
        setVerificationInProgress(true);
        
        try {
          const hashParams = new URLSearchParams(urlHash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          
          if (accessToken && refreshToken) {
            console.log("Setting session from hash tokens");
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            
            if (error) {
              console.error("Error setting session:", error);
              setErrorMessage('Failed to authenticate. Please try again.');
            } else if (data.session) {
              console.log("Session set successfully");
              const userEmail = data.session.user.email;
              if (userEmail) {
                setEmail(userEmail);
                setMagicLinkSessionActive(true);
                setCurrentStep('reset');
                toast.success('You can now set your new password');
              }
            }
          }
        } catch (error) {
          console.error('Error processing hash tokens:', error);
          setErrorMessage('An error occurred while processing authentication.');
        } finally {
          setVerificationInProgress(false);
        }
        return;
      }
      
      if (currentStep === 'email') {
        const { data } = await supabase.auth.getSession();
        if (data.session && reset === 'true') {
          console.log("User has an active session and reset parameter is true");
          const userEmail = data.session.user.email;
          if (userEmail) {
            setEmail(userEmail);
            setMagicLinkSessionActive(true);
            setCurrentStep('reset');
          }
        }
      }
      
      if (verificationId && currentStep === 'email') {
        console.log("Found verification ID, moving to OTP step");
        setCurrentStep('otp');
      }
    };
    
    checkForMagicLink();
  }, [searchParams, currentStep, verificationId]);

  const sendOtpToEmail = async (emailAddress: string) => {
    console.log(`Sending OTP to email: ${emailAddress}`);
    
    try {
      // Make sure to use the complete URL including the origin for the redirect
      const { error } = await supabase.auth.resetPasswordForEmail(emailAddress, {
        redirectTo: `${window.location.origin}/forgot-password?reset=true`,
      });
      
      if (error) {
        console.error('Error sending password reset email:', error);
        throw error;
      }
      
      return true;
    } catch (err) {
      console.error("Failed to send password reset email:", err);
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

      console.log(`Verifying OTP: ${otp}`);
      
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
      
      try {
        console.log(`Verifying OTP for email: ${storedEmail}`);
        
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

  const handleBackToEmail = () => {
    setCurrentStep('email');
    setOtp('');
    setErrorMessage(null);
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
      
      // Give user time to see the success message before redirecting
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
