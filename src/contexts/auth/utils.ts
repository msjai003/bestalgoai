
import { supabase } from '@/integrations/supabase/client';
import { GoogleUserDetails } from './types';

export const saveGoogleUserDetails = async (userId: string, googleData: Omit<GoogleUserDetails, 'id'>) => {
  try {
    console.log('Saving Google user details for user:', userId);
    
    const { error } = await supabase.from('google_user_details')
      .upsert({
        id: userId,  // Using id as the primary key instead of user_id
        email: googleData.email,
        google_id: googleData.google_id,
        picture_url: googleData.picture_url,
        given_name: googleData.given_name,
        family_name: googleData.family_name,
        locale: googleData.locale,
        verified_email: googleData.verified_email
      }, {
        onConflict: 'id'  // Changed from user_id to id
      });
    
    if (error) {
      console.error('Error saving Google user details:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception saving Google user details:', error);
    return false;
  }
};

export const fetchGoogleUserDetails = async (userId: string): Promise<GoogleUserDetails | null> => {
  try {
    console.log('Fetching Google user details for user:', userId);
    
    const { data, error } = await supabase
      .from('google_user_details')
      .select('*')
      .eq('id', userId)  // Changed from user_id to id
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No record found
        console.log('No Google user details found for user:', userId);
        return null;
      }
      
      console.error('Error fetching Google user details:', error);
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    return {
      id: data.id,  // Changed from user_id to id
      email: data.email,
      google_id: data.google_id,
      picture_url: data.picture_url,
      given_name: data.given_name,
      family_name: data.family_name,
      locale: data.locale,
      verified_email: data.verified_email
    };
  } catch (error) {
    console.error('Exception fetching Google user details:', error);
    return null;
  }
};

export const sendWelcomeEmail = async (userId: string, fullName: string) => {
  try {
    // First fetch the user's email from user_profiles
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('id', userId)
      .maybeSingle();
    
    if (profileError) {
      console.error('Error fetching user profile for welcome email:', profileError);
      return;
    }
    
    if (!userProfile || !userProfile.email) {
      console.error('No email found in user profile for ID:', userId);
      return;
    }
    
    console.log(`Preparing to send welcome email to ${userProfile.email}`);
    
    // Call the edge function to send welcome email
    const { data, error } = await supabase.functions.invoke('send-welcome-email', {
      body: JSON.stringify({
        email: userProfile.email,
        name: fullName,
        welcomeMessage: "Thank you for signing up with InfoCap Company!"
      })
    });
    
    if (error) {
      console.error("Error calling send-welcome-email function:", error);
    } else {
      console.log("Email function response:", data);
    }
  } catch (error) {
    console.error("Exception sending welcome email:", error);
  }
};

export const sendWelcomeSMS = async (userId: string, fullName: string, mobileNumber: string) => {
  if (!mobileNumber) return;
  
  try {
    console.log(`Preparing to send welcome SMS to ${mobileNumber}`);
    
    const formattedMobile = mobileNumber.replace(/\D/g, '');
    
    const { data, error } = await supabase.functions.invoke('send-welcome-sms', {
      body: JSON.stringify({
        userId,
        fullName,
        mobileNumber: formattedMobile
      })
    });
    
    if (error) {
      console.error("Error calling send-welcome-sms function:", error);
    } else {
      console.log("SMS function response:", data);
    }
    
    // Also send a welcome email
    await sendWelcomeEmail(userId, fullName);
  } catch (error) {
    console.error("Exception sending welcome SMS:", error);
  }
};
