
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Auth callback processing started');
        
        // Get the current session - wait for it to be fully established
        console.log('Getting session data...');
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setError('Authentication Failed');
          setErrorDetails(sessionError.message || 'Failed to get session data');
          setIsProcessing(false);
          return;
        }
        
        if (sessionData?.session?.user) {
          console.log('Valid session found, user ID:', sessionData.session.user.id);
          
          // Check if user has a profile
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('id', sessionData.session.user.id)
            .maybeSingle();
            
          if (profileError) {
            console.error('Error checking for user profile:', profileError);
          }
          
          // If this is a Google user
          const isGoogleUser = sessionData.session.user.app_metadata?.provider === 'google';
          console.log('Is Google user:', isGoogleUser);
          
          // If no profile exists and this is a Google user, redirect to complete profile
          if (!profileData && isGoogleUser) {
            console.log('New Google user, redirecting to registration completion');
            toast({
              title: "Welcome!",
              description: "Please complete your profile to continue",
              variant: "default",
            });
            navigate('/google-registration', { replace: true });
            return;
          }
          
          // User has profile or is not a Google user, redirect to dashboard
          console.log('User authenticated successfully, redirecting to dashboard');
          toast({
            title: "Login Successful",
            description: "Welcome back!",
            variant: "default",
          });
          navigate('/dashboard', { replace: true });
          return;
        } else {
          console.log('No valid session found in callback handler');
          // Re-check the URL for auth tokens and try to exchange them
          const url = window.location.href;
          if (url.includes('code=') || url.includes('access_token=')) {
            console.log('Auth tokens found in URL, attempting to process');
            
            // Use the proper method to get the URL hash or query parameters
            // This uses the browser's URL API to parse the hash or search query
            const hash = window.location.hash.substring(1);
            const query = window.location.search.substring(1);
            
            // Process the OAuth callback with Supabase
            const { data, error } = await supabase.auth.getSession();
            
            if (error) {
              console.error('Error processing auth callback:', error);
              setError('Authentication Failed');
              setErrorDetails(error.message);
              setIsProcessing(false);
              return;
            }
            
            if (data?.session) {
              console.log('Session established after processing callback');
              navigate('/dashboard', { replace: true });
              return;
            }
          }
        }
        
        // No valid session found
        console.log('No valid session found, redirecting to auth page');
        navigate('/auth', { replace: true });
        
      } catch (err) {
        console.error('Unexpected error in auth callback:', err);
        setError('Authentication Failed');
        setErrorDetails('An unexpected error occurred. Please try again.');
        setIsProcessing(false);
      }
    };

    // Execute the callback handler
    handleCallback();
  }, [navigate, retryCount, toast]);

  const handleRetry = () => {
    setError(null);
    setErrorDetails(null);
    setIsProcessing(true);
    setRetryCount(prev => prev + 1);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-charcoalPrimary text-white p-6">
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
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-charcoalPrimary text-white p-6">
      <div className="max-w-md w-full bg-charcoalSecondary rounded-xl border border-gray-700/50 p-8 shadow-xl text-center">
        <Loader2 className="h-12 w-12 animate-spin text-cyan mx-auto mb-4" />
        <h1 className="text-xl font-semibold">Authenticating...</h1>
        <p className="text-gray-400 mt-2 mb-6">Please wait while we complete your authentication</p>
        <div className="w-full bg-charcoalPrimary/50 rounded-full h-2 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan to-cyan/70 h-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
