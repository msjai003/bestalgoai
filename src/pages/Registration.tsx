
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
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';

const Registration = () => {
  const {
    step,
    formData,
    isLoading,
    connectionError,
    showFirefoxHelp,
    isOffline,
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

  // Generate a clearer error message for Chrome users
  const getConnectionErrorMessage = () => {
    if (!connectionError) return null;
    
    const userAgent = navigator.userAgent;
    const isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Edg") === -1;
    
    if (isChrome && connectionError.includes("CORS") || connectionError.includes("fetch") || 
        connectionError.includes("network") || connectionError.includes("connect")) {
      return "We're having trouble connecting to our services. This could be due to a network restriction, firewall, or security setting in Chrome.";
    }
    
    return connectionError;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <RegistrationHeader handleBack={handleBack} />

      <section className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Create Your Account</h1>
        <ProgressIndicator step={step} totalSteps={3} />
      </section>

      {isOffline && (
        <div className="mb-4 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg flex items-start">
          <WifiOff className="text-yellow-400 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-yellow-200 text-sm">
              You are currently offline. You can continue filling in the form, and we'll save your registration when you're back online.
            </p>
          </div>
        </div>
      )}

      <FirefoxHelpSection 
        connectionError={getConnectionErrorMessage()} 
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
