
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
        }
        
        if (data.session?.user) {
          const authUser = {
            id: data.session.user.id,
            email: data.session.user.email || '',
          };
          
          setUser(authUser);
          
          if (data.session.user.app_metadata?.provider === 'google') {
            console.log('Google user detected on session check, fetching details');
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
          const authUser = {
            id: session.user.id,
            email: session.user.email || '',
          };
          
          setUser(authUser);
          
          if (event === 'SIGNED_IN' && session.user.app_metadata?.provider === 'google') {
            console.log('Google sign-in detected, fetching user details');
            await handleGoogleSignIn(session.user);
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

        // Check and create user profile if needed
        await ensureUserProfile(user.id, googleData);
      } else {
        console.error('Failed to save Google user details');
      }
    } catch (error) {
      console.error('Error handling Google sign-in:', error);
    }
  };

  const ensureUserProfile = async (userId: string, googleData: any) => {
    try {
      console.log('Checking if user profile exists:', userId);
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (profileCheckError) {
        console.error('Error checking user profile:', profileCheckError);
        return;
      }

      if (!existingProfile) {
        console.log('Creating new user profile for Google user');
        const fullName = `${googleData.given_name || ''} ${googleData.family_name || ''}`.trim();
        
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: userId,
            full_name: fullName || 'Google User',
            email: googleData.email,
            trading_experience: 'beginner',
            profile_picture: googleData.picture_url
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        } else {
          console.log('User profile created successfully');
        }
      } else {
        console.log('User profile already exists for Google user');
      }
    } catch (error) {
      console.error('Error ensuring user profile:', error);
    }
  };

  const fetchUserGoogleDetails = async (userId: string) => {
    try {
      console.log('Fetching Google user details for user:', userId);
      const details = await fetchGoogleUserDetails(userId);
      
      if (details) {
        console.log('Google user details fetched:', details);
        setGoogleUserDetails(details);
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
