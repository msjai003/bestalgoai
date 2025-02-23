
import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronDown, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const STEPS = {
  BASIC: 0,
  POSITION: 1,
  OPTIONS: 2,
  PARAMETERS: 3,
  BROKER: 4
};

const strategies = [
  "Moving Average Crossover",
  "RSI Strategy",
  "MACD Strategy",
  "Bollinger Bands",
  "Supertrend"
];

const indices = ["Nifty", "Sensex"];
const strategyTypes = ["Intraday", "BTST", "Positional"];
const positionTypes = ["Buy", "Sell"];
const optionTypes = ["Call", "Put"];
const expiryTypes = ["Weekly", "Next Weekly", "Monthly"];
const brokers = ["Zerodha", "Aliceblue", "Angel One"];

const strikeTypes = [
  "OTM10", "OTM9", "OTM8", "OTM7", "OTM6", "OTM5", "OTM4", "OTM3", "OTM2", "OTM1",
  "ATM",
  "ITM1", "ITM2", "ITM3", "ITM4", "ITM5", "ITM6", "ITM7", "ITM8", "ITM9", "ITM10"
];

const StrategyBuilder = () => {
  const [currentStep, setCurrentStep] = useState(STEPS.BASIC);
  const [formData, setFormData] = useState({
    strategy: "",
    index: "",
    strategyType: "",
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
    highLowRange: [0],
    instrument: "",
    broker: ""
  });

  const handleInputChange = (field: string, value: string | number | number[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderBasicDetails = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-gray-300">Select Strategy</Label>
        <Select value={formData.strategy} onValueChange={(value) => handleInputChange("strategy", value)}>
          <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Choose strategy" />
          </SelectTrigger>
          <SelectContent>
            {strategies.map(strategy => (
              <SelectItem key={strategy} value={strategy}>{strategy}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">Index</Label>
        <Select value={formData.index} onValueChange={(value) => handleInputChange("index", value)}>
          <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Select index" />
          </SelectTrigger>
          <SelectContent>
            {indices.map(index => (
              <SelectItem key={index} value={index}>{index}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">Strategy Type</Label>
        <Select value={formData.strategyType} onValueChange={(value) => handleInputChange("strategyType", value)}>
          <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {strategyTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-300">Entry Time</Label>
          <Input 
            type="time" 
            className="bg-gray-800 border-gray-700 text-white"
            value={formData.entryTime}
            onChange={(e) => handleInputChange("entryTime", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-300">Exit Time</Label>
          <Input 
            type="time"
            className="bg-gray-800 border-gray-700 text-white"
            value={formData.exitTime}
            onChange={(e) => handleInputChange("exitTime", e.target.value)}
          />
        </div>
      </div>
    </div>
  );

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
        <Label className="text-gray-300">High/Low Range</Label>
        <Slider
          defaultValue={[0]}
          max={100}
          step={1}
          value={formData.highLowRange as number[]}
          onValueChange={(value) => handleInputChange("highLowRange", value)}
          className="w-full"
        />
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
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.BASIC:
        return renderBasicDetails();
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
    if (currentStep < STEPS.BROKER) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > STEPS.BASIC) {
      setCurrentStep(currentStep - 1);
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
                {currentStep > STEPS.BASIC && (
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
