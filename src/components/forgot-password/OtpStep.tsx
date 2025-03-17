
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

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
  setConfirmPassword
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="otp" className="text-gray-300 mb-2 block">Verification Code</Label>
        <p className="text-sm text-gray-400 mb-4">
          Enter the 6-digit code sent to your email
        </p>
        <div className="flex justify-center mb-6">
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
      
      <div>
        <Label htmlFor="newPassword" className="text-gray-300 mb-2 block">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="••••••••"
          className="bg-gray-800/50 border-gray-700 text-white h-12 mb-4"
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
        disabled={isLoading || otp.length < 6 || !newPassword || !confirmPassword}
        className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-6 rounded-xl shadow-lg"
      >
        {isLoading ? 'Resetting Password...' : 'Reset Password'}
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
