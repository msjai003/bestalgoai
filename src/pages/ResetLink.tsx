
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ResetLink = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSessionChecked, setIsSessionChecked] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check if user has an active session from the magic link
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          console.log("No active session found, user might need to click the reset link again");
          // We'll still show the form, but add an error message
          setError('Your session may have expired. If you cannot reset your password, please request a new reset link.');
        } else {
          console.log("Active session found, user can reset password");
        }
      } catch (err) {
        console.error("Error checking session:", err);
        setError('Could not verify your session. Please try again or request a new reset link.');
      } finally {
        setIsSessionChecked(true);
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!newPassword.trim() || !confirmPassword.trim()) {
        setError('Please fill in all fields');
        setIsLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      if (newPassword.length < 8) {
        setError('Password must be at least 8 characters long');
        setIsLoading(false);
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        setError(updateError.message);
        setIsLoading(false);
        return;
      }

      toast.success('Password reset successfully');
      setTimeout(() => {
        navigate('/auth', { replace: true });
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
      setIsLoading(false);
    }
  };

  if (!isSessionChecked) {
    return (
      <div className="bg-charcoalPrimary min-h-screen flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-cyan mb-4" />
          <p className="text-white">Verifying your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-charcoalPrimary min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="premium-card p-6 border border-cyan/30">
          <h1 className="text-xl font-bold text-white mb-4">Reset Password</h1>
          
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm text-gray-400 mb-1">
                New Password
              </label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-charcoalSecondary text-white border-cyan/30"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm text-gray-400 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-charcoalSecondary text-white border-cyan/30"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            {error && (
              <div className="text-charcoalDanger text-sm">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full bg-cyan hover:bg-cyan/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetLink;
