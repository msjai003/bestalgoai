
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { RefreshCw } from 'lucide-react';

interface OtpStepProps {
  otp: string;
  setOtp: (otp: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  newPassword: string;
  setNewPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  email: string;
  onResendOtp: () => Promise<void>;
  resendLoading: boolean;
}

const OtpStep: React.FC<OtpStepProps> = ({ 
  otp, 
  setOtp, 
  isLoading, 
  onSubmit, 
  onBack,
  email,
  onResendOtp,
  resendLoading
}) => {
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
          Enter the 6-digit code sent to your email
        </p>
        
        <div className="flex justify-center mb-6">
          <InputOTP 
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
            render={({ slots }) => (
              <div className="flex gap-2">
                {slots.map((slot, idx) => (
                  <InputOTPGroup key={idx} className="bg-gray-800/50 border-gray-700">
                    <InputOTPSlot 
                      {...slot} 
                      index={idx}
                      className="text-white text-center w-10 h-12"
                    />
                  </InputOTPGroup>
                ))}
              </div>
            )}
          />
        </div>

        <div className="text-center mb-4">
          <Button 
            type="button" 
            variant="outline" 
            className="text-sm border-gray-700 hover:bg-gray-800 flex items-center gap-2 mx-auto" 
            onClick={onResendOtp}
            disabled={resendLoading}
          >
            {resendLoading ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
            {resendLoading ? "Sending..." : "Resend verification code"}
          </Button>
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
