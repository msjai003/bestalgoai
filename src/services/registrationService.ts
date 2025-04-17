
import { supabase } from '@/integrations/supabase/client';
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

  try {
    console.log("Starting registration process for:", formData.email);
    
    // Check if email already exists
    const { data: existingUsers, error: emailCheckError } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('email', formData.email)
      .maybeSingle();
    
    if (emailCheckError) {
      console.error("Error checking for existing email:", emailCheckError);
    }
    
    // If user already exists, return specific error
    if (existingUsers) {
      console.log("Email already registered:", formData.email);
      return { 
        success: false, 
        error: new Error("This email address you entered is already registered"),
        code: "EMAIL_ALREADY_EXISTS"
      };
    }

    // Proceed with registration logic
    console.log("Email check passed, proceeding with registration");
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          mobile_number: formData.mobile,
          trading_experience: formData.tradingExperience
        }
      }
    });

    if (error) {
      // Check if the error is about email already in use
      if (error.message.includes("User already registered")) {
        return { 
          success: false, 
          error: new Error("This email address you entered is already registered"),
          code: "EMAIL_ALREADY_EXISTS"
        };
      }
      
      console.error("Registration error:", error);
      return { success: false, error };
    }

    console.log("Registration successful:", data);
    
    // Send welcome email after successful registration
    try {
      console.log("Attempting to send welcome email to:", formData.email);
      const emailResult = await sendWelcomeEmail(
        formData.email, 
        formData.fullName,
        "Welcome to our platform! We're excited to have you join us."
      );
      
      if (emailResult.success) {
        console.log("Welcome email sent successfully");
      } else {
        console.error("Failed to send welcome email:", emailResult.error);
      }
    } catch (emailError) {
      console.error("Exception sending welcome email:", emailError);
      // Don't fail registration if email fails
    }
    
    return { success: true, data };
  } catch (error) {
    console.error("Exception during registration:", error);
    return { success: false, error };
  }
};

export const sendWelcomeEmail = async (email: string, fullName: string, welcomeMessage?: string) => {
  if (!email || !fullName) {
    console.error("Cannot send welcome email: missing email or name");
    return { success: false, error: "Missing email or name" };
  }
  
  try {
    console.log("Sending welcome email to:", email);
    const { data, error } = await supabase.functions.invoke('send-welcome-email-resend', {
      body: JSON.stringify({
        email,
        name: fullName,
        welcomeMessage
      })
    });
    
    if (error) {
      console.error("Error sending welcome email:", error);
      return { success: false, error };
    }
    
    console.log("Welcome email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Exception sending welcome email:", error);
    return { success: false, error };
  }
};

export const checkAuthStatus = async () => {
  console.log("Auth status check functionality has been removed");
  return null;
};

export const loginUser = async (email: string, password: string) => {
  console.log("Login functionality has been removed");
  throw new Error("Login functionality has been removed");
};

export const saveUserData = async (userId: string, data: any) => {
  console.log("Save user data functionality has been removed");
  throw new Error("Save user data functionality has been removed");
};
