
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getBrowserInfo } from '@/utils/browserUtils';
import { registerUser } from '@/services/registrationService';
import { RegistrationData, RegistrationState } from '@/types/registration';
import { useWelcomeMessages } from './useWelcomeMessages';
import { useConnectionTest } from './useConnectionTest';

const initialFormData: RegistrationData = {
  fullName: '',
  email: '',
  mobile: '',
  password: '',
  confirmPassword: '',
  tradingExperience: 'beginner',
  preferredMarkets: [],
  isResearchAnalyst: false,
  certificationNumber: '',
};

export const useRegistration = () => {
  const [state, setState] = useState<RegistrationState>({
    step: 1,
    isLoading: false,
    connectionError: null,
    browserIssue: null,
    showFirefoxHelp: false,
    isOffline: !navigator.onLine,
    formData: initialFormData,
  });
  
  const navigate = useNavigate();
  const { sendWelcomeMessages } = useWelcomeMessages();
  const { connectionError, setConnectionError, testConnection } = useConnectionTest();

  const handleChange = (field: keyof RegistrationData, value: string | boolean | string[]) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, [field]: value }
    }));
  };

  const handleNext = () => {
    if (state.step < 3) {
      setState(prev => ({ ...prev, step: prev.step + 1 }));
    }
  };

  const handleBack = () => {
    if (state.step > 1) {
      setState(prev => ({ ...prev, step: prev.step - 1 }));
    } else {
      navigate('/');
    }
  };

  const handleCompleteRegistration = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      console.log("Starting registration process...");
      
      // Test connection
      const isConnected = await testConnection();
      if (!isConnected) {
        toast.error("Connection error. Please try again later.");
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }
      
      // Attempt registration
      const result = await registerUser(state.formData);
      
      if (!result.success) {
        // Handle registration errors
        const errorMessage = result.code === "EMAIL_ALREADY_EXISTS" 
          ? "This email address is already registered"
          : result.error?.message || "Registration failed. Please try again.";
        
        toast.error(errorMessage);
        setConnectionError(errorMessage);
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }
      
      // Send welcome messages in background without blocking the UI
      Promise.resolve().then(async () => {
        console.log("Registration successful, sending welcome messages in background");
        try {
          await sendWelcomeMessages(
            state.formData.email,
            state.formData.fullName,
            state.formData.mobile
          );
        } catch (welcomeError) {
          console.error("Error sending welcome messages:", welcomeError);
        }
      });
      
      // Show success message with email instructions
      toast.success("Account created successfully! Please check your email inbox or spam folder.");
      setState(prev => ({ ...prev, isLoading: false }));
      
      // Navigate directly to the auth page
      navigate('/auth');
      
    } catch (error: any) {
      console.error("Registration process error:", error);
      
      const errorMessage = error.message || "An unexpected error occurred";
      toast.error(errorMessage);
      
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        connectionError: errorMessage 
      }));
    }
  };

  return {
    ...state,
    handleChange,
    handleNext,
    handleBack,
    handleCompleteRegistration,
  };
};
