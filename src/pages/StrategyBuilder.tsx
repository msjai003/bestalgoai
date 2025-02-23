import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronDown, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const STEPS = {
  STRATEGY_TYPE: 0,
  STRATEGY_DETAILS: 1,
  POSITION: 2,
  OPTIONS: 3,
  PARAMETERS: 4,
  BROKER: 5
};

const strategies = {
  intraday: [
    "Short Straddle",
    "Combined Short Straddle",
    "Straddle Spread",
    "Supertrend"
  ],
  btst: [
    "Overnight Momentum",
    "Gap Up Strategy",
    "Trend Following BTST"
  ],
  positional: [
    "Swing Trading",
    "Position Trading",
    "Trend Following"
  ]
};

const indices = ["Nifty", "Sensex"];
const positionTypes = ["Buy", "Sell"];
const optionTypes = ["Call", "Put"];
const expiryTypes = ["Weekly", "Next Weekly", "Monthly"];
const brokers = ["Zerodha", "Aliceblue", "Angel One"];
const highLowTypes = ["High", "Low"];

const strikeTypes = [
  "OTM10", "OTM9", "OTM8", "OTM7", "OTM6", "OTM5", "OTM4", "OTM3", "OTM2", "OTM1",
  "ATM",
  "ITM1", "ITM2", "ITM3", "ITM4", "ITM5", "ITM6", "ITM7", "ITM8", "ITM9", "ITM10"
];

const strategyDescriptions = {
  "Short Straddle": "A neutral options strategy that involves simultaneously selling a put and a call of the same strike price and expiration date.",
  "Combined Short Straddle": "An advanced version of short straddle with additional hedging positions.",
  "Straddle Spread": "Involves buying and selling straddles at different strike prices.",
  "Supertrend": "A trend-following indicator that shows buy and sell signals based on volatility and momentum."
};

const StrategyBuilder = () => {
  const [currentStep, setCurrentStep] = useState(STEPS.STRATEGY_TYPE);
  const [strategyType, setStrategyType] = useState<"predefined" | "custom">("predefined");
  const [selectedCategory, setSelectedCategory] = useState<"intraday" | "btst" | "positional" | null>(null);
  const [formData, setFormData] = useState({
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

  const renderStrategyTypeSelection = () => (
    <div className="space-y-6">
      <h3 className="text-white font-medium">Choose Strategy Type</h3>
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant={strategyType === "predefined" ? "default" : "outline"}
          className={`h-24 ${strategyType === "predefined" ? "bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80" : "bg-gray-800 border-gray-700"}`}
          onClick={() => setStrategyType("predefined")}
        >
          Predefined Strategies
        </Button>
        <Button
          variant={strategyType === "custom" ? "default" : "outline"}
          className={`h-24 ${strategyType === "custom" ? "bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80" : "bg-gray-800 border-gray-700"}`}
          onClick={() => setStrategyType("custom")}
        >
          Custom Strategy
        </Button>
      </div>
    </div>
  );

  const renderStrategyDetails = () => {
    if (strategyType === "predefined") {
      if (!selectedCategory) {
        return (
          <div className="space-y-6">
            <h3 className="text-white font-medium">Select Strategy Category</h3>
            <div className="grid grid-cols-1 gap-4">
              <Button
                variant="outline"
                className="h-16 bg-gray-800 border-gray-700 text-white"
                onClick={() => setSelectedCategory("intraday")}
              >
                Intraday
              </Button>
              <Button
                variant="outline"
                className="h-16 bg-gray-800 border-gray-700 text-white"
                onClick={() => setSelectedCategory("btst")}
              >
                BTST
              </Button>
              <Button
                variant="outline"
                className="h-16 bg-gray-800 border-gray-700 text-white"
                onClick={() => setSelectedCategory("positional")}
              >
                Positional
              </Button>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Select Strategy</Label>
            <Select 
              value={formData.strategy} 
              onValueChange={(value) => {
                handleInputChange("strategy", value);
                handleInputChange("strategyDescription", strategyDescriptions[value as keyof typeof strategyDescriptions] || "");
              }}
            >
              <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Choose strategy" />
              </SelectTrigger>
              <SelectContent>
                {strategies[selectedCategory].map(strategy => (
                  <SelectItem key={strategy} value={strategy}>{strategy}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.strategyDescription && (
            <div className="space-y-2">
              <Label className="text-gray-300">Strategy Details</Label>
              <Textarea
                value={formData.strategyDescription}
                readOnly
                className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
              />
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-gray-300">Strategy Name</Label>
          <Input
            value={formData.strategy}
            onChange={(e) => handleInputChange("strategy", e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Enter strategy name"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-300">Strategy Description</Label>
          <Textarea
            value={formData.strategyDescription}
            onChange={(e) => handleInputChange("strategyDescription", e.target.value)}
            className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
            placeholder="Describe your strategy..."
          />
        </div>
      </div>
    );
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
        return renderStrategyTypeSelection();
      case STEPS.STRATEGY_DETAILS:
        return renderStrategyDetails();
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
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > STEPS.STRATEGY_TYPE) {
      if (currentStep === STEPS.STRATEGY_DETAILS && strategyType === "predefined" && selectedCategory) {
        setSelectedCategory(null);
        return;
      }
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
