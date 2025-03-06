
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TradeSetupStep } from "./wizard/TradeSetupStep";
import { StrikeTimingStep } from "./wizard/StrikeTimingStep";
import { RiskManagementStep } from "./wizard/RiskManagementStep";
import { ConfirmationStep } from "./wizard/ConfirmationStep";
import { WizardStep, StrategyLeg, WizardFormData } from "@/types/strategy-wizard";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

const INITIAL_LEG: StrategyLeg = {
  id: uuidv4(),
  strategyType: "intraday",
  instrument: "NIFTY",
  segment: "futures",
  underlying: "cash",
  positionType: "sell",
  expiryType: "weekly",
  strikeCriteria: "strike",
  strikeLevel: "ATM",
  optionType: "call",
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
  onSubmit: () => void;
}

export const CustomStrategyWizard = ({ onSubmit }: CustomStrategyWizardProps) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>(WizardStep.TRADE_SETUP);
  const [formData, setFormData] = useState<WizardFormData>({
    legs: [{ ...INITIAL_LEG }],
    currentLegIndex: 0
  });
  const [deploymentMode, setDeploymentMode] = useState<"paper" | "real" | null>(null);
  const [showDeploymentDialog, setShowDeploymentDialog] = useState(false);

  const currentLeg = formData.legs[formData.currentLegIndex];

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

  const handleNext = () => {
    if (currentStep < WizardStep.CONFIRMATION) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowDeploymentDialog(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > WizardStep.TRADE_SETUP) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddLeg = () => {
    const newLeg = {
      ...INITIAL_LEG,
      id: uuidv4()
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
  };

  const handleDeployStrategy = (mode: "paper" | "real") => {
    setDeploymentMode(mode);
    setShowDeploymentDialog(false);
    onSubmit();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case WizardStep.TRADE_SETUP:
        return (
          <TradeSetupStep 
            leg={currentLeg}
            updateLeg={updateCurrentLeg}
          />
        );
      case WizardStep.STRIKE_TIMING:
        return (
          <StrikeTimingStep 
            leg={currentLeg}
            updateLeg={updateCurrentLeg}
          />
        );
      case WizardStep.RISK_MANAGEMENT:
        return (
          <RiskManagementStep 
            leg={currentLeg}
            updateLeg={updateCurrentLeg}
          />
        );
      case WizardStep.CONFIRMATION:
        return (
          <ConfirmationStep 
            formData={formData}
            onSelectLeg={handleSelectLeg}
            onAddLeg={handleAddLeg}
          />
        );
      default:
        return null;
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-between mb-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex flex-col items-center">
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= index 
                ? "bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80 text-white" 
                : "bg-gray-700 text-gray-400"
            }`}
          >
            {index + 1}
          </div>
          <div className="text-xs mt-1 text-gray-400">
            {index === 0 ? "Setup" : 
             index === 1 ? "Strike" : 
             index === 2 ? "Risk" : "Review"}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 bg-gray-800/30 rounded-xl p-4 border border-gray-700">
      <h3 className="text-lg font-medium text-white mb-4">Custom Strategy Configuration</h3>
      
      {renderStepIndicator()}
      
      <div className="min-h-[450px]">
        {renderStepContent()}
      </div>
      
      <div className="flex justify-between pt-4">
        {currentStep > 0 && (
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        )}
        
        {currentStep < WizardStep.CONFIRMATION && (
          <Button 
            onClick={handleNext}
            className="ml-auto bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80 text-white"
          >
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
        
        {currentStep === WizardStep.CONFIRMATION && (
          <Button 
            onClick={handleNext}
            className="ml-auto bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80 text-white"
          >
            Deploy Strategy
          </Button>
        )}
      </div>

      {/* Deployment Mode Dialog */}
      <Dialog open={showDeploymentDialog} onOpenChange={setShowDeploymentDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Select Deployment Mode</DialogTitle>
            <DialogDescription className="text-gray-300 mt-2">
              Would you like to deploy in Paper Trade mode or Real Mode?
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button 
              variant="outline" 
              onClick={() => handleDeployStrategy("paper")}
              className="h-20 flex flex-col items-center justify-center bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              <span className="text-lg mb-1">📝</span>
              <span>Paper Trade</span>
              <span className="text-xs text-gray-400 mt-1">Simulation Only</span>
            </Button>
            <Button 
              onClick={() => handleDeployStrategy("real")}
              className="h-20 flex flex-col items-center justify-center bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80 text-white"
            >
              <span className="text-lg mb-1">💰</span>
              <span>Real Mode</span>
              <span className="text-xs text-gray-200 mt-1">Live Execution</span>
            </Button>
          </div>
          <div className="mt-4 p-4 bg-gray-700/50 rounded-lg text-gray-300 text-sm">
            <p>Real Mode will execute actual trades based on your configured strategy. Please ensure your brokerage account is connected and properly configured.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
