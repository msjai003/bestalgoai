
import { supabase } from '@/integrations/supabase/client';

export interface GoogleUserDetails {
  email: string;
  google_id?: string;
  picture_url?: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
  verified_email?: boolean;
}

export const saveGoogleUserDetails = async (userId: string, userData: GoogleUserDetails): Promise<boolean> => {
  if (!userData.email) {
    console.error('Email is required for Google user details');
    return false;
  }

  try {
    const { error } = await supabase.from('google_user_details').upsert({
      user_id: userId,
      email: userData.email,
      google_id: userData.google_id,
      picture_url: userData.picture_url,
      given_name: userData.given_name,
      family_name: userData.family_name,
      locale: userData.locale,
      verified_email: userData.verified_email,
      updated_at: new Date().toISOString()
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

export const getGoogleUserDetails = async (userId: string): Promise<GoogleUserDetails | null> => {
  try {
    const { data, error } = await supabase
      .from('google_user_details')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      console.error('Error fetching Google user details:', error);
      return null;
    }

    return {
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
