
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
import { WizardFormData } from "@/types/strategy-wizard";
import { ArrowLeft, ChevronRight, Rocket } from "lucide-react";

const addStrategyToWishlist = (
  strategyName: string, 
  mode: 'paper' | 'real', 
  formData?: WizardFormData, 
  isCustom: boolean = false
) => {
  const storedStrategies = localStorage.getItem('wishlistedStrategies');
  let wishlistedStrategies = [];
  
  if (storedStrategies) {
    try {
      wishlistedStrategies = JSON.parse(storedStrategies);
    } catch (error) {
      console.error("Error parsing wishlisted strategies:", error);
    }
  }
  
  const newStrategy = {
    id: Math.floor(Math.random() * 1000) + 1,
    name: strategyName,
    description: isCustom 
      ? `Custom ${formData?.legs[0].strategyType || 'intraday'} strategy with ${formData?.legs.length || 1} leg(s)`
      : "Predefined strategy",
    isCustom: isCustom,
    isLive: mode === 'real',
    isWishlisted: true,
    legs: formData?.legs || [],
    performance: {
      winRate: "N/A",
      avgProfit: "N/A",
      drawdown: "N/A"
    }
  };
  
  wishlistedStrategies.push(newStrategy);
  
  localStorage.setItem('wishlistedStrategies', JSON.stringify(wishlistedStrategies));
  
  console.log(`Adding strategy "${strategyName}" to wishlist in ${mode} mode`);
  return newStrategy.id;
};

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

  const handleCustomStrategySubmit = ({ name, formData, mode }: {
    name: string;
    formData: WizardFormData;
    mode: "paper" | "real" | null;
  }) => {
    if (!mode) return;
    
    const strategyId = addStrategyToWishlist(
      name, 
      mode, 
      formData,
      true
    );
    
    toast({
      title: "Strategy Deployed",
      description: `${name} has been successfully deployed and added to your wishlist in ${mode === "paper" ? "Paper Trading" : "Real"} mode.`,
      duration: 5000,
    });
    
    navigate("/strategy-management");
  };

  const renderConfirmationDialog = () => (
    <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
      <DialogContent className="bg-charcoalPrimary text-white max-w-[90%] max-h-[90vh] border border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">Confirm Strategy Setup</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[60vh] pr-4">
          <div className="space-y-4">
            <div className="bg-charcoalSecondary/30 p-3 rounded-lg">
              <h4 className="font-medium text-cyan mb-1">Strategy Type</h4>
              <p>{strategyType === "predefined" ? "Predefined Strategy" : "Custom Strategy"}</p>
            </div>
            {strategyType === "predefined" && selectedCategory && (
              <div className="bg-charcoalSecondary/30 p-3 rounded-lg">
                <h4 className="font-medium text-cyan mb-1">Category</h4>
                <p className="capitalize">{selectedCategory}</p>
              </div>
            )}
            <div className="bg-charcoalSecondary/30 p-3 rounded-lg">
              <h4 className="font-medium text-cyan mb-1">Strategy Name</h4>
              <p>{formData.strategy}</p>
            </div>
            <div className="bg-charcoalSecondary/30 p-3 rounded-lg">
              <h4 className="font-medium text-cyan mb-1">Description</h4>
              <p className="text-sm">{formData.strategyDescription}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-charcoalSecondary/30 p-3 rounded-lg">
                <h4 className="font-medium text-cyan mb-1">Position</h4>
                <p>{formData.position}</p>
              </div>
              <div className="bg-charcoalSecondary/30 p-3 rounded-lg">
                <h4 className="font-medium text-cyan mb-1">Broker</h4>
                <p>{formData.broker}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-charcoalSecondary/30 p-3 rounded-lg">
                <h4 className="font-medium text-cyan mb-1">Target</h4>
                <p>{formData.target}%</p>
              </div>
              <div className="bg-charcoalSecondary/30 p-3 rounded-lg">
                <h4 className="font-medium text-cyan mb-1">Stop Loss</h4>
                <p>{formData.stoploss}%</p>
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConfirmation(false)}
            className="w-full sm:w-auto bg-charcoalSecondary border-gray-600 text-white hover:bg-charcoalSecondary/70"
          >
            Edit
          </Button>
          <Button
            onClick={handleConfirmStrategy}
            size="sm"
            className="w-full sm:w-auto bg-gradient-to-r from-cyan to-cyan/80 text-charcoalPrimary hover:shadow-cyan/30 hover:shadow-lg"
          >
            <Rocket className="mr-2 h-4 w-4" />
            Deploy Strategy
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
                  className="w-full h-14 rounded-xl bg-gradient-to-r from-cyan to-cyan/80 text-charcoalPrimary hover:shadow-cyan/30 hover:shadow-lg font-semibold"
                  onClick={handleCreateStrategy}
                >
                  <Rocket className="mr-2 h-5 w-5" />
                  Deploy Algorithm Strategy
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
    <div className="bg-charcoalPrimary min-h-screen">
      <header className="fixed top-0 left-0 right-0 bg-charcoalPrimary/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Link to="/dashboard" className="p-2">
            <ArrowLeft className="h-5 w-5 text-gray-300" />
          </Link>
          <h1 className="text-white text-lg font-medium">Strategy Builder</h1>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>
      </header>

      <main className="pt-20 pb-20 px-4">
        <div className="bg-charcoalSecondary/50 p-1 rounded-xl mb-6">
          <div className="grid grid-cols-2 gap-1">
            <Link 
              to="/backtest" 
              className="text-gray-400 py-2 px-4 rounded-lg text-sm font-medium text-center transition-colors hover:text-white"
            >
              Backtesting
            </Link>
            <button className="bg-gradient-to-r from-cyan to-cyan/80 text-charcoalPrimary py-2 px-4 rounded-lg text-sm font-medium">
              Strategy Builder
            </button>
          </div>
        </div>

        <section className="space-y-4 mb-6">
          <div className="bg-charcoalSecondary/30 rounded-xl p-5 border border-gray-700/50 shadow-lg">
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
