import React, { useEffect } from 'react';
import ForgotPasswordLayout from '@/components/forgot-password/ForgotPasswordLayout';
import EmailStep from '@/components/forgot-password/EmailStep';
import OtpStep from '@/components/forgot-password/OtpStep';
import { useForgotPassword } from '@/hooks/forgot-password/useForgotPassword';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const {
    email,
    setEmail,
    otp,
    setOtp,
    isLoading,
    errorMessage,
    currentStep,
    verificationInProgress,
    resetLinkSent,
    handleRequestReset,
    handleResendOtp,
    handleVerifyOtp,
    handleBackToEmail,
  } = useForgotPassword();
  
  useEffect(() => {
    // Check for reset parameter in URL when component mounts
    const resetParam = searchParams.get('reset');
    if (resetParam === 'true' && currentStep === 'email') {
      console.log('Reset parameter detected in URL, showing password reset form');
      // Toast notification is handled in the useForgotPassword hook
    }
  }, [searchParams, currentStep]);

  // Debug output to help track the component state
  console.log('ForgotPassword component state:', { 
    currentStep, 
    verificationInProgress, 
    resetLinkSent,
    hasEmailInput: !!email,
    urlParams: {
      reset: searchParams.get('reset'),
      token: searchParams.get('token'),
      type: searchParams.get('type')
    }
  });

  return (
    <ForgotPasswordLayout 
      step={currentStep === 'email' ? 1 : 2}
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
    </ForgotPasswordLayout>
  );
};

export default ForgotPassword;
