
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
    
    // Fetch the welcome message and send welcome email
    const { data: welcomeData, error: welcomeError } = await supabase
      .from('welcome_messages')
      .select('content')
      .eq('id', 1)
      .single();
    
    if (welcomeError) {
      console.error("Error fetching welcome message:", welcomeError);
    }
    
    // Send welcome email after successful registration with multiple retries
    const maxRetries = 3;
    let emailSent = false;
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries && !emailSent; attempt++) {
      try {
        console.log(`Attempting to send welcome email (attempt ${attempt}/${maxRetries})`);
        console.log("Email details:", {
          to: formData.email,
          name: formData.fullName,
          hasWelcomeMessage: !!welcomeData?.content
        });
        
        const emailResult = await sendWelcomeEmail(
          formData.email, 
          formData.fullName,
          welcomeData?.content || undefined
        );
        
        if (emailResult.success) {
          console.log("Welcome email sent successfully on attempt", attempt);
          emailSent = true;
        } else {
          console.error(`Failed to send welcome email (attempt ${attempt}/${maxRetries}):`, emailResult.error);
          lastError = emailResult.error;
          // Wait a bit before retrying
          if (attempt < maxRetries) {
            console.log(`Waiting before retry attempt ${attempt + 1}...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
        }
      } catch (emailError) {
        console.error(`Exception sending welcome email (attempt ${attempt}/${maxRetries}):`, emailError);
        lastError = emailError;
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
    
    if (!emailSent) {
      console.error("Failed to send welcome email after all retry attempts:", lastError);
    }
    
    return { success: true, data, emailSent };
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
    console.log("Preparing welcome email request to:", email);
    
    const requestBody = {
      email,
      name: fullName,
      welcomeMessage
    };
    
    console.log("Calling send-welcome-email-smtp with payload:", JSON.stringify(requestBody));
    
    const { data, error } = await supabase.functions.invoke('send-welcome-email-smtp', {
      body: JSON.stringify(requestBody)
    });
    
    if (error) {
      console.error("Error invoking send-welcome-email-smtp:", error);
      return { success: false, error };
    }
    
    console.log("Welcome email function response:", data);
    
    // Check if the data contains an error property (function might have returned error inside data)
    if (data && data.error) {
      console.error("Email function returned error:", data.error);
      return { success: false, error: data.error };
    }
    
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
