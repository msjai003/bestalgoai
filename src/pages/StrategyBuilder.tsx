import { useState } from "react";
import { Link } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StrategyTypeStep } from "@/components/strategy/StrategyTypeStep";
import { StrategyDetailsStep } from "@/components/strategy/StrategyDetailsStep";
import { STEPS, FormData, StrategyType, StrategyCategory, StepType } from "@/types/strategy";
import { indices, positionTypes, optionTypes, expiryTypes, strikeTypes, highLowTypes, brokers } from "@/constants/strategy";

const StrategyBuilder = () => {
  const [currentStep, setCurrentStep] = useState<StepType>(STEPS.STRATEGY_TYPE);
  const [strategyType, setStrategyType] = useState<StrategyType>("predefined");
  const [selectedCategory, setSelectedCategory] = useState<StrategyCategory | null>(null);
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

  const renderPositionDetails = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-gray-300">Quantity</Label>
        <Input 
          type="number"
          className="bg-gray-800 border-gray-700 text-white"
          value={formData.quantity}
          onChange={(e) => handleInputChange("quantity", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">Position</Label>
        <Select value={formData.position} onValueChange={(value) => handleInputChange("position", value)}>
          <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Select position" />
          </SelectTrigger>
          <SelectContent>
            {positionTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderOptionsDetails = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-gray-300">Option Type</Label>
        <Select value={formData.optionType} onValueChange={(value) => handleInputChange("optionType", value)}>
          <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Select option type" />
          </SelectTrigger>
          <SelectContent>
            {optionTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">Expiry</Label>
        <Select value={formData.expiry} onValueChange={(value) => handleInputChange("expiry", value)}>
          <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Select expiry" />
          </SelectTrigger>
          <SelectContent>
            {expiryTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">Strike Type</Label>
        <Select value={formData.strikeType} onValueChange={(value) => handleInputChange("strikeType", value)}>
          <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Select strike type" />
          </SelectTrigger>
          <SelectContent>
            {strikeTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderParameters = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-gray-300">Target (%)</Label>
        <Input 
          type="number"
          className="bg-gray-800 border-gray-700 text-white"
          value={formData.target}
          onChange={(e) => handleInputChange("target", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">Stoploss (%)</Label>
        <Input 
          type="number"
          className="bg-gray-800 border-gray-700 text-white"
          value={formData.stoploss}
          onChange={(e) => handleInputChange("stoploss", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">Entry After Momentum (%)</Label>
        <Input 
          type="number"
          className="bg-gray-800 border-gray-700 text-white"
          value={formData.entryMomentum}
          onChange={(e) => handleInputChange("entryMomentum", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">Range Breakout (%)</Label>
        <Input 
          type="number"
          className="bg-gray-800 border-gray-700 text-white"
          value={formData.rangeBreakout}
          onChange={(e) => handleInputChange("rangeBreakout", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">High/Low</Label>
        <Select value={formData.highLow} onValueChange={(value) => handleInputChange("highLow", value)}>
          <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Select High/Low" />
          </SelectTrigger>
          <SelectContent>
            {highLowTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderBrokerSelection = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-gray-300">Select Broker</Label>
        <Select value={formData.broker} onValueChange={(value) => handleInputChange("broker", value)}>
          <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Choose your broker" />
          </SelectTrigger>
          <SelectContent>
            {brokers.map(broker => (
              <SelectItem key={broker} value={broker}>{broker}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">API Key</Label>
        <Input 
          type="text"
          className="bg-gray-800 border-gray-700 text-white"
          value={formData.apiKey}
          onChange={(e) => handleInputChange("apiKey", e.target.value)}
          placeholder="Enter your API key"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">Access Token (Optional)</Label>
        <Input 
          type="text"
          className="bg-gray-800 border-gray-700 text-white"
          value={formData.accessToken}
          onChange={(e) => handleInputChange("accessToken", e.target.value)}
          placeholder="Enter your access token"
        />
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.STRATEGY_TYPE:
        return (
          <StrategyTypeStep
            strategyType={strategyType}
            onStrategyTypeChange={setStrategyType}
          />
        );
      case STEPS.STRATEGY_DETAILS:
        return (
          <StrategyDetailsStep
            strategyType={strategyType}
            selectedCategory={selectedCategory}
            formData={formData}
            onCategorySelect={setSelectedCategory}
            onInputChange={handleInputChange}
          />
        );
      case STEPS.POSITION:
        return renderPositionDetails();
      case STEPS.OPTIONS:
        return renderOptionsDetails();
      case STEPS.PARAMETERS:
        return renderParameters();
      case STEPS.BROKER:
        return renderBrokerSelection();
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentStep === STEPS.STRATEGY_TYPE && strategyType === "predefined" && !selectedCategory) {
      return;
    }
    if (currentStep < STEPS.BROKER) {
      setCurrentStep((currentStep + 1) as StepType);
    }
  };

  const handleBack = () => {
    if (currentStep > STEPS.STRATEGY_TYPE) {
      if (currentStep === STEPS.STRATEGY_DETAILS && strategyType === "predefined" && selectedCategory) {
        setSelectedCategory(null);
        return;
      }
      setCurrentStep((currentStep - 1) as StepType);
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
              
              <div className="flex justify-between mt-6">
                {currentStep > STEPS.STRATEGY_TYPE && (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="bg-gray-800 border-gray-700 text-white"
                  >
                    Back
                  </Button>
                )}
                {currentStep < STEPS.BROKER ? (
                  <Button
                    className="bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80 text-white ml-auto"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                ) : (
                  <Link 
                    to="/backtest"
                    className="bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80 text-white py-2 px-4 rounded-lg font-medium ml-auto"
                  >
                    Create Strategy
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
};

export default StrategyBuilder;
