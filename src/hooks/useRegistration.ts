
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { RegistrationData, RegistrationState } from '@/types/registration';
import { getBrowserInfo } from '@/utils/browserUtils';
import { registerUser, testRegistrationConnection } from '@/services/registrationService';
import { supabase } from '@/integrations/supabase/client';

// Initial registration data
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

  const sendWelcomeMessages = async (userId: string, email: string, fullName: string, mobileNumber: string) => {
    try {
      console.log('Sending welcome messages to:', { email, fullName });

      // Send welcome email with detailed logging
      try {
        console.log('Preparing to call send-welcome-email edge function with payload:', {
          email,
          name: fullName,
          welcomeMessage: `Welcome to our platform, ${fullName}! We're excited to have you on board.`
        });
        
        const { data: emailData, error: emailError } = await supabase.functions.invoke('send-welcome-email', {
          body: JSON.stringify({
            email,
            name: fullName,
            welcomeMessage: `Welcome to our platform, ${fullName}! We're excited to have you on board.`
          })
        });

        if (emailError) {
          console.error('Error sending welcome email:', emailError);
          toast.error('Welcome email could not be sent. Please check your email address.');
        } else {
          console.log('Welcome email edge function response:', emailData);
          toast.success('Welcome email sent to your inbox!');
        }
      } catch (emailException) {
        console.error('Exception during welcome email sending:', emailException);
      }

      // Send welcome SMS if mobile number is provided
      if (mobileNumber) {
        try {
          console.log('Preparing to send welcome SMS to:', mobileNumber);
          
          const { data: smsData, error: smsError } = await supabase.functions.invoke('send-welcome-sms', {
            body: JSON.stringify({
              userId,
              fullName,
              mobileNumber
            })
          });

          if (smsError) {
            console.error('Error sending welcome SMS:', smsError);
          } else {
            console.log('Welcome SMS edge function response:', smsData);
          }
        } catch (smsException) {
          console.error('Exception during welcome SMS sending:', smsException);
        }
      }
    } catch (error) {
      console.error('Error in sendWelcomeMessages:', error);
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
      
      // Success path - Send welcome messages
      if (result.data?.user?.id) {
        console.log("Registration successful, sending welcome messages to user:", result.data.user.id);
        await sendWelcomeMessages(
          result.data.user.id,
          state.formData.email,
          state.formData.fullName,
          state.formData.mobile
        );
      } else {
        console.warn("Registration successful but no user ID was returned");
      }
      
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
