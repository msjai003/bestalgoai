
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';

interface OtpStepProps {
  otp: string;
  setOtp: (otp: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  onResendOtp: () => void;
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
      <Alert className="bg-green-900/30 border-green-800 mb-6">
        <CheckCircle className="h-5 w-5 text-green-400" />
        <AlertDescription className="text-green-200 ml-2 text-base">
          Reset link sent to your mail ID ✅
        </AlertDescription>
      </Alert>

      <div className="mb-6">
        <p className="text-gray-300 mb-2">
          We've sent a password reset link to {email && <span className="font-medium text-white">{email}</span>}
        </p>
        <p className="text-gray-400 text-sm">
          Please check your email and click on the link to reset your password. The link will expire in 30 minutes.
        </p>
      </div>
      
      <div className="flex flex-col gap-4">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          disabled={isLoading}
        >
          Back to Email
        </Button>
        
        <Button
          type="button"
          onClick={onResendOtp}
          variant="ghost"
          className="text-[#FF00D4] hover:text-[#FF00D4]/80 hover:bg-gray-800/50"
          disabled={isLoading}
        >
          Resend Reset Link
        </Button>
      </div>

      <div className="text-center mt-8">
        <p className="text-gray-400 text-sm">
          Remember your password? 
          <Link to="/auth" className="text-[#FF00D4] ml-2 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default OtpStep;
