
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

    // Send welcome email from send_message table
    try {
      await sendWelcomeEmail(formData.email, formData.fullName);
    } catch (emailError) {
      // Don't fail registration if email sending fails
      console.error("Failed to send welcome email:", emailError);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Exception during registration:", error);
    return { success: false, error };
  }
};

// Function to send welcome email
const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    // Fetch welcome message from the database
    const { data: welcomeMessageData, error: messageError } = await supabase
      .from('send_message')
      .select('message_content')
      .eq('message_type', 'welcome')
      .maybeSingle();
    
    if (messageError) {
      console.error("Error fetching welcome message:", messageError);
      // Fall back to default message if database fetch fails
      const defaultMessage = "Thank you for signing up with InfoCap Company";
      console.log(`Sending default welcome email to ${email} with name ${name}: ${defaultMessage}`);
      return { success: true, message: defaultMessage };
    }
    
    const welcomeMessage = welcomeMessageData?.message_content || "Thank you for signing up with InfoCap Company";
    
    // In a real implementation, this would call an email service API
    console.log(`Sending welcome email to ${email} with name ${name}: ${welcomeMessage}`);
    
    // Here we would actually send the email using an email service
    // For example, using Supabase edge function to send email:
    /*
    const response = await supabase.functions.invoke('send-welcome-email', {
      body: JSON.stringify({
        email,
        name,
        welcomeMessage
      })
    });
    
    if (response.error) {
      throw new Error('Failed to send welcome email: ' + response.error.message);
    }
    */
    
    // For now, we're just simulating the email being sent
    return { success: true, message: welcomeMessage };
  } catch (error) {
    console.error("Error sending welcome email:", error);
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
