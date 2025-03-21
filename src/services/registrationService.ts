
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

    // Fetch welcome message from database first
    try {
      console.log("Registration successful, getting welcome message from database");
      const { data: welcomeMessageData, error: messageError } = await supabase
        .from('send_message')
        .select('message_content')
        .eq('message_type', 'welcome')
        .maybeSingle();
      
      if (messageError) {
        console.error("Error fetching welcome message:", messageError);
        // Don't return error here, still try to send email with default message
      }
      
      const welcomeMessage = welcomeMessageData?.message_content || "Thank you for signing up with InfoCap Company";
      console.log(`Using welcome message from database: "${welcomeMessage}"`);
      
      // Call the edge function to send welcome email
      const emailResult = await supabase.functions.invoke('send-welcome-email', {
        body: JSON.stringify({
          email: formData.email,
          name: formData.fullName,
          welcomeMessage: welcomeMessage
        })
      });
      
      if (emailResult.error) {
        console.error("Failed to send welcome email:", emailResult.error);
      } else {
        console.log("Email sending result:", emailResult.data);
      }
    } catch (emailError) {
      // Log the error but don't fail registration if email sending fails
      console.error("Failed to send welcome email:", emailError);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Exception during registration:", error);
    return { success: false, error };
  }
};

// Function to call the Supabase edge function
const callSendEmailFunction = async (email: string, name: string, welcomeMessage: string) => {
  try {
    console.log(`Calling edge function to send email to ${email}`);
    
    // Prepare payload with all required data
    const payload = {
      email,
      name,
      welcomeMessage
    };
    
    console.log("Edge function payload:", JSON.stringify(payload));
    
    // Call the edge function
    const { data, error } = await supabase.functions.invoke('send-welcome-email', {
      body: JSON.stringify(payload)
    });
    
    if (error) {
      console.error("Edge function error:", error);
      throw new Error(`Failed to send welcome email: ${error.message}`);
    }
    
    console.log("Edge function response:", data);
    return { success: true, data };
  } catch (callError) {
    console.error("Error calling send-welcome-email function:", callError);
    throw callError;
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
