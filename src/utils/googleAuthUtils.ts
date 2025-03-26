
import { supabase } from '@/integrations/supabase/client';

export interface GoogleUserDetails {
  id: string;
  email: string;
  google_id?: string;
  picture_url?: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
  verified_email?: boolean;
}

export const fetchGoogleUserDetails = async (userId: string): Promise<GoogleUserDetails | null> => {
  try {
    const { data, error } = await supabase
      .from('google_user_details')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching Google user details:', error);
      return null;
    }
    
    return data as GoogleUserDetails | null;
  } catch (error) {
    console.error('Exception fetching Google user details:', error);
    return null;
  }
};

export const isGoogleUser = async (userId: string): Promise<boolean> => {
  try {
    const googleDetails = await fetchGoogleUserDetails(userId);
    return !!googleDetails;
  } catch (error) {
    console.error('Error checking if user is Google user:', error);
    return false;
  }
};

export const getGoogleDisplayName = (googleDetails: GoogleUserDetails | null): string => {
  if (!googleDetails) return '';
  
  if (googleDetails.given_name && googleDetails.family_name) {
    return `${googleDetails.given_name} ${googleDetails.family_name}`;
  }
  
  if (googleDetails.given_name) {
    return googleDetails.given_name;
  }
  
  return 'Google User';
};

export const saveGoogleUserDetails = async (
  userId: string, 
  googleData: {
    email: string;
    google_id?: string;
    picture_url?: string;
    given_name?: string;
    family_name?: string;
    locale?: string;
    verified_email?: boolean;
  }
): Promise<boolean> => {
  try {
    // First check if the record already exists
    const { data: existing } = await supabase
      .from('google_user_details')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
      
    if (existing) {
      // Update existing record
      const { error } = await supabase
        .from('google_user_details')
        .update({
          ...googleData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
        
      if (error) {
        console.error('Error updating Google user details:', error);
        return false;
      }
    } else {
      // Insert new record
      const { error } = await supabase
        .from('google_user_details')
        .insert({
          id: userId,
          ...googleData,
          updated_at: new Date().toISOString()
        });
        
      if (error) {
        console.error('Error inserting Google user details:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Exception saving Google user details:', error);
    return false;
  }
};
