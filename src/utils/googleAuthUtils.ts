
import { supabase } from '@/integrations/supabase/client';

export interface GoogleUserDetails {
  id: string;
  google_id?: string;
  email: string;
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
    const { error } = await supabase
      .from('google_user_details')
      .upsert({
        id: userId,
        ...userData
      });
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error saving Google user details:', error);
    return false;
  }
};
