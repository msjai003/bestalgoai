import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  testSupabaseConnection, 
  directSignUp, 
  offlineSignup, 
  getCurrentUser,
  checkFirefoxCompatibility
} from '@/lib/supabase';

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
      const user = await getCurrentUser();
      if (user) {
        navigate('/dashboard');
      }
    };
    
    checkAuthStatus();
    
    // Check for browser-specific issues
    const browserCheck = checkFirefoxCompatibility();
    if (browserCheck.isFirefox || browserCheck.isSafari || !browserCheck.cookiesEnabled) {
      setBrowserIssue(browserCheck);
      // Show help by default for browsers with known issues
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
      console.log("Starting registration process...");
      
      const userData = {
        full_name: formData.fullName,
        mobile: formData.mobile,
        trading_experience: formData.tradingExperience,
        is_research_analyst: formData.isResearchAnalyst,
        certification_number: formData.certificationNumber || null,
      };
      
      // Always attempt a direct signup first, regardless of browser
      const { data: authData, error: authError } = await directSignUp(
        formData.email, 
        formData.password, 
        userData
      );
      
      if (authError) {
        console.error("Auth error details:", authError);
        
        // Show browser-specific help based on the error
        const browserCheck = checkFirefoxCompatibility();
        setShowFirefoxHelp(true);
        
        if (authError.message?.includes("already registered")) {
          throw new Error("This email is already registered. Please try signing in instead.");
        }
        
        // Generic connection error for all browsers
        setConnectionError(
          "Your browser's privacy settings may be blocking our authentication service. Please try the suggestions below."
        );
        
        // Try to save registration data offline if possible
        try {
          await offlineSignup(formData.email, formData.password, userData);
          toast.info("Your registration details have been saved locally. Please try again after adjusting your browser settings.");
        } catch (e) {
          console.error("Failed to save offline data", e);
        }
        
        throw new Error("Browser privacy settings are preventing authentication. Please try the suggestions below.");
      }
      
      console.log("User created successfully:", authData?.user?.id);
      
      toast.success("Registration completed successfully! Please check your email to verify your account.");
      navigate('/auth');
      
    } catch (error: any) {
      console.error("Registration error:", error);
      
      if (error.message?.includes("browser privacy") || 
          error.message?.includes("third-party cookies") ||
          error.message?.includes("incognito")) {
        toast.error(error.message);
      } else if (error.message?.includes("Failed to fetch") || 
          error.message?.includes("NetworkError") ||
          error.message?.includes("Unable to connect")) {
        toast.error("Connection error: Please try registering with a different browser or check your internet connection.");
      } else if (error.message?.includes("already registered")) {
        toast.error("This email is already registered. Please try signing in instead.");
      } else if (error.status === 429) {
        toast.error("Too many requests. Please wait a moment before trying again.");
      } else {
        toast.error(error.message || "Registration failed. Please try again later.");
      }
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
