
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

  console.log("Registration functionality has been removed");
  throw new Error("Registration functionality has been removed");
};

export const checkAuthStatus = async () => {
  console.log("Auth status check functionality has been removed");
  return null;
};

// Function to directly login a user
export const loginUser = async (email: string, password: string) => {
  console.log("Login functionality has been removed");
  throw new Error("Login functionality has been removed");
};

// Function to save user preferences or other data
export const saveUserData = async (userId: string, data: any) => {
  console.log("Save user data functionality has been removed");
  throw new Error("Save user data functionality has been removed");
};
