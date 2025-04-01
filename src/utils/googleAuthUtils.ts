
import { supabase } from '@/integrations/supabase/client';

export interface GoogleUserDetails {
  id: string;
  google_id?: string;
  email: string; // Make email required as the database expects it
  picture_url?: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
  verified_email?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Function to save Google user details to our database
export const saveGoogleUserDetails = async (userId: string, userData: Partial<GoogleUserDetails>): Promise<boolean> => {
  try {
    // Make sure we include the required email field
    if (!userData.email) {
      throw new Error('Email is required for saving Google user details');
    }

    const userDataToInsert = {
      id: userId,
      email: userData.email,
      google_id: userData.google_id,
      picture_url: userData.picture_url,
      given_name: userData.given_name,
      family_name: userData.family_name,
      locale: userData.locale,
      verified_email: userData.verified_email,
    };

    const { error } = await supabase
      .from('google_user_details')
      .upsert(userDataToInsert);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error saving Google user details:', error);
    return false;
  }
};
