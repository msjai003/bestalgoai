import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { WizardStep, StrategyLeg, WizardFormData } from "@/types/strategy-wizard";
import { WizardStepIndicator } from "./wizard/WizardStepIndicator";
import { WizardContent } from "./wizard/WizardContent";
import { WizardControls } from "./wizard/WizardControls";
import { StrategyDetailsDialog } from "./wizard/StrategyDetailsDialog";
import { DeploymentDialog } from "./wizard/DeploymentDialog";
import { useToast } from "@/hooks/use-toast";

const INITIAL_LEG: StrategyLeg = {
  id: uuidv4(),
  strategyType: "intraday",
  instrument: "NIFTY",
  segment: "options",
  underlying: "cash",
  positionType: "sell",
  expiryType: "weekly",
  strikeCriteria: "strike",
  strikeLevel: "ATM",
  optionType: "call",
  premiumAmount: "",
  entryTime: "09:35",
  exitTime: "15:15",
  stopLoss: "1",
  reEntryOnSL: false,
  reEntryOnSLCount: "1",
  target: "3",
  reEntryOnTarget: false,
  reEntryOnTargetCount: "1",
  trailingEnabled: false,
  trailingLockProfit: "0.5",
  trailingLockAt: "1.5"
};

interface CustomStrategyWizardProps {
  onSubmit: (strategyData: {
    name: string;
    formData: WizardFormData;
    mode: "paper" | "real" | null;
  }) => void;
}

export const CustomStrategyWizard = ({ onSubmit }: CustomStrategyWizardProps) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>(WizardStep.TRADE_SETUP);
  const [formData, setFormData] = useState<WizardFormData>({
    legs: [{ ...INITIAL_LEG }],
    currentLegIndex: 0
  });
  const [strategyName, setStrategyName] = useState<string>("");
  const [deploymentMode, setDeploymentMode] = useState<"paper" | "real" | null>(null);
  const [showDeploymentDialog, setShowDeploymentDialog] = useState(false);
  const [showStrategyDetails, setShowStrategyDetails] = useState(false);
  const [isDuplicateName, setIsDuplicateName] = useState(false);
  const { toast } = useToast();

  const currentLeg = formData.legs[formData.currentLegIndex];

  useEffect(() => {
    if (strategyName.trim() === "") {
      setIsDuplicateName(false);
      return;
    }

    const storedStrategies = localStorage.getItem('wishlistedStrategies');
    if (storedStrategies) {
      try {
        const parsedStrategies = JSON.parse(storedStrategies);
        const isDuplicate = parsedStrategies.some(
          (strategy: any) => strategy.name?.toLowerCase() === strategyName.trim().toLowerCase()
        );
        setIsDuplicateName(isDuplicate);
      } catch (error) {
        console.error("Error checking strategy names:", error);
      }
    }
  }, [strategyName]);

  const updateCurrentLeg = (updates: Partial<StrategyLeg>) => {
    const updatedLegs = [...formData.legs];
    updatedLegs[formData.currentLegIndex] = {
      ...currentLeg,
      ...updates
    };
    
    setFormData({
      ...formData,
      legs: updatedLegs
    });
  };

  const updateLegByIndex = (index: number, updates: Partial<StrategyLeg>) => {
    const updatedLegs = [...formData.legs];
    updatedLegs[index] = {
      ...updatedLegs[index],
      ...updates
    };
    
    setFormData({
      ...formData,
      legs: updatedLegs
    });
  };

  const handleNext = () => {
    if (currentStep === WizardStep.TRADE_SETUP && 
        formData.currentLegIndex === 0) {
      if (strategyName.trim() === "") {
        toast({
          title: "Strategy Name Required",
          description: "Please enter a name for your strategy before proceeding.",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }
      
      if (isDuplicateName) {
        toast({
          title: "Duplicate Strategy Name",
          description: "A strategy with this name already exists in your wishlist. Please choose a different name.",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }
    }

    if (currentStep < WizardStep.CONFIRMATION) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowStrategyDetails(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > WizardStep.TRADE_SETUP) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddLeg = () => {
    const firstLeg = formData.legs[0];
    const newLeg = {
      ...INITIAL_LEG,
      id: uuidv4(),
      strategyType: firstLeg.strategyType,
      instrument: firstLeg.instrument,
      underlying: firstLeg.underlying,
      segment: firstLeg.segment
    };
    
    setFormData({
      legs: [...formData.legs, newLeg],
      currentLegIndex: formData.legs.length
    });
    
    setCurrentStep(WizardStep.TRADE_SETUP);
  };

  const handleSelectLeg = (index: number) => {
    setFormData({
      ...formData,
      currentLegIndex: index
    });
    setCurrentStep(WizardStep.TRADE_SETUP);
  };

  const handleShowStrategyDetails = () => {
    setShowStrategyDetails(true);
  };

  const handleDeployStrategy = (mode: "paper" | "real") => {
    if (isDuplicateName) {
      toast({
        title: "Duplicate Strategy Name",
        description: "A strategy with this name already exists in your wishlist. Please choose a different name.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setDeploymentMode(mode);
    setShowStrategyDetails(false);
    setShowDeploymentDialog(false);
    
    onSubmit({
      name: strategyName,
      formData: formData,
      mode: mode
    });
  };

  return (
    <div className="space-y-6 bg-gray-800/30 rounded-xl p-4 border border-gray-700">
      <h3 className="text-lg font-medium text-white mb-4">Custom Strategy Configuration</h3>
      
      <WizardStepIndicator currentStep={currentStep} />
      
      <div className="min-h-[450px]">
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
        onPrevious={handlePrevious}
        onNext={handleNext}
      />

      <StrategyDetailsDialog 
        open={showStrategyDetails}
        onOpenChange={setShowStrategyDetails}
        formData={formData}
        strategyName={strategyName}
        onShowDeploymentDialog={() => setShowDeploymentDialog(true)}
      />

      <DeploymentDialog 
        open={showDeploymentDialog}
        onOpenChange={setShowDeploymentDialog}
        onDeployStrategy={handleDeployStrategy}
        strategyName={strategyName}
      />
    </div>
  );
};
