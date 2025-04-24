
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchGoogleUserDetails, saveGoogleUserDetails } from '@/utils/googleAuthUtils';
import { AuthUser, GoogleUserDetails } from './types';
import { useNavigate } from 'react-router-dom';

export const useAuthState = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [googleUserDetails, setGoogleUserDetails] = useState<GoogleUserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('useAuthState - Checking active session');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking auth session:', error);
          setIsLoading(false);
          return;
        }
        
        if (session?.user) {
          console.log('Active session found:', session.user.id);
          console.log('User metadata:', session.user.user_metadata);
          console.log('Auth provider:', session.user.app_metadata?.provider);
          
          const authUser = {
            id: session.user.id,
            email: session.user.email || '',
          };
          
          setUser(authUser);
          
          if (session.user.app_metadata?.provider === 'google') {
            console.log('Google user detected, fetching details...');
            fetchUserGoogleDetails(session.user.id);
          }
        } else {
          console.log('No active session found');
          setUser(null);
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
        console.log('Auth state changed:', event);
        
        if (session?.user) {
          console.log('User signed in:', session.user.id);
          console.log('User metadata:', session.user.user_metadata);
          console.log('Auth provider:', session.user.app_metadata?.provider);
          
          const authUser = {
            id: session.user.id,
            email: session.user.email || '',
          };
          
          setUser(authUser);
          
          // For Google sign-ins, process additional data
          if (event === 'SIGNED_IN' && session.user.app_metadata?.provider === 'google') {
            console.log('Google sign-in detected');
            await handleGoogleSignIn(session.user);
          }
        } else {
          console.log('User signed out or session expired');
          setUser(null);
          setGoogleUserDetails(null);
        }
        
        setIsLoading(false);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleGoogleSignIn = async (user: any) => {
    try {
      if (!user || !user.id) {
        console.log('Invalid user object for Google sign-in');
        return;
      }
      
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
        
        // Create user profile if it doesn't exist
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
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (!existingProfile) {
        console.log('Creating new user profile for Google user');
        const fullName = `${googleData.given_name || ''} ${googleData.family_name || ''}`.trim();
        
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: userId,
            full_name: fullName || 'Google User',
            email: googleData.email,
            profile_picture: googleData.picture_url,
            trading_experience: 'beginner'
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        } else {
          console.log('User profile created successfully');
        }
      } else {
        console.log('User profile already exists');
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
      }
    } catch (error) {
      console.error('Error fetching Google user details:', error);
    }
  };

  // Create a dedicated function to fetch Google details from the context
  const fetchGoogleUserDetails = useCallback(async () => {
    if (user) {
      await fetchUserGoogleDetails(user.id);
    } else {
      console.log('Cannot fetch Google details - no user is signed in');
    }
  }, [user]);

  return {
    user,
    setUser,
    googleUserDetails,
    setGoogleUserDetails,
    isLoading,
    setIsLoading,
    fetchUserGoogleDetails,
    fetchGoogleUserDetails,  // Expose the new function
    handleGoogleSignIn
  };
};
