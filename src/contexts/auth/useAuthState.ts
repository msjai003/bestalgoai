
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchGoogleUserDetails, saveGoogleUserDetails } from './utils';
import { AuthUser, GoogleUserDetails } from './types';

export const useAuthState = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [googleUserDetails, setGoogleUserDetails] = useState<GoogleUserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking auth session:', error);
          return;
        }
        
        if (data.session?.user) {
          console.log('Active session found for user:', data.session.user.id);
          const authUser: AuthUser = {
            id: data.session.user.id,
            email: data.session.user.email || '',
            app_metadata: data.session.user.app_metadata || {},
            user_metadata: data.session.user.user_metadata || {},
            aud: data.session.user.aud || "authenticated",
            created_at: data.session.user.created_at || new Date().toISOString()
          };
          setUser(authUser);
          
          // If this is a Google user, fetch their details
          if (data.session.user.app_metadata?.provider === 'google') {
            console.log('Google user detected, fetching details');
            fetchUserGoogleDetails(data.session.user.id);
          }
        }
      } catch (error) {
        console.error('Error during session check:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            app_metadata: session.user.app_metadata || {},
            user_metadata: session.user.user_metadata || {},
            aud: session.user.aud || "authenticated",
            created_at: session.user.created_at || new Date().toISOString()
          };
          setUser(authUser);
          
          // Handle Google sign-in event separately to avoid race conditions
          if (event === 'SIGNED_IN' && session.user.app_metadata?.provider === 'google') {
            console.log('Google sign-in detected, handling user details');
            setTimeout(() => {
              handleGoogleSignIn(session.user);
            }, 0);
          }
        } else {
          setUser(null);
          setGoogleUserDetails(null);
        }
        setIsLoading(false);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleGoogleSignIn = async (user: any) => {
    try {
      if (!user || !user.id) return;
      
      console.log('Handling Google sign-in for user:', user.id);
      
      const googleData = {
        email: user.email || '',
        google_id: user.user_metadata?.sub,
        picture_url: user.user_metadata?.picture,
        given_name: user.user_metadata?.given_name,
        family_name: user.user_metadata?.family_name,
        locale: user.user_metadata?.locale,
        verified_email: user.user_metadata?.email_verified
      };
      
      console.log('Saving Google user data:', googleData);
      
      const success = await saveGoogleUserDetails(user.id, googleData);
      
      if (success) {
        console.log('Google user details saved successfully');
        setGoogleUserDetails({
          id: user.id,
          ...googleData
        });
      } else {
        console.error('Failed to save Google user details');
      }
    } catch (error) {
      console.error('Error handling Google sign-in:', error);
    }
  };

  const fetchUserGoogleDetails = async (userId: string) => {
    try {
      console.log('Fetching Google user details for user:', userId);
      const data = await fetchGoogleUserDetails(userId);
      
      if (data) {
        console.log('Google user details fetched:', data);
        setGoogleUserDetails(data);
      } else {
        console.log('No Google user details found for user:', userId);
        setGoogleUserDetails(null);
      }
    } catch (error) {
      console.error('Exception fetching Google user details:', error);
    }
  };

  return {
    user,
    setUser,
    googleUserDetails,
    setGoogleUserDetails,
    isLoading,
    setIsLoading,
    fetchUserGoogleDetails,
    handleGoogleSignIn
  };
};
