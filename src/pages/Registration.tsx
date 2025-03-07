
import React from 'react';
import { Button } from '@/components/ui/button';
import { useRegistration } from '@/hooks/useRegistration';
import RegistrationHeader from '@/components/registration/RegistrationHeader';
import ProgressIndicator from '@/components/registration/ProgressIndicator';
import FirefoxHelpSection from '@/components/registration/FirefoxHelpSection';
import RegistrationStepOne from '@/components/registration/RegistrationStepOne';
import RegistrationStepTwo from '@/components/registration/RegistrationStepTwo';
import RegistrationStepThree from '@/components/registration/RegistrationStepThree';
import RegistrationFooter from '@/components/registration/RegistrationFooter';

const Registration = () => {
  const {
    step,
    formData,
    isLoading,
    connectionError,
    showFirefoxHelp,
    handleChange,
    handleNext,
    handleBack,
    handleCompleteRegistration,
  } = useRegistration();

  const renderRegistrationStep = () => {
    switch (step) {
      case 1:
        return <RegistrationStepOne formData={formData} handleChange={handleChange} />;
      case 2:
        return <RegistrationStepTwo formData={formData} handleChange={handleChange} />;
      case 3:
        return <RegistrationStepThree formData={formData} handleChange={handleChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <RegistrationHeader handleBack={handleBack} />

      <section className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Create Your Account</h1>
        <ProgressIndicator step={step} totalSteps={3} />
      </section>

      <FirefoxHelpSection 
        connectionError={connectionError} 
        showFirefoxHelp={showFirefoxHelp} 
      />

      <section className="space-y-6">
        <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700">
          {renderRegistrationStep()}
        </div>

        <Button
          onClick={step === 3 ? handleCompleteRegistration : handleNext}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-8 rounded-xl shadow-lg"
        >
          {isLoading ? "Processing..." : (step === 3 ? 'Complete Registration' : 'Next Step')}
        </Button>

        <RegistrationFooter />
      </section>
    </div>
  );
};

export default Registration;
