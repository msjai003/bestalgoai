
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        // Get the session data
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setError('Authentication Failed');
          setErrorDetails(sessionError.message || 'Failed to get session data');
          setIsProcessing(false);
          return;
        }
        
        if (sessionData?.session?.user) {
          console.log('Valid session found, checking user type');
          
          // If Google user and no profile exists, redirect to complete profile
          const isGoogleUser = sessionData.session.user.app_metadata?.provider === 'google';
          
          if (isGoogleUser) {
            // Check if user has a profile
            const { data: profileData, error: profileError } = await supabase
              .from('user_profiles')
              .select('id')
              .eq('id', sessionData.session.user.id)
              .maybeSingle();
              
            if (profileError) {
              console.error('Error checking for user profile:', profileError);
            }
            
            // If no profile exists for Google user, redirect to registration
            if (!profileData) {
              console.log('New Google user, redirecting to registration');
              toast({
                title: "Welcome!",
                description: "Please complete your profile to continue",
              });
              navigate('/google-registration', { replace: true });
              return;
            }
          }
          
          // User has profile or is not a Google user, redirect to dashboard
          console.log('Redirecting to dashboard');
          toast({
            title: "Login Successful",
            description: "Welcome back!",
          });
          navigate('/dashboard', { replace: true });
          return;
        }
        
        // No valid session found
        setError('Authentication Failed');
        setErrorDetails('No valid session found');
        setIsProcessing(false);
        
      } catch (err) {
        console.error('Unexpected error in auth callback:', err);
        setError('Authentication Failed');
        setErrorDetails('An unexpected error occurred');
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
            <Button 
              onClick={() => navigate('/auth')}
              className="w-full"
            >
              Return to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-charcoalPrimary text-white p-6">
      <div className="max-w-md w-full bg-charcoalSecondary rounded-xl border border-gray-700/50 p-8 shadow-xl text-center">
        <Loader2 className="h-12 w-12 animate-spin text-cyan mx-auto mb-4" />
        <h1 className="text-xl font-semibold">Processing Authentication...</h1>
        <p className="text-gray-400 mt-2">Please wait while we complete your sign in</p>
      </div>
    </div>
  );
};

export default AuthCallback;
