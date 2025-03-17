
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
  const [hasValidToken, setHasValidToken] = useState<boolean>(false);
  const [verificationInProgress, setVerificationInProgress] = useState<boolean>(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { resetPassword, updatePassword } = useAuth();

  // Check for token in URL when component mounts (for when user returns after clicking email link)
  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      console.log("Found token in URL, verifying...");
      setVerificationInProgress(true);
      setAccessToken(token);
      
      // If token exists in URL, this means the user has clicked the reset link in their email
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
            console.log("Valid session found, moving to reset step");
            setHasValidToken(true);
            setCurrentStep('reset');
          } else {
            // Try to exchange the token for a session
            try {
              console.log("No session found, trying to verify token...");
              const { error: refreshError } = await supabase.auth.refreshSession({
                refresh_token: token,
              });
              
              if (refreshError) {
                console.error('Error refreshing session:', refreshError);
                
                // Try verifying the token as a recovery token
                console.log("Trying to verify token as recovery token...");
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
                  console.log("Token verified, moving to reset step");
                  setHasValidToken(true);
                  setCurrentStep('reset');
                }
              } else {
                console.log("Session refreshed, moving to reset step");
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
      console.log("Found verification ID in URL, moving to OTP step");
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
        return;
      }

      console.log(`Requesting password reset for email: ${email}`);
      // Use the resetPassword method from useAuth context
      const { error } = await resetPassword(email);
      
      if (error) {
        console.error('Password reset request error:', error);
        setErrorMessage(error.message || 'Failed to send verification email');
        return;
      }
      
      // Generate verification ID
      const verificationId = Date.now().toString();
      setVerificationId(verificationId);
      
      // Store email in session for verification
      sessionStorage.setItem(`email_${verificationId}`, email);
      
      // Move to OTP step
      setCurrentStep('otp');
      toast.success('Password reset link sent to your email. Please check your inbox.');
      
    } catch (error: any) {
      console.error('Password reset request error:', error);
      setErrorMessage(error?.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (!otp.trim() || otp.length !== 6) {
        setErrorMessage('Please enter a valid 6-digit verification code');
        return;
      }

      console.log(`Verifying OTP: ${otp}`);
      
      if (!verificationId) {
        setErrorMessage('Verification session expired. Please restart the process.');
        return;
      }
      
      // Get stored email
      const storedEmail = sessionStorage.getItem(`email_${verificationId}`);
      if (!storedEmail) {
        setErrorMessage('Verification session not found. Please restart the process.');
        return;
      }
      
      setEmail(storedEmail);
      
      // Attempt to verify OTP through Supabase
      try {
        console.log(`Verifying OTP for email: ${storedEmail}`);
        const { error } = await supabase.auth.verifyOtp({
          email: storedEmail,
          token: otp,
          type: 'recovery'
        });
        
        if (error) {
          console.error('OTP verification error:', error);
          setErrorMessage('Invalid verification code. Please try again.');
          return;
        }
        
        // Move to reset step
        console.log("OTP verified successfully, moving to reset step");
        setCurrentStep('reset');
        toast.success('Verification successful');
      } catch (verifyError: any) {
        console.error('Error during OTP verification:', verifyError);
        setErrorMessage(verifyError?.message || 'Error verifying code');
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
        return;
      }

      if (newPassword !== confirmPassword) {
        setErrorMessage('Passwords do not match');
        return;
      }

      if (newPassword.length < 8) {
        setErrorMessage('Password must be at least 8 characters');
        return;
      }

      console.log("Updating password...");
      // Use the updatePassword method from useAuth context
      const { error } = await updatePassword(newPassword);
      
      if (error) {
        console.error('Password update error:', error);
        
        // Handle the "Auth session missing" error
        if (error.message.includes('Auth session missing')) {
          try {
            console.log("Auth session missing, trying direct password update...");
            // Try to directly update the password using Supabase's recovery flow
            const { data, error: updateError } = await supabase.auth.updateUser({
              password: newPassword
            });
            
            if (updateError) {
              console.error('Password update error after handling missing session:', updateError);
              setErrorMessage(updateError.message || 'Failed to update password');
              return;
            }
            
            if (data) {
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
              return;
            }
          } catch (updateError: any) {
            console.error('Error during direct password update:', updateError);
            setErrorMessage('Authentication error. Please try using the reset link from your email again.');
            return;
          }
        } else {
          setErrorMessage(error.message || 'Failed to update password');
          return;
        }
      } else {
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
      }
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
