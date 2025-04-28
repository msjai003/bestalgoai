
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingState from '@/components/auth/LoadingState';
import ErrorState from '@/components/auth/ErrorState';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isPasswordResetFlow, handleMagicLinkAuth, handleOldDomainRedirect } from '@/utils/authCallbackUtils';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const currentUrl = window.location.href;
        console.log('Processing auth callback with URL:', currentUrl);
        
        // Check for reset password flow first - this should take priority
        if (isPasswordResetFlow(currentUrl)) {
          console.log('Password reset flow detected, redirecting to reset-password page');
          
          // Extract any query parameters
          const searchParams = new URLSearchParams(window.location.search);
          let token = searchParams.get('token');
          
          // Check for token in URL path format
          const urlTokenMatch = currentUrl.match(/\/auth\/v1\/verify\/([^?&]+)/);
          if (urlTokenMatch && urlTokenMatch[1]) {
            token = urlTokenMatch[1];
            console.log('Extracted token from URL path:', token.substring(0, 5) + '...');
          }
          
          // Direct navigation to reset-password with token
          const redirectPath = '/reset-password' + (token ? `?token=${encodeURIComponent(token)}` : '');
          console.log('Redirecting to:', redirectPath);
          navigate(redirectPath, { replace: true });
          return;
        }
        
        // Always check for old domain redirect (bestalgo.ai redirect)
        if (handleOldDomainRedirect(currentUrl, navigate)) {
          console.log('Handled domain redirect successfully');
          return;
        }

        // Handle regular magic link authentication via hash
        const hash = window.location.hash;
        if (hash && (hash.includes('type=recovery') || hash.includes('access_token='))) {
          console.log('Processing magic link from hash:', hash.substring(0, 20) + '...');
          const handled = await handleMagicLinkAuth(hash.substring(1), navigate);
          if (handled) {
            return;
          }
        }

        // If no valid authentication data found
        console.error('No valid authentication data found. Redirecting to login page.');
        setError('No valid authentication data found.');
        setErrorDetails('Unable to process authentication. The link may have expired or is invalid.');
        setIsProcessing(false);
        
        // Redirect to login page after error
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 3000);
      } catch (err: any) {
        console.error('Error processing authentication:', err);
        setError('An unexpected error occurred.');
        setErrorDetails(err?.message || 'Please try logging in again.');
        setIsProcessing(false);
        
        // Redirect to login page after error
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 3000);
      }
    };

    processCallback();
  }, [navigate, location]);

  if (error) {
    return (
      <div className="min-h-screen bg-charcoalPrimary flex items-center justify-center p-4">
        <div className="bg-charcoalSecondary p-8 rounded-xl border border-gray-700/50 shadow-xl max-w-md w-full">
          <ErrorState error={error} errorDetails={errorDetails} />
        </div>
      </div>
    );
  }

  return <LoadingState message="Processing authentication..." />;
};

export default AuthCallback;
