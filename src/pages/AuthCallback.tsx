
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // First check for recovery token in URL (for password reset links)
        const searchParams = new URLSearchParams(window.location.search);
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        
        console.log('Auth callback processing, search params:', { token: !!token, type });
        
        // If this is a recovery flow with token in the URL
        if (token && type === 'recovery') {
          console.log('Processing password recovery with token');
          // Redirect to forgot-password page with the token
          navigate(`/forgot-password?token=${token}&type=${type}`);
          return;
        }
        
        // Handle hash fragment tokens (normal auth flow)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const hashType = hashParams.get('type');
        const provider = hashParams.get('provider');
        
        console.log('Auth callback processing hash params:', { 
          accessToken: !!accessToken, 
          refreshToken: !!refreshToken, 
          type: hashType,
          provider
        });
        
        // If we have tokens in the URL hash, we came from a successful auth flow
        if (accessToken && refreshToken) {
          try {
            // Try to set the session with the tokens from the URL
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            
            if (sessionError) {
              console.error('Error setting session from callback:', sessionError);
              setError('Failed to authenticate session. Please try again.');
              return;
            }
            
            console.log('Auth callback: Session set successfully');
            
            // Get the user data to check if this is a new user (sign up) or existing user (sign in)
            const { data: userData } = await supabase.auth.getUser();
            const { data: sessionData } = await supabase.auth.getSession();
            
            const isNewUser = sessionData?.session?.user?.app_metadata?.provider === provider && 
                             sessionData?.session?.user?.created_at === sessionData?.session?.user?.updated_at;
            
            if (isNewUser && provider === 'google') {
              toast.success('Google account successfully connected!');
              console.log('New user signed up with Google');
            } else if (provider === 'google') {
              toast.success('Google login successful!');
              console.log('Existing user signed in with Google');
            }
            
            // Check if this is a password reset flow
            if (hashType === 'recovery') {
              console.log('Auth callback: Redirecting to forgot-password for hash recovery');
              navigate('/forgot-password?type=recovery');
              return;
            }
            
            // For normal login, redirect to dashboard or home
            navigate('/dashboard');
          } catch (err) {
            console.error('Exception setting session in callback:', err);
            setError('Authentication failed. Please try again.');
          }
        } else {
          // No tokens found but we're on the callback page
          const error = searchParams.get('error');
          const errorDescription = searchParams.get('error_description');
          
          if (error) {
            console.error('Auth callback error:', error, errorDescription);
            setError(errorDescription || 'Authentication failed');
          } else {
            // No tokens and no error - just redirect to auth page
            navigate('/auth');
          }
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err);
        setError('An unexpected error occurred. Please try again.');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-charcoalPrimary text-white p-6">
      {error ? (
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
          <p className="text-red-400 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/auth')}
            className="px-4 py-2 bg-cyan rounded-lg hover:bg-cyan/80 transition"
          >
            Return to Login
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-cyan mb-4" />
          <h1 className="text-xl font-semibold">Authenticating...</h1>
          <p className="text-gray-400 mt-2">Please wait while we complete your authentication</p>
        </div>
      )}
    </div>
  );
};

export default AuthCallback;
