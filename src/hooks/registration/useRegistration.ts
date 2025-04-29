
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
        return;
      }
      
      // Send welcome messages
      console.log("Registration successful, sending welcome messages");
      let welcomeMessageSent = false;
      const maxRetries = 2;
      
      for (let attempt = 1; attempt <= maxRetries && !welcomeMessageSent; attempt++) {
        try {
          console.log(`Welcome message attempt ${attempt}`);
          welcomeMessageSent = await sendWelcomeMessages(
            state.formData.email,
            state.formData.fullName,
            state.formData.mobile
          );
        } catch (welcomeError) {
          console.error(`Welcome message attempt ${attempt} failed:`, welcomeError);
          if (attempt === maxRetries) {
            toast.error("We could not send your welcome messages, but your account was created successfully.");
          }
        }
      }
      
      toast.success("Account created successfully!");
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
