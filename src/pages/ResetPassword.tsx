
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user session is present when component loads
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      // Log session state for debugging
      console.log('Current session state:', data.session ? 'Session exists' : 'No session');
      
      // If there's no session at all, we might want to redirect back to login
      if (!data.session) {
        console.log('No session found on reset password page. User may need to use the link again.');
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
        
        // Short delay before redirecting
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
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-charcoalSecondary/50 border-gray-700 text-white"
              placeholder="Enter new password"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-charcoalSecondary/50 border-gray-700 text-white"
              placeholder="Confirm new password"
              required
            />
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
