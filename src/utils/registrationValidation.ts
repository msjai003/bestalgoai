
import { toast } from 'sonner';
import { RegistrationData } from '@/types/registration';
import { validateEmail } from './browserUtils';

export const validateStep1 = (formData: RegistrationData): boolean => {
  if (!formData.fullName || !formData.email || !formData.mobile) {
    toast.error("Please fill all required fields");
    return false;
  }
  if (!validateEmail(formData.email)) {
    toast.error("Please enter a valid email address");
    return false;
  }
  return true;
};

export const validateStep2 = (formData: RegistrationData): boolean => {
  if (!formData.password || !formData.confirmPassword) {
    toast.error("Please enter and confirm your password");
    return false;
  }
  if (formData.password !== formData.confirmPassword) {
    toast.error("Passwords do not match");
    return false;
  }
  if (formData.password.length < 6) {
    toast.error("Password must be at least 6 characters long");
    return false;
  }
  return true;
};

export const validateStep3 = (formData: RegistrationData): boolean => {
  if (formData.isResearchAnalyst && !formData.certificationNumber.trim()) {
    toast.error("Please enter your Research Analyst certification number");
    return false;
  }
  
  if (!formData.tradingExperience) {
    toast.error("Please select your trading experience");
    return false;
  }
  
  return true;
};
