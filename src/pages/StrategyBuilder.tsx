
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { StrategyTypeStep } from "@/components/strategy/StrategyTypeStep";
import { StrategyDetailsStep } from "@/components/strategy/StrategyDetailsStep";
import { CustomStrategyWizard } from "@/components/strategy/CustomStrategyWizard";
import { STEPS, FormData, StrategyType, StrategyCategory, StepType } from "@/types/strategy";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

const StrategyBuilder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<StepType>(STEPS.STRATEGY_TYPE);
  const [strategyType, setStrategyType] = useState<StrategyType>("predefined");
  const [selectedCategory, setSelectedCategory] = useState<StrategyCategory | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    strategy: "",
    strategyDescription: "",
    index: "",
    entryTime: "",
    exitTime: "",
    quantity: "",
    position: "",
    optionType: "",
    expiry: "",
    strikeType: "",
    target: "",
    stoploss: "",
    entryMomentum: "",
    rangeBreakout: "",
    highLow: "",
    instrument: "",
    broker: "",
    apiKey: "",
    accessToken: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStrategyTypeChange = (type: StrategyType) => {
    setStrategyType(type);
    setCurrentStep(STEPS.STRATEGY_DETAILS);
  };

  const handleCreateStrategy = () => {
    setShowConfirmation(true);
  };

  const handleConfirmStrategy = () => {
    setShowConfirmation(false);
    navigate("/backtest");
  };

  const handleCustomStrategySubmit = () => {
    toast({
      title: "Strategy Deployed",
      description: "Your custom strategy has been successfully deployed.",
      duration: 5000,
    });
    navigate("/backtest");
  };

  const renderConfirmationDialog = () => (
    <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
      <DialogContent className="bg-gray-800 text-white max-w-[90%] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Confirm Strategy Setup</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[60vh] pr-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-300">Strategy Type</h4>
              <p>{strategyType === "predefined" ? "Predefined Strategy" : "Custom Strategy"}</p>
            </div>
            {strategyType === "predefined" && selectedCategory && (
              <div>
                <h4 className="font-medium text-gray-300">Category</h4>
                <p className="capitalize">{selectedCategory}</p>
              </div>
            )}
            <div>
              <h4 className="font-medium text-gray-300">Strategy Name</h4>
              <p>{formData.strategy}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-300">Description</h4>
              <p className="text-sm">{formData.strategyDescription}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-300">Position</h4>
                <p>{formData.position}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-300">Quantity</h4>
                <p>{formData.quantity}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-300">Target</h4>
                <p>{formData.target}%</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-300">Stop Loss</h4>
                <p>{formData.stoploss}%</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-300">Broker</h4>
              <p>{formData.broker}</p>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => setShowConfirmation(false)}
            className="bg-gray-700 border-gray-600 text-white"
          >
            Edit
          </Button>
          <Button
            onClick={handleConfirmStrategy}
            className="bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80 text-white"
          >
            Confirm & Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const renderStepContent = () => {
    if (strategyType === "custom") {
      return <CustomStrategyWizard onSubmit={handleCustomStrategySubmit} />;
    }
    
    switch (currentStep) {
      case STEPS.STRATEGY_TYPE:
        return (
          <StrategyTypeStep
            strategyType={strategyType}
            onStrategyTypeChange={handleStrategyTypeChange}
          />
        );
      case STEPS.STRATEGY_DETAILS:
        return (
          <>
            <StrategyDetailsStep
              strategyType={strategyType}
              selectedCategory={selectedCategory}
              formData={formData}
              onCategorySelect={setSelectedCategory}
              onInputChange={handleInputChange}
            />
            {strategyType === "predefined" && formData.strategy && (
              <div className="mt-6">
                <Button 
                  className="w-full h-14 bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80 text-white"
                  onClick={handleCreateStrategy}
                >
                  Execute Algorithm Strategy
                </Button>
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Link to="/dashboard" className="p-2">
            <i className="fa-solid fa-arrow-left text-gray-300"></i>
          </Link>
          <h1 className="text-white text-lg font-medium">Strategy Builder</h1>
          <button className="p-2">
            <i className="fa-solid fa-gear text-gray-300"></i>
          </button>
        </div>
      </header>

      <main className="pt-16 pb-20 px-4">
        <div className="bg-gray-800/50 p-1 rounded-xl mt-4 mb-6">
          <div className="grid grid-cols-2 gap-1">
            <Link to="/backtest" className="text-gray-400 py-2 px-4 rounded-lg text-sm font-medium text-center">
              Backtesting
            </Link>
            <button className="bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80 text-white py-2 px-4 rounded-lg text-sm font-medium">
              Strategy Builder
            </button>
          </div>
        </div>

        <section className="space-y-4 mb-6">
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 shadow-lg">
            <div className="space-y-6">
              {renderStepContent()}
            </div>
          </div>
        </section>
      </main>
      {renderConfirmationDialog()}
      <BottomNav />
    </div>
  );
};

export default StrategyBuilder;
