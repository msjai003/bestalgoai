
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, X, Info, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ForgotPasswordLayoutProps {
  step: number;
  errorMessage: string | null;
  children: React.ReactNode;
}

const ForgotPasswordLayout: React.FC<ForgotPasswordLayoutProps> = ({ step, errorMessage, children }) => {
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
        {children}

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

export default ForgotPasswordLayout;
