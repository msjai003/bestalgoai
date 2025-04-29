
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import { supabase } from '@/integrations/supabase/client';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyRecoveryToken = async () => {
      try {
        // The URL fragment should contain the access token after the user clicks the reset link
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        
        if (!accessToken) {
          setVerificationError('Invalid or expired password reset link. Please request a new one.');
          setIsVerifying(false);
          return;
        }
        
        // Set the access token as the current session
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: '',
        });
        
        if (error) {
          console.error('Error setting session:', error);
          setVerificationError('Invalid or expired password reset link. Please request a new one.');
        }
        
        setIsVerifying(false);
      } catch (error) {
        console.error('Error verifying recovery token:', error);
        setVerificationError('An error occurred while verifying your request. Please try again.');
        setIsVerifying(false);
      }
    };
    
    verifyRecoveryToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (!password.trim() || !confirmPassword.trim()) {
      setErrorMessage('Please fill in both password fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setErrorMessage('Password should be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await updatePassword(password);
      
      if (error) {
        setErrorMessage(error.message);
      } else {
        toast.success('Password has been reset successfully!');
        navigate('/auth');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return <LoadingState message="Verifying your reset link..." />;
  }
  
  if (verificationError) {
    return (
      <div className="bg-charcoalPrimary min-h-screen flex items-center justify-center p-4">
        <div className="bg-charcoalSecondary p-8 rounded-xl border border-gray-700/50 shadow-xl max-w-md w-full">
          <ErrorState 
            error="Password Reset Failed" 
            errorDetails={verificationError}
            onRetry={() => navigate('/auth')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-charcoalPrimary min-h-screen flex flex-col p-4">
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-charcoalSecondary p-8 rounded-xl border border-gray-700/50 shadow-xl max-w-md w-full">
          <h1 className="text-xl font-bold text-white mb-2">Reset Your Password</h1>
          <p className="text-gray-400 mb-6">Enter your new password below.</p>
          
          {errorMessage && (
            <Alert className="bg-charcoalDanger/10 border-charcoalDanger/30 mb-6" variant="destructive">
              <AlertTriangle className="h-4 w-4 text-charcoalDanger" />
              <AlertDescription className="text-red-200 ml-2">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-gray-300 mb-2 block">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-charcoalSecondary/50 border-gray-700 text-white h-11 pr-10 rounded-xl"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="confirmPassword" className="text-gray-300 mb-2 block">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-charcoalSecondary/50 border-gray-700 text-white h-11 pr-10 rounded-xl"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              variant="gradient"
              className="px-8 py-2.5 w-full rounded-xl shadow-lg text-base mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
