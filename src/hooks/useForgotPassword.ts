
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export function useForgotPassword() {
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'email' | 'otp' | 'reset'>('email');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [hasValidToken, setHasValidToken] = useState<boolean>(false);
  const [verificationInProgress, setVerificationInProgress] = useState<boolean>(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Check for token in URL when component mounts
  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      setVerificationInProgress(true);
      setAccessToken(token);
      
      // Validate the token by checking the session
      const checkSession = async () => {
        try {
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Error checking session:', error);
            setVerificationInProgress(false);
            setErrorMessage('Could not verify reset token. Please try again or restart the process.');
            return;
          }
          
          if (data.session) {
            setHasValidToken(true);
            setCurrentStep('reset');
          } else {
            // Try to exchange the token for a session
            try {
              const { error: refreshError } = await supabase.auth.refreshSession({
                refresh_token: token,
              });
              
              if (refreshError) {
                console.error('Error refreshing session:', refreshError);
                
                // Try verifying the token as a recovery token
                const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
                  token_hash: token,
                  type: 'recovery'
                });
                
                if (verifyError) {
                  console.error('Error verifying token:', verifyError);
                  setErrorMessage('Your password reset link has expired. Please request a new one.');
                  setVerificationInProgress(false);
                  return;
                }
                
                if (verifyData.session) {
                  setHasValidToken(true);
                  setCurrentStep('reset');
                }
              } else {
                setHasValidToken(true);
                setCurrentStep('reset');
              }
            } catch (refreshError) {
              console.error('Exception during refresh:', refreshError);
              setErrorMessage('Error verifying your reset link. Please try again.');
              setVerificationInProgress(false);
              return;
            }
          }
        } catch (error) {
          console.error('Error during token verification:', error);
          setErrorMessage('Error verifying your reset link. Please try again.');
        } finally {
          setVerificationInProgress(false);
        }
      };
      
      checkSession();
    }
    
    // Check for verification ID in URL
    const urlVerificationId = searchParams.get('verification');
    if (urlVerificationId && currentStep === 'email') {
      setVerificationId(urlVerificationId);
      setCurrentStep('otp');
    }
  }, [searchParams, currentStep]);

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

      // Send OTP to user's email instead of reset link
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: false,
        }
      });
      
      if (error) {
        console.error('OTP request error:', error);
        setErrorMessage(error.message || 'Failed to send verification code');
        setIsLoading(false);
        return;
      }
      
      // Generate verification ID
      const verificationId = Date.now().toString();
      setVerificationId(verificationId);
      
      // Store email in session for verification
      sessionStorage.setItem(`email_${verificationId}`, email);
      
      // Move to OTP step
      setCurrentStep('otp');
      toast.success('Verification code sent to your email. Please check your inbox.');
      
    } catch (error: any) {
      console.error('Password reset request error:', error);
      setErrorMessage(error?.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setErrorMessage(null);

    try {
      if (!email.trim()) {
        setErrorMessage('Email address is missing.');
        setResendLoading(false);
        return;
      }

      // Resend OTP to user's email
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: false,
        }
      });
      
      if (error) {
        console.error('Resend OTP error:', error);
        setErrorMessage(error.message || 'Failed to resend verification code');
        setResendLoading(false);
        return;
      }
      
      toast.success('New verification code sent to your email.');
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      setErrorMessage(error?.message || 'Failed to resend verification code');
    } finally {
      setResendLoading(false);
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

      if (!email) {
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
      }
      
      // Attempt to verify OTP through Supabase
      const { error, data } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'email'
      });
      
      if (error) {
        console.error('OTP verification error:', error);
        setErrorMessage('Invalid verification code. Please try again.');
        setIsLoading(false);
        return;
      }
      
      console.log('OTP verification successful:', data);
      
      // Move to reset step
      setCurrentStep('reset');
      toast.success('Verification successful');
    } catch (error: any) {
      console.error('Error during OTP verification:', error);
      setErrorMessage(error?.message || 'Error verifying code');
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

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        console.error('Password update error:', error);
        
        if (error.message.includes('Auth session missing')) {
          setErrorMessage('Authentication session expired. Please restart the password reset process.');
        } else {
          setErrorMessage(error.message || 'Failed to update password');
        }
        
        setIsLoading(false);
        return;
      }
      
      // Password updated successfully
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
    resendLoading,
    errorMessage,
    currentStep,
    hasValidToken,
    verificationInProgress,
    verificationId,
    handleRequestReset,
    handleResendOtp,
    handleVerifyOtp,
    handleResetPassword,
    handleBackToEmail
  };
}
