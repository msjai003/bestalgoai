
import React, { useEffect } from 'react';
import ForgotPasswordLayout from '@/components/forgot-password/ForgotPasswordLayout';
import EmailStep from '@/components/forgot-password/EmailStep';
import OtpStep from '@/components/forgot-password/OtpStep';
import ResetPasswordStep from '@/components/forgot-password/ResetPasswordStep';
import { useForgotPassword } from '@/hooks/useForgotPassword';
import { toast } from 'sonner';

const ForgotPassword = () => {
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
    errorMessage,
    currentStep,
    verificationInProgress,
    resetLinkSent,
    handleRequestReset,
    handleResendOtp,
    handleVerifyOtp,
    handleBackToEmail,
    handleResetPassword
  } = useForgotPassword();
  
  useEffect(() => {
    // Show toast when component mounts with reset token
    if (currentStep === 'reset') {
      toast.success('You can now set your new password');
    }
  }, [currentStep]);

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
          email={email}
          resetLinkSent={resetLinkSent}
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
