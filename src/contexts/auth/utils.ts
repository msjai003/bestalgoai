
import { supabase } from '@/integrations/supabase/client';
import { GoogleUserDetails } from './types';

export const saveGoogleUserDetails = async (userId: string, googleData: Omit<GoogleUserDetails, 'id'>) => {
  try {
    console.log('Saving Google user details for user:', userId);
    
    const { error } = await supabase.from('google_user_details')
      .upsert({
        user_id: userId,
        email: googleData.email,
        google_id: googleData.google_id,
        picture_url: googleData.picture_url,
        given_name: googleData.given_name,
        family_name: googleData.family_name,
        locale: googleData.locale,
        verified_email: googleData.verified_email
      }, {
        onConflict: 'user_id'
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
      .eq('user_id', userId)
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
      id: data.user_id,
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
  } catch (error) {
    console.error("Exception sending welcome SMS:", error);
  }
};
