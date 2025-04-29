
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (!token.trim()) {
      setErrorMessage('Please enter the reset token from your email');
      return;
    }
    
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
      // First set the session with the token
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: '',
      });
      
      if (sessionError) {
        setErrorMessage(sessionError.message || 'Invalid or expired token');
        setIsLoading(false);
        return;
      }
      
      // Then update the password
      const { error } = await updatePassword(password);
      
      if (error) {
        setErrorMessage(error.message || 'Failed to update password');
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

  // Updated UI to match the provided image
  return (
    <div className="bg-charcoalPrimary min-h-screen flex items-center justify-center">
      <div className="bg-charcoalSecondary p-8 rounded-xl border border-gray-700/50 shadow-xl max-w-md w-full">
        <h1 className="text-2xl font-bold text-white text-center mb-2">Reset Password</h1>
        <p className="text-gray-400 text-center mb-8">Enter your new password below</p>
        
        {errorMessage && (
          <Alert className="bg-charcoalDanger/10 border-charcoalDanger/30 mb-6" variant="destructive">
            <AlertTriangle className="h-4 w-4 text-charcoalDanger" />
            <AlertDescription className="text-red-200 ml-2">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="token" className="block text-gray-300 mb-2">Reset Token</label>
            <Input
              id="token"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste your reset token here"
              className="bg-gray-100 text-gray-900 h-11 rounded-md w-full"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-gray-300 mb-2">New Password</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-gray-100 text-gray-900 h-11 rounded-md w-full"
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-300 mb-2">Confirm Password</label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-gray-100 text-gray-900 h-11 rounded-md w-full"
            />
          </div>
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan hover:bg-cyan/90 text-white py-2 rounded-md"
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
