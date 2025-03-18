
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { WizardStepIndicator } from '@/components/strategy/wizard/WizardStepIndicator';
import { WizardContent } from '@/components/strategy/wizard/WizardContent';
import { WizardControls } from '@/components/strategy/wizard/WizardControls';
import { WizardStep, WizardFormData, StrategyLeg } from '@/types/strategy-wizard';
import { v4 as uuidv4 } from 'uuid';

const StrategyWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<WizardStep>(WizardStep.TRADE_SETUP);
  const [strategyName, setStrategyName] = useState<string>('');
  const [isDuplicateName, setIsDuplicateName] = useState<boolean>(false);
  
  // Initialize with default leg
  const defaultLeg: StrategyLeg = {
    id: uuidv4(),
    strategyType: "intraday",
    instrument: "",
    segment: "options",
    underlying: "futures",
    positionType: "buy",
    expiryType: "weekly",
    strikeCriteria: "strike",
    optionType: "call",
    entryTime: "9:15",
    exitTime: "15:15",
    stopLoss: "0",
    reEntryOnSL: false,
    reEntryOnSLCount: "0",
    target: "0",
    reEntryOnTarget: false,
    reEntryOnTargetCount: "0",
    trailingEnabled: false,
    trailingLockProfit: "0",
    trailingLockAt: "0"
  };
  
  const [formData, setFormData] = useState<WizardFormData>({
    legs: [defaultLeg],
    currentLegIndex: 0
  });
  
  const currentLeg = formData.legs[formData.currentLegIndex];
  
  const updateCurrentLeg = (updates: Partial<StrategyLeg>) => {
    const updatedLegs = [...formData.legs];
    updatedLegs[formData.currentLegIndex] = { ...currentLeg, ...updates };
    setFormData({
      ...formData,
      legs: updatedLegs
    });
  };
  
  const handleSelectLeg = (index: number) => {
    setFormData({
      ...formData,
      currentLegIndex: index
    });
  };
  
  const handleAddLeg = () => {
    const newLeg = {
      ...defaultLeg,
      id: uuidv4()
    };
    
    setFormData({
      ...formData,
      legs: [...formData.legs, newLeg],
      currentLegIndex: formData.legs.length
    });
  };
  
  const updateLegByIndex = (index: number, updates: Partial<StrategyLeg>) => {
    const updatedLegs = [...formData.legs];
    updatedLegs[index] = { ...updatedLegs[index], ...updates };
    setFormData({
      ...formData,
      legs: updatedLegs
    });
  };
  
  const handleNext = () => {
    if (currentStep < WizardStep.CONFIRMATION) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > WizardStep.TRADE_SETUP) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleShowStrategyDetails = () => {
    console.log("Show strategy details", {
      name: strategyName,
      legs: formData.legs
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Create Custom Strategy</h1>
      
      <Card className="p-6 bg-gray-800 border-gray-700">
        <WizardStepIndicator currentStep={currentStep} />
        
        <div className="mt-8">
          <WizardContent 
            currentStep={currentStep} 
            currentLeg={currentLeg}
            updateCurrentLeg={updateCurrentLeg}
            formData={formData}
            handleSelectLeg={handleSelectLeg}
            handleAddLeg={handleAddLeg}
            strategyName={strategyName}
            setStrategyName={setStrategyName}
            updateLegByIndex={updateLegByIndex}
            isDuplicateName={isDuplicateName}
            onShowStrategyDetails={handleShowStrategyDetails}
          />
        </div>
        
        <WizardControls
          currentStep={currentStep}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      </Card>
    </div>
  );
};

export default StrategyWizard;
