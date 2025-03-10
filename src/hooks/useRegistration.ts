
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { RegistrationData, RegistrationState } from '@/types/registration';
import { getBrowserInfo } from '@/utils/browserUtils';
import { validateStep1, validateStep2, validateStep3 } from '@/utils/registrationValidation';
import { registerUser, checkAuthStatus } from '@/services/registrationService';

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

  useEffect(() => {
    const initializeRegistration = async () => {
      // Check if user is already logged in
      const user = await checkAuthStatus();
      if (user) {
        navigate('/dashboard');
      }
      
      // Check for browser-specific issues
      const browserInfo = getBrowserInfo();
      if (browserInfo.browser === 'Firefox' || browserInfo.browser === 'Safari' || !browserInfo.cookiesEnabled) {
        setState(prev => ({
          ...prev, 
          browserIssue: browserInfo,
          showFirefoxHelp: true
        }));
      }
    };
    
    initializeRegistration();
    
    // Setup online/offline listeners
    const handleOnline = () => {
      setState(prev => ({
        ...prev,
        isOffline: false,
        connectionError: null
      }));
    };
    
    const handleOffline = () => {
      setState(prev => ({
        ...prev,
        isOffline: true,
        connectionError: "Your device appears to be offline. Please check your internet connection."
      }));
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [navigate]);

  const handleChange = (field: keyof RegistrationData, value: string | boolean | string[]) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, [field]: value },
      connectionError: prev.connectionError ? null : prev.connectionError
    }));
  };

  const handleNext = () => {
    const { step, formData } = state;
    
    if (step === 1 && !validateStep1(formData)) {
      return;
    } else if (step === 2 && !validateStep2(formData)) {
      return;
    }
    
    setState(prev => ({
      ...prev,
      step: Math.min(prev.step + 1, 3)
    }));
  };

  const handleBack = () => {
    if (state.step > 1) {
      setState(prev => ({
        ...prev,
        step: prev.step - 1
      }));
    } else {
      navigate('/auth');
    }
  };

  const handleCompleteRegistration = async () => {
    const { formData, isOffline } = state;
    
    if (!validateStep3(formData)) {
      return;
    }
    
    setState(prev => ({
      ...prev,
      isLoading: true,
      connectionError: null
    }));
    
    try {
      console.log("Starting registration process with Supabase...");
      
      // Check if we're offline
      if (isOffline) {
        toast.error("You are offline. Please connect to the internet to complete registration.");
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }
      
      // Register user with Supabase
      await registerUser(formData);
      
      toast.success("Registration completed successfully! Please check your email to confirm your account.");
      navigate('/auth');
      
    } catch (error: any) {
      console.error("Registration error:", error);
      setState(prev => ({
        ...prev,
        connectionError: error.message || "Registration failed. Please try again later."
      }));
      toast.error(error.message || "Registration failed. Please try again later.");
    } finally {
      setState(prev => ({
        ...prev,
        isLoading: false
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
