
import React from 'react';
import ForgotPasswordLayout from '@/components/forgot-password/ForgotPasswordLayout';
import EmailStep from '@/components/forgot-password/EmailStep';
import OtpStep from '@/components/forgot-password/OtpStep';
import ResetPasswordStep from '@/components/forgot-password/ResetPasswordStep';
import { useForgotPassword } from '@/hooks/useForgotPassword';

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
    resendLoading,
    errorMessage,
    currentStep,
    hasValidToken,
    verificationInProgress,
    handleRequestReset,
    handleResendOtp,
    handleVerifyOtp,
    handleResetPassword,
    handleBackToEmail
  } = useForgotPassword();

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
          onResendOtp={handleResendOtp}
          resendLoading={resendLoading}
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
