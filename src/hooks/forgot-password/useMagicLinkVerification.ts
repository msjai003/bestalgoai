
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ResetStep } from './useResetFormState';

export const useMagicLinkVerification = (
  setEmail: (email: string) => void,
  setMagicLinkSessionActive: (active: boolean) => void,
  setCurrentStep: (step: ResetStep) => void,
  setVerificationInProgress: (inProgress: boolean) => void,
  setErrorMessage: (message: string | null) => void,
  verificationId: string | null,
  currentStep: ResetStep,
) => {
  const [searchParams] = useSearchParams();

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
          
          const sessionData = await supabase.auth.getSession();
          
          if (sessionData.data.session) {
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
      
      if (reset === 'true' || type === 'recovery') {
        console.log("Reset parameter detected in URL");
        
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          const userEmail = data.session.user.email;
          if (userEmail) {
            setEmail(userEmail);
            setMagicLinkSessionActive(true);
            setCurrentStep('reset');
            toast.success('You can now set your new password');
            return;
          }
        }
      }
      
      if (verificationId && currentStep === 'email') {
        console.log("Found verification ID, moving to OTP step");
        setCurrentStep('otp');
      }
    };
    
    checkForMagicLink();
  }, [searchParams, verificationId, currentStep, setCurrentStep, setEmail, setErrorMessage, setMagicLinkSessionActive, setVerificationInProgress]);
};
