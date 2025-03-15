
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronLeft, X, Info, AlertTriangle, ArrowRight } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (!email.trim()) {
        setErrorMessage('Please enter your email address.');
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        toast.success('Reset instructions sent to your email');
        setStep(2);
      }
    } catch (error: any) {
      console.error('Password reset request error:', error);
      setErrorMessage(error.message || 'Failed to send reset instructions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (otp.length < 6) {
      setErrorMessage('Please enter the complete verification code');
      return;
    }
    
    // Move to password reset step - actual OTP verification happens via email link
    setStep(3);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (!newPassword.trim() || !confirmPassword.trim()) {
        setErrorMessage('Please enter both password fields');
        setIsLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setErrorMessage('Passwords do not match');
        setIsLoading(false);
        return;
      }

      if (newPassword.length < 8) {
        setErrorMessage('Password must be at least 8 characters');
        setIsLoading(false);
        return;
      }

      // This is typically handled via the email link flow with Supabase
      // This function handles when the user is already on a valid reset token session
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        toast.success('Password has been reset successfully');
        // Redirect to login after successful reset
        window.location.href = '/auth';
      }
    } catch (error: any) {
      console.error('Password reset error:', error);
      setErrorMessage(error.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-gray-300 mb-2 block">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-gray-800/50 border-gray-700 text-white h-12"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-6 rounded-xl shadow-lg"
            >
              {isLoading ? 'Sending...' : 'Send Reset Instructions'}
            </Button>
          </form>
        );
      case 2:
        return (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-gray-300 mb-2 block">Verification Code</Label>
              <p className="text-sm text-gray-400 mb-4">
                Enter the 6-digit code sent to your email
              </p>
              <div className="flex justify-center">
                <InputOTP
                  value={otp}
                  onChange={setOtp}
                  maxLength={6}
                  render={({ slots }) => (
                    <InputOTPGroup>
                      {slots.map((slot, index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="bg-gray-800/50 border-gray-700 text-white"
                        />
                      ))}
                    </InputOTPGroup>
                  )}
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading || otp.length < 6}
              className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-6 rounded-xl shadow-lg"
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </Button>
            <div className="text-center mt-4">
              <Button
                type="button"
                variant="link"
                onClick={() => setStep(1)}
                className="text-[#FF00D4]"
              >
                Back to Email
              </Button>
            </div>
          </form>
        );
      case 3:
        return (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <Label htmlFor="newPassword" className="text-gray-300 mb-2 block">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-gray-800/50 border-gray-700 text-white h-12"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-gray-300 mb-2 block">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-gray-800/50 border-gray-700 text-white h-12"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-6 rounded-xl shadow-lg"
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link to="/auth" className="text-gray-400">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <Link to="/" className="flex items-center">
            <i className="fa-solid fa-chart-line text-[#FF00D4] text-2xl"></i>
            <span className="text-white text-xl ml-2">BestAlgo.ai</span>
          </Link>
        </div>
        <Link to="/" className="text-gray-400">
          <X className="h-5 w-5" />
        </Link>
      </div>

      <section className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        <p className="text-gray-400">
          {step === 1 && "Enter your email to receive password reset instructions."}
          {step === 2 && "Enter the verification code sent to your email."}
          {step === 3 && "Create a new password for your account."}
        </p>
      </section>

      <Alert className="bg-blue-900/30 border-blue-800 mb-6">
        <Info className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-blue-200 ml-2">
          {step === 1 && "We'll send you instructions to reset your password."}
          {step === 2 && "Check your email for the 6-digit verification code."}
          {step === 3 && "Choose a strong password with at least 8 characters."}
        </AlertDescription>
      </Alert>

      {errorMessage && (
        <Alert className="bg-red-900/30 border-red-800 mb-6" variant="destructive">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-200 ml-2">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="max-w-md mx-auto">
        {renderStep()}

        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Remember your password? 
            <Link to="/auth" className="text-[#FF00D4] ml-2 hover:underline">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
