
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasAccessToken, setHasAccessToken] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check for access token in URL params and hash
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, '?'));
        const access_token = urlParams.get('access_token') || hashParams.get('access_token');
        
        if (access_token) {
          console.log('Access token found in URL');
          setHasAccessToken(true);
        } else {
          console.log('No access token found, checking session...');
          const { data: { session } } = await supabase.auth.getSession();
          
          if (!session) {
            console.log('No valid session found, redirecting to auth...');
            toast.error('Invalid or expired password reset link');
            setTimeout(() => {
              navigate('/auth', { replace: true });
            }, 1500);
          }
        }
      } catch (err) {
        console.error('Error verifying reset token:', err);
        toast.error('Error verifying reset token');
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 1500);
      }
    };

    checkSession();
  }, [navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Attempting to update password...');
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Error updating password:', error);
        setErrorMessage(error.message || 'Failed to update password');
      } else {
        console.log('Password updated successfully');
        toast.success('Password updated successfully');
        
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 1500);
      }
    } catch (error: any) {
      console.error('Exception during password update:', error);
      setErrorMessage(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'new' | 'confirm') => {
    if (field === 'new') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="min-h-screen bg-charcoalPrimary flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-charcoalSecondary p-8 rounded-xl border border-gray-700/50">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-gray-400">Enter your new password below</p>
        </div>

        {errorMessage && (
          <Alert className="bg-charcoalDanger/10 border-charcoalDanger/30">
            <AlertTriangle className="h-4 w-4 text-charcoalDanger" />
            <AlertDescription className="text-red-200 ml-2">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-gray-300">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-charcoalSecondary/50 border-gray-700 text-white pr-10"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-charcoalSecondary/50 border-gray-700 text-white pr-10"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
            variant="gradient"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Password...
              </>
            ) : (
              'Update Password'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
