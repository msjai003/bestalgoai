import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { saveGoogleUserDetails } from '@/utils/googleAuthUtils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Auth callback processing started, URL:', window.location.href);
        
        // Check for recovery token in URL (for password reset links)
        const searchParams = new URLSearchParams(window.location.search);
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        
        console.log('Auth callback processing, search params:', { 
          token: !!token, 
          type, 
          code: !!code, 
          state: !!state 
        });
        
        // If this is a recovery flow with token in the URL
        if (token && type === 'recovery') {
          console.log('Processing password recovery with token');
          // Redirect to forgot-password page with the token
          navigate(`/forgot-password?token=${token}&type=${type}`, { replace: true });
          return;
        }
        
        // Handle the OAuth callback - priority path for Google auth
        if (code && state) {
          console.log('Processing OAuth callback with code and state');
          
          try {
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            
            if (error) {
              console.error('Error exchanging code for session:', error);
              setError('Authentication Error');
              setErrorDetails(error.message || 'Failed to process authentication. Please try again.');
              setIsProcessing(false);
              return;
            }
            
            if (data.session) {
              console.log('Successfully exchanged code for session');
              
              const user = data.session.user;
              
              // If we have a Google provider, save the user details
              if (user?.app_metadata?.provider === 'google') {
                console.log('Google user authenticated, saving details...');
                
                // Extract Google user data from user.user_metadata
                const googleData = {
                  email: user.email || '',
                  google_id: user.user_metadata.sub,
                  picture_url: user.user_metadata.picture,
                  given_name: user.user_metadata.given_name || user.user_metadata.name?.split(' ')[0],
                  family_name: user.user_metadata.family_name || user.user_metadata.name?.split(' ').slice(1).join(' '),
                  locale: user.user_metadata.locale,
                  verified_email: user.user_metadata.email_verified
                };
                
                // Save Google user data
                await saveGoogleUserDetails(user.id, googleData);
              }
              
              toast.success('Login successful!');
              navigate('/dashboard', { replace: true });
              return;
            }
          } catch (oauthError) {
            console.error('Error in OAuth flow:', oauthError);
            setError('Authentication Error');
            setErrorDetails('Failed to process authentication. Please try again.');
            setIsProcessing(false);
            return;
          }
        }
        
        // Fallback - Get session from Supabase
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        console.log('Session check result:', {
          hasSession: !!sessionData?.session,
          error: sessionError ? true : false
        });
        
        if (sessionError) {
          console.error('Error getting session in callback:', sessionError);
          setError('Authentication Error');
          setErrorDetails(sessionError.message || 'Failed to authenticate session. Please try again.');
          setIsProcessing(false);
          return;
        }
        
        // If we have a valid session
        if (sessionData?.session) {
          console.log('Valid session found, redirecting to dashboard');
          toast.success('Login successful!');
          navigate('/dashboard', { replace: true });
          return;
        } else {
          // No valid session found
          const error = searchParams.get('error');
          const errorDescription = searchParams.get('error_description');
          
          if (error) {
            console.error('Auth callback error:', error, errorDescription);
            setError('Authentication Error');
            setErrorDetails(errorDescription || 'Authentication failed. Please try again.');
            setIsProcessing(false);
          } else {
            // No session and no error - just redirect to auth page
            console.log('No session or error found, redirecting to auth page');
            navigate('/auth', { replace: true });
          }
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err);
        setError('Authentication Failed');
        setErrorDetails('An unexpected error occurred. Please try again.');
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [navigate, retryCount, toast]);

  const handleRetry = () => {
    setError(null);
    setErrorDetails(null);
    setIsProcessing(true);
    setRetryCount(prev => prev + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-charcoalPrimary text-white p-6">
      {error ? (
        <div className="max-w-md w-full bg-charcoalSecondary rounded-xl border border-gray-700/50 p-8 shadow-xl text-center">
          <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4">{error}</h1>
          {errorDetails && <p className="text-red-400 mb-6">{errorDetails}</p>}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleRetry}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Link to="/auth">
              <Button className="w-full">
                Return to Login
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="max-w-md w-full bg-charcoalSecondary rounded-xl border border-gray-700/50 p-8 shadow-xl text-center">
          <Loader2 className="h-12 w-12 animate-spin text-cyan mx-auto mb-4" />
          <h1 className="text-xl font-semibold">Authenticating...</h1>
          <p className="text-gray-400 mt-2 mb-6">Please wait while we complete your authentication</p>
          <div className="w-full bg-charcoalPrimary/50 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan to-cyan/70 h-full animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthCallback;
