
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchGoogleUserDetails, saveGoogleUserDetails } from './utils';
import { AuthUser, GoogleUserDetails } from './types';
import { User } from '@supabase/supabase-js';

// Helper function to convert Supabase User to AuthUser
const mapToAuthUser = (user: User | null): AuthUser | null => {
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email || '', // Ensure email is always a string as required by AuthUser
    app_metadata: user.app_metadata,
    user_metadata: user.user_metadata,
    aud: user.aud || "authenticated",
    created_at: user.created_at || new Date().toISOString()
  };
};

export const useAuthState = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [googleUserDetails, setGoogleUserDetails] = useState<GoogleUserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST to avoid missing auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          const authUser = mapToAuthUser(session.user);
          setUser(authUser);
          
          // Handle Google sign-in event separately to avoid race conditions
          if (event === 'SIGNED_IN' && session.user.app_metadata?.provider === 'google') {
            console.log('Google sign-in detected, handling user details');
            // Use setTimeout to prevent blocking the auth state change
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
    
    // THEN check for existing session
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking auth session:', error);
          return;
        }
        
        if (data.session?.user) {
          console.log('Active session found for user:', data.session.user.id);
          const authUser = mapToAuthUser(data.session.user);
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
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleGoogleSignIn = async (user: User) => {
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
