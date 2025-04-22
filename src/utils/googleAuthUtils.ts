
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
  if (!userId) return false;
  
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
  
  return googleDetails.email || 'Google User';
};

export const saveGoogleUserDetails = async (
  userId: string, 
  googleData: {
    email: string;
    google_id?: string;
    picture_url?: string;
    given_name?: string | { _type: string; value: string };
    family_name?: string | { _type: string; value: string };
    locale?: string | { _type: string; value: string };
    verified_email?: boolean;
  }
): Promise<boolean> => {
  if (!userId || !googleData.email) {
    console.error('Missing required user data for saving Google details');
    return false;
  }
  
  try {
    // Process potentially malformed data from Google metadata
    const processField = (field: any): string | null => {
      if (!field) return null;
      if (field && typeof field === 'object' && field._type === 'undefined') {
        return null;
      }
      if (typeof field === 'string') return field;
      if (field && typeof field === 'object' && field.value) return field.value;
      return null;
    };

    const cleanedData = {
      email: googleData.email,
      google_id: googleData.google_id || null,
      picture_url: googleData.picture_url || null,
      given_name: processField(googleData.given_name),
      family_name: processField(googleData.family_name),
      locale: processField(googleData.locale),
      verified_email: googleData.verified_email || false
    };
    
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
          ...cleanedData,
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
          ...cleanedData,
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
