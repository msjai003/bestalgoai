
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const handlePasswordRecovery = (token: string, type: string, navigate: (path: string) => void) => {
  console.log('Processing password recovery with token');
  navigate(`/forgot-password?token=${token}&type=${type}`);
};

export const handleAuthSession = async (
  accessToken: string,
  refreshToken: string,
  navigate: (path: string) => void,
  setError: (error: string | null) => void,
  setErrorDetails: (details: string | null) => void,
  setIsProcessing: (isProcessing: boolean) => void,
  redirectTo: string = '/dashboard'
): Promise<void> => {
  try {
    console.log('Setting session with tokens from callback');
    
    // Store session in localStorage for additional persistence
    localStorage.setItem('supabase.auth.token', JSON.stringify({
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: Math.floor(Date.now() / 1000) + 3600 // Assume 1-hour expiry if not provided
    }));
    
    // Also set in sessionStorage for redundancy
    sessionStorage.setItem('supabase.auth.token', JSON.stringify({
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: Math.floor(Date.now() / 1000) + 3600
    }));
    
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    });
    
    if (sessionError) {
      console.error('Error setting session:', sessionError);
      setError('Authentication Error');
      setErrorDetails(sessionError.message || 'Failed to set session');
      setIsProcessing(false);
      return;
    }

    if (sessionData?.session?.user) {
      console.log('Session set successfully, user authenticated:', sessionData.session.user.id);
      
      // Ensure user metadata is saved correctly for Google users
      if (sessionData.session.user.app_metadata?.provider === 'google') {
        await saveGoogleUserData(sessionData.session.user);
      }
      
      // Ensure session is properly stored in localStorage
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: sessionData.session.access_token,
        refresh_token: sessionData.session.refresh_token,
        expires_at: Math.floor(Date.now() / 1000) + sessionData.session.expires_in
      }));
      
      toast.success('Login successful!');

      // Force verification of session before redirect
      const { data: verifyData } = await supabase.auth.getUser();
      console.log('Verified user before redirect:', verifyData?.user?.id);

      // Use a hard redirect with some delay to ensure session is established
      setTimeout(() => {
        console.log('Redirecting to', redirectTo, 'after successful auth with hard redirect');
        window.location.href = redirectTo;
      }, 800);
    } else {
      console.error('No user in session data after setting session');
      setError('Authentication Error');
      setErrorDetails('Failed to get user session');
      setIsProcessing(false);
    }
    
  } catch (err) {
    console.error('Exception in handleAuthSession:', err);
    setError('Authentication Failed');
    setErrorDetails('An unexpected error occurred. Please try again.');
    setIsProcessing(false);
  }
};

export const handleAuthError = (
  error: string | null,
  errorDescription: string | null,
  setError: (error: string | null) => void,
  setErrorDetails: (details: string | null) => void,
  setIsProcessing: (isProcessing: boolean) => void,
  navigate: (path: string) => void
) => {
  if (error) {
    console.error('Auth error:', error, errorDescription);
    setError('Authentication Error');
    setErrorDetails(errorDescription || 'Authentication failed. Please try again.');
    setIsProcessing(false);
    
    setTimeout(() => {
      navigate('/auth');
    }, 5000);
  } else {
    // Hard redirect to ensure full page reload
    window.location.href = '/dashboard';
  }
};

// Improved function to persist Google authentication
export const persistGoogleAuth = async (session: any): Promise<boolean> => {
  try {
    if (!session) return false;
    
    console.log('Persisting Google authentication session');
    
    // Explicitly set the session in localStorage and sessionStorage
    localStorage.setItem('supabase.auth.token', JSON.stringify({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: Math.floor(Date.now() / 1000) + session.expires_in
    }));
    
    sessionStorage.setItem('supabase.auth.token', JSON.stringify({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: Math.floor(Date.now() / 1000) + session.expires_in
    }));
    
    // Store session data in browser storage for persistence
    const { error } = await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token
    });
    
    if (error) {
      console.error('Failed to persist session:', error);
      return false;
    }
    
    // Save Google user data if this is a Google auth
    if (session.user?.app_metadata?.provider === 'google') {
      await saveGoogleUserData(session.user);
    }
    
    // Force verification of session before returning
    const { data: verifyData } = await supabase.auth.getUser();
    console.log('Verified user after setting session:', verifyData?.user?.id);
    
    return true;
  } catch (error) {
    console.error('Error persisting Google auth:', error);
    return false;
  }
};

// Function to save Google user data to Google user details table
const saveGoogleUserData = async (user: any): Promise<boolean> => {
  if (!user || !user.id || user.app_metadata?.provider !== 'google') {
    console.log('Not a Google user or missing ID, skipping Google data save');
    return false;
  }
  
  try {
    console.log('Saving Google user data for user:', user.id);
    
    const googleData = {
      email: user.email || '',
      google_id: user.user_metadata?.sub,
      picture_url: user.user_metadata?.picture,
      given_name: user.user_metadata?.given_name,
      family_name: user.user_metadata?.family_name,
      locale: user.user_metadata?.locale,
      verified_email: user.user_metadata?.email_verified
    };
    
    console.log('Google user data to save:', googleData);
    
    // First check if record exists
    const { data: existingData, error: checkError } = await supabase
      .from('google_user_details')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();
      
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking for existing Google user details:', checkError);
      return false;
    }
    
    if (existingData) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('google_user_details')
        .update({
          email: googleData.email,
          google_id: googleData.google_id,
          picture_url: googleData.picture_url,
          given_name: googleData.given_name,
          family_name: googleData.family_name,
          locale: googleData.locale,
          verified_email: googleData.verified_email,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (updateError) {
        console.error('Error updating Google user details:', updateError);
        return false;
      }
      
      console.log('Updated Google user details successfully');
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from('google_user_details')
        .insert({
          id: user.id,
          email: googleData.email,
          google_id: googleData.google_id,
          picture_url: googleData.picture_url,
          given_name: googleData.given_name,
          family_name: googleData.family_name,
          locale: googleData.locale,
          verified_email: googleData.verified_email,
          updated_at: new Date().toISOString()
        });
        
      if (insertError) {
        console.error('Error inserting Google user details:', insertError);
        return false;
      }
      
      console.log('Inserted Google user details successfully');
    }
    
    return true;
  } catch (error) {
    console.error('Exception saving Google user data:', error);
    return false;
  }
};
