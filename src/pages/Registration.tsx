
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRegistration } from '@/hooks/useRegistration';
import { validateStep1, validateStep2, validateStep3 } from '@/utils/registrationValidation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <RegistrationHeader handleBack={handleBack} />

      <section className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Create Your Account</h1>
        <p className="text-gray-400">Join thousands of traders using BestAlgo.ai</p>

        <div className="mt-6">
          <ProgressIndicator step={step} totalSteps={3} />
        </div>
      </section>

      {connectionError && (
        <Alert className="bg-red-900/30 border-red-800 mb-6" variant="destructive">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-200 ml-2">
            {connectionError}
          </AlertDescription>
        </Alert>
      )}

      {browserIssue?.browser === 'Firefox' && showFirefoxHelp && <FirefoxHelpSection />}

      <form onSubmit={handleStepSubmit} className="space-y-6">
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
              variant="outline"
              className="flex-1 bg-transparent border-gray-700 text-white"
              disabled={isLoading}
            >
              Back
            </Button>
          )}
          
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-6 rounded-xl shadow-lg"
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
            <Link to="/auth" className="text-[#FF00D4] ml-2 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </form>

      <RegistrationFooter />
    </div>
  );
};

export default Registration;
