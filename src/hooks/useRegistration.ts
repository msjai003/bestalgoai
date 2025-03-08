
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

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
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        navigate('/dashboard');
      }
    };
    
    checkAuthStatus();
    
    // Check for browser-specific issues
    const browserInfo = getBrowserInfo();
    if (browserInfo.browser === 'Firefox' || browserInfo.browser === 'Safari' || !browserInfo.cookiesEnabled) {
      setBrowserIssue(browserInfo);
      setShowFirefoxHelp(true);
    }
  }, [navigate]);

  const getBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    
    let browser = "unknown";
    if (userAgent.indexOf("Firefox") > -1) browser = "Firefox";
    if (userAgent.indexOf("Chrome") > -1) browser = "Chrome";
    if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) browser = "Safari";
    if (userAgent.indexOf("Edge") > -1) browser = "Edge";
    
    return {
      browser,
      isPrivateMode: !window.localStorage,
      userAgent: userAgent,
      cookiesEnabled: navigator.cookieEnabled
    };
  };

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
      console.log("Starting registration process...");
      
      const userData = {
        full_name: formData.fullName,
        mobile: formData.mobile,
        trading_experience: formData.tradingExperience,
        is_research_analyst: formData.isResearchAnalyst,
        certification_number: formData.certificationNumber || null,
      };
      
      // Attempt signup with Supabase
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: userData
        }
      });
      
      if (error) {
        console.error("Auth error details:", error);
        throw new Error(error.message || "Registration failed");
      }
      
      console.log("User created successfully");
      
      toast.success("Registration completed successfully! Please check your email to confirm your account.");
      navigate('/auth');
      
    } catch (error: any) {
      console.error("Registration error:", error);
      setConnectionError(error.message || "Registration failed. Please try again later.");
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
