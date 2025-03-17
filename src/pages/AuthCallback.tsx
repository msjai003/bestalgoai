
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // The hash contains the access token and other auth-related information
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        
        console.log('Auth callback processing, hash params:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });
        
        // If we have tokens in the URL, we came from a successful auth flow
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
            
            // Check if this is a password reset flow
            if (type === 'recovery') {
              console.log('Auth callback: Redirecting to forgot-password');
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
          const error = new URLSearchParams(window.location.search).get('error');
          const errorDescription = new URLSearchParams(window.location.search).get('error_description');
          
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      {error ? (
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
          <p className="text-red-400 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/auth')}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Return to Login
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#FF00D4] mb-4" />
          <h1 className="text-xl font-semibold">Authenticating...</h1>
          <p className="text-gray-400 mt-2">Please wait while we complete your authentication</p>
        </div>
      )}
    </div>
  );
};

export default AuthCallback;
