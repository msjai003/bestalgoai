
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OtpStepProps {
  otp: string;
  setOtp: (otp: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  onResendOtp: () => void;
  newPassword?: string;
  setNewPassword?: (password: string) => void;
  confirmPassword?: string;
  setConfirmPassword?: (password: string) => void;
  email?: string;
  resetLinkSent?: boolean;
}

const OtpStep: React.FC<OtpStepProps> = ({
  otp,
  setOtp,
  isLoading,
  onSubmit,
  onBack,
  onResendOtp,
  email,
  resetLinkSent = false,
}) => {
  return (
    <div className="space-y-6">
      {resetLinkSent && (
        <Alert className="bg-green-900/30 border-green-800 mb-4">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-200 ml-2">
            Reset link sent to your mail ID ✅
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-4">
        <p className="text-gray-300 mb-2">Enter the verification code sent to {email && <span className="font-medium text-white">{email}</span>}</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <Label htmlFor="otp" className="text-gray-300 mb-2 block">Verification Code</Label>
          <Input
            id="otp"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
            className="bg-gray-800/50 border-gray-700 text-white h-12"
            disabled={isLoading}
            required
          />
          <p className="text-gray-400 text-sm mt-2">Enter the 6-digit code sent to your email</p>
        </div>
        
        <div className="flex flex-col gap-3">
          <Button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-6 rounded-xl shadow-lg"
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </Button>
          
          <div className="flex justify-between">
            <Button
              type="button"
              onClick={onBack}
              variant="ghost"
              className="text-gray-400 hover:text-white"
              disabled={isLoading}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <Button
              type="button"
              onClick={onResendOtp}
              variant="ghost"
              className="text-gray-400 hover:text-white"
              disabled={isLoading}
            >
              Resend Code
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OtpStep;
