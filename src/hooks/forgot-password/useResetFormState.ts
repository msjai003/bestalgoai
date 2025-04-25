
import { useState } from 'react';

export const useResetFormState = () => {
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [verificationInProgress, setVerificationInProgress] = useState<boolean>(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [magicLinkSessionActive, setMagicLinkSessionActive] = useState<boolean>(false);
  const [resetLinkSent, setResetLinkSent] = useState<boolean>(false);

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
    setIsLoading,
    errorMessage,
    setErrorMessage,
    currentStep,
    setCurrentStep,
    verificationInProgress,
    setVerificationInProgress,
    verificationId,
    setVerificationId,
    magicLinkSessionActive,
    setMagicLinkSessionActive,
    resetLinkSent,
    setResetLinkSent,
  };
};
