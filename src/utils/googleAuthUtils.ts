
import { supabase } from '@/integrations/supabase/client';

export const fetchGoogleUserDetails = async (userId: string) => {
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

export const getGoogleDisplayName = (googleDetails: any): string => {
  if (!googleDetails) return '';
  
  if (googleDetails.given_name && googleDetails.family_name) {
    return `${googleDetails.given_name} ${googleDetails.family_name}`;
  }
  
  if (googleDetails.given_name) {
    return googleDetails.given_name;
  }
  
  return 'Google User';
};
