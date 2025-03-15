
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface OtpStepProps {
  otp: string;
  setOtp: (otp: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

const OtpStep: React.FC<OtpStepProps> = ({ otp, setOtp, isLoading, onSubmit, onBack }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
