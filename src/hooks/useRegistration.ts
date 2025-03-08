
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  directSignUp,
  getCurrentUser,
  getBrowserInfo
} from '@/lib/mockAuth';

export interface RegistrationData {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  tradingExperience: string;
  preferredMarkets: string[];
  isResearchAnalyst: boolean;
  certificationNumber: string;
}

export const useRegistration = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [browserIssue, setBrowserIssue] = useState<any>(null);
  const [showFirefoxHelp, setShowFirefoxHelp] = useState(false);
  const [formData, setFormData] = useState<RegistrationData>({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    tradingExperience: '',
    preferredMarkets: [],
    isResearchAnalyst: false,
    certificationNumber: '',
  });

  useEffect(() => {
    const checkAuthStatus = async () => {
      const user = getCurrentUser();
      if (user) {
        navigate('/dashboard');
      }
    };
    
    checkAuthStatus();
    
    // Check for browser-specific issues
    const browserCheck = getBrowserInfo();
    if (browserCheck.browser === 'Firefox' || browserCheck.browser === 'Safari' || !browserCheck.cookiesEnabled) {
      setBrowserIssue(browserCheck);
      setShowFirefoxHelp(true);
    }
  }, [navigate]);

  const handleChange = (field: keyof RegistrationData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (connectionError) setConnectionError(null);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.mobile) {
        toast.error("Please fill all required fields");
        return;
      }
      if (!validateEmail(formData.email)) {
        toast.error("Please enter a valid email address");
        return;
      }
    } else if (step === 2) {
      if (!formData.password || !formData.confirmPassword) {
        toast.error("Please enter and confirm your password");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        return;
      }
    }
    
    setStep(prev => Math.min(prev + 1, 3));
  };

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    } else {
      navigate('/auth');
    }
  };

  const handleCompleteRegistration = async () => {
    if (formData.isResearchAnalyst && !formData.certificationNumber.trim()) {
      toast.error("Please enter your Research Analyst certification number");
      return;
    }
    
    if (!formData.tradingExperience) {
      toast.error("Please select your trading experience");
      return;
    }
    
    setIsLoading(true);
    setConnectionError(null);
    
    try {
      console.log("Starting mock registration process...");
      
      const userData = {
        full_name: formData.fullName,
        mobile: formData.mobile,
        trading_experience: formData.tradingExperience,
        is_research_analyst: formData.isResearchAnalyst,
        certification_number: formData.certificationNumber || null,
      };
      
      // Attempt mock signup
      const { data: authData, error: authError } = await directSignUp(
        formData.email, 
        formData.password, 
        userData
      );
      
      if (authError) {
        console.error("Auth error details:", authError);
        throw new Error(authError.message || "Registration failed");
      }
      
      console.log("Mock user created successfully:", authData?.user?.id);
      
      toast.success("Mock registration completed successfully!");
      navigate('/auth');
      
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    step,
    formData,
    isLoading,
    connectionError,
    showFirefoxHelp,
    browserIssue,
    handleChange,
    handleNext,
    handleBack,
    handleCompleteRegistration,
  };
};
