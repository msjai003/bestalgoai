
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, X, Info, AlertTriangle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ForgotPasswordLayoutProps {
  step: number;
  errorMessage: string | null;
  children: React.ReactNode;
  verificationInProgress?: boolean;
}

const ForgotPasswordLayout: React.FC<ForgotPasswordLayoutProps> = ({
  step,
  errorMessage,
  children,
  verificationInProgress = false
}) => {
  return (
    <div className="bg-charcoalPrimary min-h-screen flex flex-col">
      <div className="pt-4 px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link to="/auth" className="text-gray-400">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <Link to="/" className="flex items-center">
              <i className="fa-solid fa-chart-line text-cyan text-2xl"></i>
              <span className="text-white text-xl ml-2">BestAlgo.ai</span>
            </Link>
          </div>
          <Link to="/" className="text-gray-400">
            <X className="h-5 w-5" />
          </Link>
        </div>

        <section className="mb-6">
          <h1 className="text-xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-gray-400">
            {step === 1 && "Enter your email to receive a verification code."}
            {step === 2 && "Enter the verification code sent to your email."}
            {step === 3 && "Create a new password for your account."}
          </p>
        </section>

        <Alert className="bg-cyan/10 border-cyan/30 mb-6" variant="info">
          <Info className="h-4 w-4 text-cyan" />
          <AlertDescription className="text-gray-200 ml-2">
            {step === 1 && "We'll send you a verification code to reset your password."}
            {step === 2 && "Check your email for a 6-digit verification code."}
            {step === 3 && "Create a new strong password for your account."}
          </AlertDescription>
        </Alert>

        {errorMessage && (
          <Alert className="bg-charcoalDanger/10 border-charcoalDanger/30 mb-6" variant="destructive">
            <AlertTriangle className="h-4 w-4 text-charcoalDanger" />
            <AlertDescription className="text-red-200 ml-2">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="max-w-md mx-auto">
          {verificationInProgress ? (
            <div className="text-center premium-card p-6 py-12 border border-cyan/30">
              <Loader2 className="h-12 w-12 animate-spin text-cyan mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Verifying your request...</h3>
              <p className="text-gray-400">Please wait while we verify your password reset link.</p>
            </div>
          ) : (
            <div className="premium-card p-6 border border-cyan/30">
              {children}
            </div>
          )}

          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Remember your password? 
              <Link to="/auth" className="text-cyan ml-2 hover:underline">
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordLayout;
