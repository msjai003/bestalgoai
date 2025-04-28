
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, ChevronLeft, X, Info, Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        setIsLoading(true);

        // Extract the hash params including access_token
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        const accessToken = hashParams.get('access_token');

        // Handle query params as well (for different Supabase redirect formats)
        const queryParams = new URLSearchParams(location.search);
        const queryToken = queryParams.get('token');

        const token = accessToken || queryToken;
        
        if (!token) {
          console.error('No reset token found in URL');
          setIsTokenValid(false);
          setErrorMessage('Invalid or expired password reset link. Please request a new one.');
          return;
        }
        
        console.log('Token verification in progress...');
        
        // We'll just assume the token is valid if present
        // The actual validation happens when we try to update the password
        setIsTokenValid(true);
      } catch (error: any) {
        console.error('Error verifying token:', error);
        setIsTokenValid(false);
        setErrorMessage('Error processing your password reset request. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    verifyToken();
  }, [location]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    try {
      setIsLoading(true);
      
      // Validate passwords
      if (!password || password.length < 6) {
        setErrorMessage('Password must be at least 6 characters');
        return;
      }
      
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match');
        return;
      }

      // Extract the token from URL hash
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const accessToken = hashParams.get('access_token');
      
      // Handle query params as well
      const queryParams = new URLSearchParams(location.search);
      const queryToken = queryParams.get('token');
      
      const token = accessToken || queryToken;
      
      if (!token) {
        setErrorMessage('Reset token not found. Please try resetting your password again.');
        return;
      }

      // Update the user's password using the token
      const { error } = await supabase.auth.updateUser({ 
        password: password 
      });

      if (error) {
        console.error('Error resetting password:', error);
        setErrorMessage(error.message || 'Failed to reset password. Please try again.');
      } else {
        toast.success('Password updated successfully!');
        
        // Redirect to login page after successful password reset
        setTimeout(() => {
          navigate('/auth');
        }, 1500);
      }
    } catch (error: any) {
      console.error('Password reset error:', error);
      setErrorMessage(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (isTokenValid === null) {
    return (
      <div className="bg-charcoalPrimary min-h-screen flex flex-col items-center justify-center">
        <div className="text-center p-6">
          <Loader2 className="h-10 w-10 animate-spin text-cyan mb-4 mx-auto" />
          <p className="text-white text-lg">Verifying your reset link...</p>
        </div>
      </div>
    );
  }

  if (isTokenValid === false) {
    return (
      <div className="bg-charcoalPrimary min-h-screen flex flex-col">
        <div className="pt-4 px-4">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="flex items-center">
              <i className="fa-solid fa-chart-line text-cyan text-2xl"></i>
              <span className="text-white text-xl ml-2">BestAlgo.ai</span>
            </Link>
          </div>

          <div className="max-w-md mx-auto mt-10 px-4">
            <Alert className="bg-charcoalDanger/10 border-charcoalDanger/30 mb-6" variant="destructive">
              <AlertTriangle className="h-5 w-5 text-charcoalDanger" />
              <AlertDescription className="text-red-200 ml-2">
                {errorMessage || 'Invalid or expired reset link'}
              </AlertDescription>
            </Alert>
            
            <Button
              onClick={() => navigate('/auth')}
              className="w-full mt-4"
              variant="gradient"
            >
              Return to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-charcoalPrimary min-h-screen flex flex-col">
      <div className="pt-4 px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link to="/auth" className="text-gray-400">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <Link to="/" className="flex items-center">
              <i className="fa-solid fa-chart-line text-cyan text-2xl"></i>
              <span className="text-white text-xl ml-2">BestAlgo.ai</span>
            </Link>
          </div>
          <Link to="/" className="text-gray-400">
            <X className="h-5 w-5" />
          </Link>
        </div>

        <section className="mb-6">
          <h1 className="text-xl font-bold text-white mb-2">Reset Your Password</h1>
          <p className="text-gray-400">Enter a new password for your account</p>
        </section>

        <Alert className="bg-cyan/10 border-cyan/30 mb-6" variant="info">
          <Info className="h-4 w-4 text-cyan" />
          <AlertDescription className="text-gray-200 ml-2">
            Your password should be at least 6 characters long and include a mix of letters and numbers.
          </AlertDescription>
        </Alert>

        {errorMessage && (
          <Alert className="bg-charcoalDanger/10 border-charcoalDanger/30 mb-6" variant="destructive">
            <AlertTriangle className="h-4 w-4 text-charcoalDanger" />
            <AlertDescription className="text-red-200 ml-2">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handlePasswordReset} className="space-y-6 premium-card p-6 border border-cyan/30 max-w-md mx-auto">
          <div className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-gray-300">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="••••••••"
                  className="bg-charcoalSecondary/50 border-gray-700 text-white h-11 pr-10 rounded-xl"
                />
                <button 
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-gray-300">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="••••••••"
                  className="bg-charcoalSecondary/50 border-gray-700 text-white h-11 pr-10 rounded-xl"
                />
                <button 
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            variant="gradient"
            className="w-full rounded-xl shadow-lg text-base"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Password...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>
        </form>
      </div>

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-charcoalPrimary/70 z-50">
          <div className="bg-charcoalSecondary p-6 rounded-xl border border-gray-700/50 shadow-xl">
            <Loader2 className="h-10 w-10 animate-spin text-cyan mb-4 mx-auto" />
            <p className="text-white text-center">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
