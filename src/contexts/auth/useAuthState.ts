
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, GoogleUserDetails } from './types';
import { fetchGoogleUserDetails, saveGoogleUserDetails } from '@/utils/googleAuthUtils';

export const useAuthState = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [googleUserDetails, setGoogleUserDetails] = useState<GoogleUserDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch Google user details function
  const fetchUserGoogleDetails = useCallback(async (userId: string) => {
    try {
      console.log('Fetching Google user details for user:', userId);
      const googleDetails = await fetchGoogleUserDetails(userId);
      if (googleDetails) {
        console.log('Found Google user details:', googleDetails);
        setGoogleUserDetails(googleDetails);
      }
    } catch (error) {
      console.error('Error fetching Google user details:', error);
    }
  }, []);

  // Handle Google sign-in data
  const handleGoogleSignIn = useCallback(async (user: any) => {
    try {
      if (!user || !user.id) return;
      
      console.log('Handling Google user sign-in for:', user.id);
      
      // Extract and clean Google user metadata
      const googleData = {
        email: user.email || '',
        google_id: user.user_metadata?.sub || user.app_metadata?.provider_id,
        picture_url: user.user_metadata?.picture,
        given_name: user.user_metadata?.given_name,
        family_name: user.user_metadata?.family_name,
        locale: user.user_metadata?.locale,
        verified_email: user.user_metadata?.email_verified
      };
      
      console.log('Saving Google user data:', googleData);
      
      // Save Google user details to database
      await saveGoogleUserDetails(user.id, googleData);
      
      // Fetch the saved details for state
      await fetchUserGoogleDetails(user.id);
      
    } catch (error) {
      console.error('Error handling Google sign-in:', error);
    }
  }, [fetchUserGoogleDetails]);

  // Initialize auth state from session
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        
        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event);
            
            if (session?.user) {
              const authUser: AuthUser = {
                id: session.user.id,
                email: session.user.email || '',
                app_metadata: session.user.app_metadata || {},
                user_metadata: session.user.user_metadata || {},
                aud: session.user.aud || 'authenticated',
                created_at: session.user.created_at || new Date().toISOString()
              };
              
              setUser(authUser);
              
              // If this is a Google user, handle the Google-specific data
              if (session.user.app_metadata?.provider === 'google') {
                setTimeout(() => {
                  handleGoogleSignIn(session.user);
                }, 0);
              }
            } else {
              setUser(null);
              setGoogleUserDetails(null);
            }
          }
        );
        
        // Check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting auth session:', error);
          setUser(null);
        } else if (session?.user) {
          console.log('Found existing session for user:', session.user.id);
          
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            app_metadata: session.user.app_metadata || {},
            user_metadata: session.user.user_metadata || {},
            aud: session.user.aud || 'authenticated',
            created_at: session.user.created_at || new Date().toISOString()
          };
          
          setUser(authUser);
          
          // If this is a Google user, fetch Google-specific data
          if (session.user.app_metadata?.provider === 'google') {
            await fetchUserGoogleDetails(session.user.id);
          }
        }
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, [fetchUserGoogleDetails, handleGoogleSignIn]);

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
