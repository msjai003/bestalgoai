
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    if (!email.trim()) {
      setErrorMessage('Please enter your email address');
      setIsLoading(false);
      return;
    }

    try {
      // Get the current window location to use as base for the reset URL
      const baseUrl = window.location.origin;
      
      // Send reset email with a redirect to our reset-password page
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/reset-password`
      });
      
      if (error) {
        console.error('Error sending password reset email:', error);
        setErrorMessage(error.message || 'An error occurred while sending the reset link');
      } else {
        setIsSuccess(true);
        toast.success('Password reset email sent successfully!');
        console.log('Password reset email sent to:', email);
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'An unexpected error occurred');
      console.error('Exception during password reset:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <button 
        onClick={onBack} 
        className="flex items-center text-gray-400 hover:text-white mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Login
      </button>
      
      <h1 className="text-xl font-bold text-white mb-2">Forgot Password</h1>
      <p className="text-gray-400 mb-6">Enter your email and we'll send you a link to reset your password.</p>

      {errorMessage && (
        <Alert className="bg-charcoalDanger/10 border-charcoalDanger/30 mb-4" variant="destructive">
          <AlertTriangle className="h-4 w-4 text-charcoalDanger" />
          <AlertDescription className="text-red-200 ml-2">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {isSuccess ? (
        <div className="bg-green-800/20 border border-green-700/30 p-4 rounded-xl">
          <p className="text-green-200">
            Password reset link sent! Please check your email inbox and follow the instructions to reset your password.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-gray-300 mb-2 block">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-charcoalSecondary/50 border-gray-700 text-white h-11 rounded-xl"
              disabled={isLoading}
            />
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
                Sending Link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
