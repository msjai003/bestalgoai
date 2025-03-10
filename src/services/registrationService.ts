
import { supabase } from '@/lib/supabase/client';
import { RegistrationData } from '@/types/registration';
import { testSupabaseConnection } from '@/lib/supabase/test-connection';

// Test connection before any registration attempts
export const testRegistrationConnection = async () => {
  return await testSupabaseConnection();
};

export const registerUser = async (formData: RegistrationData) => {
  // First test the connection
  const connectionTest = await testSupabaseConnection();
  if (!connectionTest.success) {
    console.error("Connection test failed before registration:", connectionTest);
    throw new Error(`Cannot connect to the database: ${connectionTest.message}`);
  }

  // Prepare user metadata
  const userData = {
    full_name: formData.fullName,
    mobile: formData.mobile,
    trading_experience: formData.tradingExperience,
    is_research_analyst: formData.isResearchAnalyst,
    certification_number: formData.certificationNumber || null,
  };
  
  console.log("Registering user with Supabase:", { email: formData.email, userData });
  
  // Attempt to sign up the user
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

// Function to directly login a user
export const loginUser = async (email: string, password: string) => {
  console.log("Attempting to login user:", email);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    console.error("Login error:", error);
    throw new Error(error.message || "Login failed");
  }
  
  console.log("User logged in successfully:", data);
  return data;
};

// Function to save user preferences or other data
export const saveUserData = async (userId: string, data: any) => {
  console.log("Saving user data for:", userId, data);
  
  const { error } = await supabase
    .from('user_profiles')
    .upsert({
      id: userId,
      ...data
    });
  
  if (error) {
    console.error("Error saving user data:", error);
    throw new Error(error.message || "Failed to save user data");
  }
  
  console.log("User data saved successfully");
  return true;
};
