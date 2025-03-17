
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Loader2, RefreshCw } from 'lucide-react';

interface OtpStepProps {
  otp: string;
  setOtp: (otp: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  onResendOtp: () => Promise<void>;
  newPassword: string;
  setNewPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  email: string;
}

const OtpStep: React.FC<OtpStepProps> = ({ 
  otp, 
  setOtp, 
  isLoading, 
  onSubmit, 
  onBack,
  onResendOtp,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  email
}) => {
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resendLoading) return;
    
    setResendLoading(true);
    await onResendOtp();
    setResendLoading(false);
    
    // Start cooldown (60 seconds)
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="bg-gray-800/30 p-3 rounded-md mb-4">
        <p className="text-sm text-gray-300">
          <span className="text-gray-400">Recovery email:</span> {email}
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="otp" className="text-gray-300 mb-2 block">Verification Code</Label>
        <p className="text-sm text-gray-400 mb-4">
          Enter the 6-digit code sent to your email with message "your verification otp is here"
        </p>
        
        <div className="flex justify-center mb-4">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              {Array.from({ length: 6 }).map((_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="w-10 h-12 text-center bg-gray-800/50 border-gray-700 text-white"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        
        <div className="flex justify-center mt-2 mb-6">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResendOtp}
            disabled={resendCooldown > 0 || resendLoading}
            className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
          >
            {resendLoading ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
            ) : (
              <RefreshCw className="h-3 w-3 mr-1" />
            )}
            {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend verification code'}
          </Button>
        </div>
      </div>
      
      <Button
        type="submit"
        disabled={isLoading || otp.length < 6}
        className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-6 rounded-xl shadow-lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : 'Verify Code'}
      </Button>
      
      <div className="text-center mt-4">
        <Button
          type="button"
          variant="link"
          onClick={onBack}
          className="text-[#FF00D4]"
        >
          Back to Email
        </Button>
      </div>
    </form>
  );
};

export default OtpStep;
