
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
}

const OtpStep: React.FC<OtpStepProps> = ({ 
  otp, 
  setOtp, 
  isLoading, 
  onSubmit, 
  onBack,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  email
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

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
          <div className="flex gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Input
                key={i}
                type="text"
                inputMode="numeric"
                maxLength={1}
                pattern="[0-9]"
                className="w-10 h-12 text-center bg-gray-800/50 border-gray-700 text-white"
                value={otp[i] || ''}
                ref={el => inputRefs.current[i] = el}
                onChange={(e) => {
                  const value = e.target.value;
                  
                  // Only allow numbers
                  if (value && !/^[0-9]$/.test(value)) {
                    return;
                  }
                  
                  const newOtp = otp.split('');
                  newOtp[i] = value;
                  setOtp(newOtp.join(''));
                  
                  // Auto-focus next input
                  if (value && i < 5 && inputRefs.current[i + 1]) {
                    inputRefs.current[i + 1]?.focus();
                  }
                }}
                onKeyDown={(e) => {
                  // Handle backspace to move to previous input
                  if (e.key === 'Backspace' && !otp[i] && i > 0) {
                    if (inputRefs.current[i - 1]) {
                      inputRefs.current[i - 1]?.focus();
                    }
                  }
                  
                  // Handle arrow keys
                  if (e.key === 'ArrowLeft' && i > 0) {
                    if (inputRefs.current[i - 1]) {
                      inputRefs.current[i - 1]?.focus();
                    }
                  }
                  
                  if (e.key === 'ArrowRight' && i < 5) {
                    if (inputRefs.current[i + 1]) {
                      inputRefs.current[i + 1]?.focus();
                    }
                  }
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const pastedData = e.clipboardData.getData('text/plain').trim();
                  
                  // Check if pasted content is a valid OTP (6 digits)
                  if (/^\d{6}$/.test(pastedData)) {
                    setOtp(pastedData);
                    // Focus the last input
                    if (inputRefs.current[5]) {
                      inputRefs.current[5]?.focus();
                    }
                  }
                }}
              />
            ))}
          </div>
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
