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
        });
        
        // First try with the resend edge function
        console.log("Trying to send email using resend integration...");
        const { error: emailError } = await supabase.functions.invoke('send-welcome-email-resend', {
          body: JSON.stringify({
            email: formData.email,
            name: formData.fullName,
            welcomeMessage: `Welcome to BestAlgo.ai, ${formData.fullName}! We're excited to have you join our trading community.`
          })
        });
        
        if (!emailError) {
          console.log("Welcome email sent successfully on attempt", attempt);
          emailSent = true;
        } else {
          console.error(`Failed to send welcome email (attempt ${attempt}/${maxRetries}):`, emailError);
          
          // If resend fails, try with the SMTP function as fallback
          if (attempt === maxRetries - 1) {
            console.log("Trying fallback SMTP email sender...");
            const { error: smtpError } = await supabase.functions.invoke('send-welcome-email-smtp', {
              body: JSON.stringify({
                email: formData.email,
                name: formData.fullName,
                welcomeMessage: `Welcome to BestAlgo.ai, ${formData.fullName}! We're excited to have you join our trading community.`
              })
            });
            
            if (!smtpError) {
              console.log("Welcome email sent successfully via SMTP fallback");
              emailSent = true;
            } else {
              console.error("SMTP fallback also failed:", smtpError);
              lastError = smtpError;
            }
          } else {
            lastError = emailError;
            if (attempt < maxRetries) {
              console.log(`Waiting before retry attempt ${attempt + 1}...`);
              await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
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
      welcomeMessage: welcomeMessage || `Welcome to BestAlgo.ai, ${fullName}! We're excited to have you join our trading community.`
    };
    
    console.log("Calling send-welcome-email-resend with payload:", JSON.stringify(requestBody));
    
    // Try using Resend first
    const { data, error } = await supabase.functions.invoke('send-welcome-email-resend', {
      body: JSON.stringify(requestBody)
    });
    
    if (error) {
      console.error("Error invoking send-welcome-email-resend:", error);
      
      // Fall back to SMTP if Resend fails
      console.log("Trying fallback SMTP email sender...");
      const { data: smtpData, error: smtpError } = await supabase.functions.invoke('send-welcome-email-smtp', {
        body: JSON.stringify(requestBody)
      });
      
      if (smtpError) {
        console.error("SMTP fallback also failed:", smtpError);
        return { success: false, error: smtpError };
      }
      
      console.log("Email sent via SMTP fallback:", smtpData);
      return { success: true, data: smtpData };
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

// Keep existing check auth status function
export const checkAuthStatus = async () => {
  console.log("Auth status check functionality has been removed");
  return null;
};

// Keep existing login user function
export const loginUser = async (email: string, password: string) => {
  console.log("Login functionality has been removed");
  throw new Error("Login functionality has been removed");
};

// Keep existing save user data function
export const saveUserData = async (userId: string, data: any) => {
  console.log("Save user data functionality has been removed");
  throw new Error("Save user data functionality has been removed");
};
