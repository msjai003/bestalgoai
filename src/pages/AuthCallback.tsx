
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const { fetchGoogleUserDetails } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('AuthCallback: Processing authentication callback');
        
        // Handle password recovery token
        const searchParams = new URLSearchParams(window.location.search);
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        
        console.log('Auth callback processing, search params:', { token: !!token, type });
        
        if (token && type === 'recovery') {
          console.log('Processing password recovery with token');
          navigate(`/forgot-password?token=${token}&type=${type}`);
          return;
        }
        
        // Handle OAuth (Google) authentication
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const hashType = hashParams.get('type');
        
        console.log('Auth callback processing hash params:', { 
          accessToken: !!accessToken, 
          refreshToken: !!refreshToken, 
          type: hashType 
        });
        
        if (accessToken && refreshToken) {
          try {
            console.log('Setting session with access and refresh tokens');
            
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            
            if (sessionError) {
              console.error('Error setting session from callback:', sessionError);
              setError('Authentication Error');
              setErrorDetails(sessionError.message || 'Failed to authenticate session. Please try again.');
              setIsProcessing(false);
              return;
            }
            
            console.log('Auth callback: Session set successfully', sessionData);
            
            // Process Google specific auth
            if (sessionData.session?.user?.app_metadata?.provider === 'google') {
              console.log('Google user authenticated, ensuring profile exists...');
              
              try {
                if (sessionData.session.user) {
                  console.log('Fetching Google user details for', sessionData.session.user.id);
                  await fetchGoogleUserDetails(sessionData.session.user.id);
                }
                
                // Check if user profile exists
                const { data: existingProfile } = await supabase
                  .from('user_profiles')
                  .select('id')
                  .eq('id', sessionData.session.user.id)
                  .maybeSingle();

                if (!existingProfile) {
                  console.log('Creating new user profile for Google user');
                  
                  const user = sessionData.session.user;
                  const fullName = `${user.user_metadata?.given_name || ''} ${user.user_metadata?.family_name || ''}`.trim();
                  
                  // Create a basic profile for the Google user
                  const { error: profileError } = await supabase
                    .from('user_profiles')
                    .insert({
                      id: user.id,
                      full_name: fullName || 'Google User',
                      email: user.email,
                      trading_experience: 'beginner',
                      profile_picture: user.user_metadata?.picture
                    });

                  if (profileError) {
                    console.error('Error creating profile:', profileError);
                  } else {
                    console.log('User profile created successfully');
                  }
                } else {
                  console.log('User profile already exists for Google user');
                }
                
                // Always redirect to dashboard after successful Google authentication
                console.log('Redirecting to dashboard after Google authentication');
                navigate('/dashboard', { replace: true });
                return;
              } catch (profileError) {
                console.error('Error handling user profile:', profileError);
                // Still redirect to dashboard even if there's an error with the profile
                navigate('/dashboard', { replace: true });
                return;
              }
            }
            
            if (hashType === 'recovery') {
              navigate('/forgot-password?type=recovery', { replace: true });
              return;
            }
            
            // Default redirect for any other authenticated user
            navigate('/dashboard', { replace: true });
          } catch (err) {
            console.error('Exception setting session in callback:', err);
            setError('Authentication Failed');
            setErrorDetails('An unexpected error occurred while processing your login. Please try again.');
            setIsProcessing(false);
          }
        } else {
          const error = searchParams.get('error');
          const errorDescription = searchParams.get('error_description');
          
          if (error) {
            console.error('Auth callback error:', error, errorDescription);
            setError('Authentication Error');
            setErrorDetails(errorDescription || 'Authentication failed. Please try again.');
            setIsProcessing(false);
          } else {
            // If we get here with no tokens and no error, redirect back to auth
            console.log('No tokens or errors found in callback, redirecting to auth');
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
  }, [navigate, retryCount, fetchGoogleUserDetails]);

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
          <Loader2 className="h-12 w-12 animate-spin text-cyan mb-4 mx-auto" />
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
