
import React from 'react';
import { Card } from '@/components/ui/card';
import { WizardStepIndicator } from '@/components/strategy/wizard/WizardStepIndicator';
import { WizardContent } from '@/components/strategy/wizard/WizardContent';
import { WizardControls } from '@/components/strategy/wizard/WizardControls';
import { useState } from 'react';

// Type for our wizard steps
type WizardStep = 'details' | 'setup' | 'timing' | 'risk' | 'confirm';

const StrategyWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('details');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    // Add more fields as needed
  });
  
  const handleNext = () => {
    switch (currentStep) {
      case 'details':
        setCurrentStep('setup');
        break;
      case 'setup':
        setCurrentStep('timing');
        break;
      case 'timing':
        setCurrentStep('risk');
        break;
      case 'risk':
        setCurrentStep('confirm');
        break;
      default:
        break;
    }
  };
  
  const handlePrevious = () => {
    switch (currentStep) {
      case 'setup':
        setCurrentStep('details');
        break;
      case 'timing':
        setCurrentStep('setup');
        break;
      case 'risk':
        setCurrentStep('timing');
        break;
      case 'confirm':
        setCurrentStep('risk');
        break;
      default:
        break;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Create Custom Strategy</h1>
      
      <Card className="p-6 bg-gray-800 border-gray-700">
        <WizardStepIndicator currentStep={currentStep} />
        
        <div className="mt-8">
          <WizardContent 
            currentStep={currentStep} 
            formData={formData}
            setFormData={setFormData}
          />
        </div>
        
        <WizardControls
          currentStep={currentStep}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isLastStep={currentStep === 'confirm'}
        />
      </Card>
    </div>
  );
};

export default StrategyWizard;
