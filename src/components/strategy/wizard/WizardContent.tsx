
import { WizardStep, StrategyLeg, WizardFormData } from "@/types/strategy-wizard";
import { TradeSetupStep } from "./TradeSetupStep";
import { StrikeTimingStep } from "./StrikeTimingStep";
import { RiskManagementStep } from "./RiskManagementStep";
import { ConfirmationStep } from "./ConfirmationStep";

interface WizardContentProps {
  currentStep: WizardStep;
  currentLeg: StrategyLeg;
  updateCurrentLeg: (updates: Partial<StrategyLeg>) => void;
  formData: WizardFormData;
  handleSelectLeg: (index: number) => void;
  handleAddLeg: () => void;
  strategyName: string;
  setStrategyName: (name: string) => void;
  updateLegByIndex: (index: number, updates: Partial<StrategyLeg>) => void;
  isDuplicateName?: boolean;
}

export const WizardContent = ({
  currentStep,
  currentLeg,
  updateCurrentLeg,
  formData,
  handleSelectLeg,
  handleAddLeg,
  strategyName,
  setStrategyName,
  updateLegByIndex,
  isDuplicateName = false
}: WizardContentProps) => {
  
  switch (currentStep) {
    case WizardStep.TRADE_SETUP:
      return (
        <TradeSetupStep 
          leg={currentLeg}
          updateLeg={updateCurrentLeg}
          strategyName={strategyName}
          setStrategyName={setStrategyName}
          isFirstLeg={formData.legs.length === 1 && formData.currentLegIndex === 0}
          isDuplicateName={isDuplicateName}
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
          strategyName={strategyName}
          updateLegByIndex={updateLegByIndex}
        />
      );
    default:
      return null;
  }
};
