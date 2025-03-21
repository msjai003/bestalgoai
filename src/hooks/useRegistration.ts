
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { RegistrationData, RegistrationState } from '@/types/registration';
import { getBrowserInfo } from '@/utils/browserUtils';
import { registerUser, testRegistrationConnection } from '@/services/registrationService';

// Initial registration data
const initialFormData: RegistrationData = {
  fullName: '',
  email: '',
  mobile: '',
  password: '',
  confirmPassword: '',
  tradingExperience: '',
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
      
      // Test connection first
      const connectionTest = await testRegistrationConnection();
      if (!connectionTest.success) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          connectionError: connectionTest.message || "Cannot connect to server" 
        }));
        toast.error("Connection error. Please try again later.");
        return;
      }
      
      console.log("Connection test passed, proceeding with registration");
      
      // Attempt registration
      const result = await registerUser(state.formData);
      
      if (!result.success) {
        // Check for email already exists error
        if (result.code === "EMAIL_ALREADY_EXISTS") {
          toast.error("This email address you entered is already registered");
          setState(prev => ({ 
            ...prev, 
            isLoading: false,
            connectionError: "This email address you entered is already registered"
          }));
          return;
        }
        
        // Handle other errors
        const errorMessage = result.error?.message || "Registration failed. Please try again.";
        toast.error(errorMessage);
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          connectionError: errorMessage 
        }));
        return;
      }
      
      // Success path
      console.log("Registration successful, displaying success messages");
      toast.success("Account created successfully! Please check your email inbox.");
      
      // Redirect after a short delay to allow the user to see the success message
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
      
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
