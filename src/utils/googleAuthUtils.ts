
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
    
    return data;
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
    const { error } = await supabase
      .from('google_user_details')
      .upsert({
        id: userId,
        ...googleData,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    
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
