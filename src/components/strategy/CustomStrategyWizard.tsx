
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { WizardStep, StrategyLeg, WizardFormData } from "@/types/strategy-wizard";
import { WizardStepIndicator } from "./wizard/WizardStepIndicator";
import { WizardContent } from "./wizard/WizardContent";
import { WizardControls } from "./wizard/WizardControls";
import { StrategyDetailsDialog } from "./wizard/StrategyDetailsDialog";
import { DeploymentDialog } from "./wizard/DeploymentDialog";
import { TradingModeConfirmationDialog } from "./TradingModeConfirmationDialog";
import { QuantityInputDialog } from "./QuantityInputDialog";
import { BrokerSelectionDialog } from "./BrokerSelectionDialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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
  const [userName, setUserName] = useState<string>("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showQuantityDialog, setShowQuantityDialog] = useState(false);
  const [showBrokerDialog, setShowBrokerDialog] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const { toast } = useToast();
  const { user } = useAuth();

  const currentLeg = formData.legs[formData.currentLegIndex];

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();
          
          if (error) throw error;
          
          if (data) {
            setUserName(data.full_name);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    const checkDuplicateNames = async () => {
      if (strategyName.trim() === "" || !user) {
        setIsDuplicateName(false);
        return;
      }

      try {
        const { data: customData, error: customError } = await supabase
          .from('custom_strategies')
          .select('name')
          .eq('user_id', user.id)
          .ilike('name', strategyName.trim());

        if (customError) throw customError;

        const storedStrategies = localStorage.getItem('wishlistedStrategies');
        let localStrategies: any[] = [];
        
        if (storedStrategies) {
          try {
            localStrategies = JSON.parse(storedStrategies);
          } catch (err) {
            console.error("Error parsing local strategies:", err);
          }
        }
        
        const isDuplicate = (customData && customData.length > 0) || 
          localStrategies.some(strategy => strategy.name?.toLowerCase() === strategyName.trim().toLowerCase());
        
        setIsDuplicateName(isDuplicate);
      } catch (error) {
        console.error("Error checking strategy names:", error);
      }
    };

    checkDuplicateNames();
  }, [strategyName, user]);

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
    setShowDeploymentDialog(false);
    
    if (mode === "paper") {
      // Paper trading mode - proceed directly
      saveStrategyAndRedirect(mode);
    } else {
      // Live trading mode - follow the confirmation flow
      setShowConfirmDialog(true);
    }
  };
  
  const handleConfirmLiveMode = () => {
    setShowConfirmDialog(false);
    setShowQuantityDialog(true);
  };
  
  const handleCancelLiveMode = () => {
    setShowConfirmDialog(false);
    setDeploymentMode(null);
  };
  
  const handleQuantitySubmit = (value: number) => {
    setQuantity(value);
    setShowQuantityDialog(false);
    setShowBrokerDialog(true);
  };
  
  const handleCancelQuantity = () => {
    setShowQuantityDialog(false);
    setDeploymentMode(null);
  };
  
  const handleBrokerSubmit = async (brokerId: string, brokerName: string) => {
    setShowBrokerDialog(false);
    
    try {
      if (user) {
        const { data: brokerData, error: brokerError } = await supabase
          .from('broker_credentials')
          .select('username')
          .eq('id', brokerId)
          .single();
          
        if (brokerError) {
          console.error("Error fetching broker username:", brokerError);
          throw brokerError;
        }
        
        const brokerUsername = brokerData?.username || "";
        
        // Save broker info with the strategy
        saveStrategyAndRedirect("real", {
          quantity,
          brokerName,
          brokerUsername
        });
      } else {
        // Guest user - save to local storage
        saveStrategyAndRedirect("real", {
          quantity,
          brokerName: brokerName
        });
      }
    } catch (error) {
      console.error("Error processing broker selection:", error);
      toast({
        title: "Error",
        description: "Failed to save broker information",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  const handleCancelBroker = () => {
    setShowBrokerDialog(false);
    setDeploymentMode(null);
  };
  
  const saveStrategyAndRedirect = async (
    mode: "paper" | "real", 
    additionalInfo?: {
      quantity?: number;
      brokerName?: string;
      brokerUsername?: string;
    }
  ) => {
    if (user) {
      try {
        const legsAsJson = JSON.parse(JSON.stringify(formData.legs));
        
        // Create a strategy configuration object
        const strategyConfig = {
          user_id: user.id,
          name: strategyName,
          description: `Custom ${formData.legs[0].strategyType || 'intraday'} strategy with ${formData.legs.length} leg(s)`,
          legs: legsAsJson,
          is_active: true,
          created_by: userName || user.email,
          quantity: additionalInfo?.quantity,
          selected_broker: additionalInfo?.brokerName,
          broker_username: additionalInfo?.brokerUsername,
          trade_type: mode === "real" ? "live trade" : "paper trade"
        };
        
        const { data, error } = await supabase.from('custom_strategies').insert(strategyConfig).select();
        
        if (error) throw error;
        
        // If we're in live mode, also add to strategy_selections
        if (mode === "real" && additionalInfo?.brokerName && data && data.length > 0) {
          // Generate a numeric ID for the strategy
          // This is needed because 'strategy_id' in 'strategy_selections' must be a number
          const numericStrategyId = Math.floor(Math.random() * 1000000) + 1;
          
          const { error: selectionError } = await supabase.from('strategy_selections').insert({
            user_id: user.id,
            strategy_id: numericStrategyId, // Using a numeric ID instead of UUID
            strategy_name: strategyName,
            strategy_description: strategyConfig.description,
            quantity: additionalInfo.quantity || 1,
            selected_broker: additionalInfo.brokerName,
            broker_username: additionalInfo.brokerUsername || "",
            trade_type: "live trade",
            is_wishlisted: false,
            paid_status: "free"
          });
          
          if (selectionError) {
            console.error("Error adding to strategy selections:", selectionError);
          }
        }
        
        toast({
          title: "Strategy Created",
          description: `${strategyName} has been saved and deployed in ${mode === 'paper' ? 'Paper Trading' : 'Real'} mode.`,
          duration: 5000,
        });
      } catch (error: any) {
        console.error('Error saving custom strategy:', error);
        toast({
          title: "Error Saving Strategy",
          description: error.message || "There was a problem saving your strategy.",
          variant: "destructive",
          duration: 5000,
        });
      }
    } else {
      // Save to local storage for guest users
      const storedWishlist = localStorage.getItem('wishlistedStrategies');
      let wishlistedStrategies: any[] = [];
      
      if (storedWishlist) {
        try {
          wishlistedStrategies = JSON.parse(storedWishlist);
        } catch (error) {
          console.error("Error parsing wishlisted strategies:", error);
        }
      }
      
      const newStrategy = {
        id: Math.floor(Math.random() * 1000) + 1,
        name: strategyName,
        description: `Custom ${formData.legs[0].strategyType || 'intraday'} strategy with ${formData.legs.length} leg(s)`,
        isCustom: true,
        isLive: mode === 'real',
        isWishlisted: true,
        legs: formData.legs,
        createdBy: "Guest User",
        quantity: additionalInfo?.quantity || 1,
        selectedBroker: additionalInfo?.brokerName || "",
        performance: {
          winRate: "N/A",
          avgProfit: "N/A",
          drawdown: "N/A"
        }
      };
      
      wishlistedStrategies.push(newStrategy);
      localStorage.setItem('wishlistedStrategies', JSON.stringify(wishlistedStrategies));
      
      toast({
        title: "Strategy Deployed Locally",
        description: `${strategyName} has been added to your wishlist in ${mode === "paper" ? "Paper Trading" : "Real"} mode. Sign in to save permanently.`,
        duration: 5000,
      });
    }
    
    onSubmit({
      name: strategyName,
      formData: formData,
      mode: mode
    });
  };

  return (
    <div className="space-y-6 bg-gray-800/30 rounded-xl p-4 border border-cyan/20">
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
      
      <TradingModeConfirmationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        targetMode="live"
        onConfirm={handleConfirmLiveMode}
        onCancel={handleCancelLiveMode}
      />
      
      <QuantityInputDialog
        open={showQuantityDialog}
        onOpenChange={setShowQuantityDialog}
        onConfirm={handleQuantitySubmit}
        onCancel={handleCancelQuantity}
      />
      
      <BrokerSelectionDialog
        open={showBrokerDialog}
        onOpenChange={setShowBrokerDialog}
        onConfirm={handleBrokerSubmit}
        onCancel={handleCancelBroker}
      />
    </div>
  );
};
