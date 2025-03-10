
import { supabase } from '@/lib/supabase/client';
import { RegistrationData } from '@/types/registration';

export const registerUser = async (formData: RegistrationData) => {
  const userData = {
    full_name: formData.fullName,
    mobile: formData.mobile,
    trading_experience: formData.tradingExperience,
    is_research_analyst: formData.isResearchAnalyst,
    certification_number: formData.certificationNumber || null,
  };
  
  const { data, error } = await supabase.auth.signUp({
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
  
  console.log("User created successfully:", data);
  return data;
};

export const checkAuthStatus = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.user;
};
