
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRegistration } from '@/hooks/useRegistration';
import { validateStep1, validateStep2, validateStep3 } from '@/utils/registrationValidation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info } from 'lucide-react';
import RegistrationHeader from '@/components/registration/RegistrationHeader';
import ProgressIndicator from '@/components/registration/ProgressIndicator';
import RegistrationStepOne from '@/components/registration/RegistrationStepOne';
import RegistrationStepTwo from '@/components/registration/RegistrationStepTwo';
import RegistrationStepThree from '@/components/registration/RegistrationStepThree';
import RegistrationFooter from '@/components/registration/RegistrationFooter';
import FirefoxHelpSection from '@/components/registration/FirefoxHelpSection';

const Registration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    step,
    isLoading,
    connectionError,
    browserIssue,
    showFirefoxHelp,
    formData,
    handleChange,
    handleNext,
    handleBack,
    handleCompleteRegistration
  } = useRegistration();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleStepSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1 && validateStep1(formData)) {
      handleNext();
    } else if (step === 2 && validateStep2(formData)) {
      handleNext();
    } else if (step === 3 && validateStep3(formData)) {
      handleCompleteRegistration();
    }
  };

  return (
    <div className="bg-charcoalPrimary min-h-screen flex flex-col">
      <div className="pt-4 px-4">
        <RegistrationHeader handleBack={handleBack} />

        <section className="mb-6">
          <h1 className="text-xl font-bold text-white mb-2">Create Your Account</h1>
          <p className="text-gray-400">Join thousands of traders using BestAlgo.ai</p>

          <div className="mt-6">
            <ProgressIndicator step={step} totalSteps={3} />
          </div>
        </section>

        <Alert className="bg-cyan/10 border-cyan/30 mb-6" variant="info">
          <Info className="h-4 w-4 text-cyan" />
          <AlertDescription className="text-gray-200 ml-2">
            {step === 1 && "Fill in your personal details to get started with your trading journey."}
            {step === 2 && "Create a secure password to protect your account."}
            {step === 3 && "Tell us about your trading experience to help us personalize your experience."}
          </AlertDescription>
        </Alert>

        {connectionError && (
          <Alert className="bg-charcoalDanger/10 border-charcoalDanger/30 mb-6" variant="destructive">
            <AlertTriangle className="h-4 w-4 text-charcoalDanger" />
            <AlertDescription className="text-red-200 ml-2">
              {connectionError}
            </AlertDescription>
          </Alert>
        )}

        {browserIssue?.browser === 'Firefox' && showFirefoxHelp && <FirefoxHelpSection />}

        <form onSubmit={handleStepSubmit} className="space-y-6 premium-card p-6 border border-cyan/30">
          {step === 1 && (
            <RegistrationStepOne 
              formData={formData} 
              handleChange={(field, value) => handleChange(field as any, value)} 
            />
          )}
          
          {step === 2 && (
            <RegistrationStepTwo 
              formData={formData} 
              handleChange={(field, value) => handleChange(field as any, value)} 
            />
          )}
          
          {step === 3 && (
            <RegistrationStepThree 
              formData={formData} 
              handleChange={(field, value) => handleChange(field as any, value)} 
            />
          )}

          <div className="flex gap-4">
            {step > 1 && (
              <Button
                type="button"
                onClick={handleBack}
                variant="secondary"
                className="flex-1 bg-charcoalSecondary/50 border-gray-700 text-white"
                disabled={isLoading}
              >
                Back
              </Button>
            )}
            
            <Button
              type="submit"
              disabled={isLoading}
              variant="gradient"
              className="flex-1 py-6 rounded-xl shadow-lg"
            >
              {isLoading 
                ? 'Processing...' 
                : step < 3 
                  ? 'Continue' 
                  : 'Create Account'}
            </Button>
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Already have an account? 
              <Link to="/auth" className="text-cyan ml-2 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </form>
        
        <RegistrationFooter />
      </div>
    </div>
  );
};

export default Registration;
