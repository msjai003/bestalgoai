
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export interface Strategy {
  id: number;
  name: string;
  description: string;
  performance: {
    winRate: string;
    avgProfit: string;
    drawdown: string;
  };
  isWishlisted: boolean;
  isLive: boolean;
  quantity: number;
  selectedBroker?: string;
}

// Helper function to fetch strategies from database
const fetchUserStrategySelections = async (userId: string | undefined) => {
  if (!userId) return [];
  
  const { data: selections, error } = await supabase
    .from('strategy_selections')
    .select('strategy_id, quantity, selected_broker')
    .eq('user_id', userId);
    
  if (error) {
    console.error("Error fetching strategy selections:", error);
    throw error;
  }
  
  return selections || [];
};

// Helper function to map predefined strategies with user selections
const mapStrategiesWithSelections = (
  predefinedStrategies: any[],
  selections: any[]
) => {
  return predefinedStrategies.map(strategy => ({
    ...strategy,
    isWishlisted: selections.some(item => item.strategy_id === strategy.id),
    isLive: false,
    quantity: selections.find(item => item.strategy_id === strategy.id)?.quantity || 0,
    selectedBroker: selections.find(item => item.strategy_id === strategy.id)?.selected_broker || ""
  }));
};

// Helper function to add strategy to wishlist
const addToWishlist = async (
  userId: string,
  strategyId: number,
  strategyName: string,
  strategyDescription: string
) => {
  const { error } = await supabase
    .from('strategy_selections')
    .insert({
      user_id: userId,
      strategy_id: strategyId,
      strategy_name: strategyName,
      strategy_description: strategyDescription
    });
    
  if (error) throw error;
};

// Helper function to remove strategy from wishlist
const removeFromWishlist = async (userId: string, strategyId: number) => {
  const { error } = await supabase
    .from('strategy_selections')
    .delete()
    .eq('user_id', userId)
    .eq('strategy_id', strategyId);
    
  if (error) throw error;
};

// Helper function to update local storage wishlist
const updateLocalStorageWishlist = (
  strategyId: number,
  isWishlisted: boolean,
  strategies: Strategy[]
) => {
  const storedWishlist = localStorage.getItem('wishlistedStrategies');
  let wishlistedStrategies: any[] = [];
  
  if (storedWishlist) {
    try {
      wishlistedStrategies = JSON.parse(storedWishlist);
    } catch (error) {
      console.error("Error parsing wishlisted strategies:", error);
    }
  }
  
  if (isWishlisted) {
    if (!wishlistedStrategies.some(s => s.id === strategyId)) {
      const strategyToAdd = strategies.find(s => s.id === strategyId);
      if (strategyToAdd) {
        wishlistedStrategies.push({...strategyToAdd, isWishlisted: true});
      }
    }
  } else {
    wishlistedStrategies = wishlistedStrategies.filter(s => s.id !== strategyId);
  }
  
  localStorage.setItem('wishlistedStrategies', JSON.stringify(wishlistedStrategies));
};

// Helper function to save strategy configuration to database
const saveStrategyConfiguration = async (
  userId: string,
  strategyId: number,
  strategyName: string,
  strategyDescription: string,
  quantity: number,
  brokerId: string
) => {
  const { error } = await supabase
    .from('strategy_selections')
    .upsert({
      user_id: userId,
      strategy_id: strategyId,
      strategy_name: strategyName,
      strategy_description: strategyDescription,
      quantity: quantity,
      selected_broker: brokerId
    });

  if (error) throw error;
};

export const useStrategy = (predefinedStrategies: any[]) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [quantityDialogOpen, setQuantityDialogOpen] = useState(false);
  const [brokerDialogOpen, setBrokerDialogOpen] = useState(false);
  const [targetMode, setTargetMode] = useState<"live" | "paper" | null>(null);
  const [selectedStrategyId, setSelectedStrategyId] = useState<number | null>(null);
  const [pendingQuantity, setPendingQuantity] = useState<number>(0);

  // Load strategies from database
  useEffect(() => {
    const loadStrategies = async () => {
      setIsLoading(true);
      
      try {
        let strategiesWithStatus = predefinedStrategies.map(strategy => ({
          ...strategy,
          isWishlisted: false,
          isLive: false,
          quantity: 0,
          selectedBroker: ""
        }));
        
        if (user) {
          const selections = await fetchUserStrategySelections(user.id);
          strategiesWithStatus = mapStrategiesWithSelections(predefinedStrategies, selections);
        }
        
        setStrategies(strategiesWithStatus);
      } catch (error) {
        console.error("Error setting up strategies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStrategies();
  }, [user, predefinedStrategies]);

  const handleToggleWishlist = async (id: number, isWishlisted: boolean) => {
    setStrategies(prev => 
      prev.map(strategy => 
        strategy.id === id 
          ? { ...strategy, isWishlisted } 
          : strategy
      )
    );
    
    const strategy = strategies.find(s => s.id === id);
    
    toast({
      title: isWishlisted ? "Added to wishlist" : "Removed from wishlist",
      description: `Strategy has been ${isWishlisted ? 'added to' : 'removed from'} your wishlist`
    });
    
    updateLocalStorageWishlist(id, isWishlisted, strategies);
    
    if (user) {
      try {
        if (isWishlisted && strategy) {
          await addToWishlist(user.id, id, strategy.name, strategy.description);
        } else {
          await removeFromWishlist(user.id, id);
        }
      } catch (error) {
        console.error('Error updating wishlist in Supabase:', error);
        toast({
          title: "Error",
          description: "Failed to update wishlist in database",
          variant: "destructive"
        });
      }
    } else if (isWishlisted) {
      toast({
        title: "Login Required",
        description: "Please login to save strategies to your wishlist permanently",
      });
    }
  };

  const updateLiveMode = (id: number, isLive: boolean) => {
    setStrategies(prev => 
      prev.map(strategy => {
        if (strategy.id === id) {
          return { ...strategy, isLive };
        }
        return strategy;
      })
    );
    
    toast({
      title: isLive ? "Strategy set to live mode" : "Strategy set to paper mode",
      description: `Strategy is now in ${isLive ? 'live' : 'paper'} trading mode`,
    });
  };

  const handleToggleLiveMode = (id: number) => {
    const strategy = strategies.find(s => s.id === id);
    const newStatus = !strategy?.isLive;
    
    if (newStatus) {
      setSelectedStrategyId(id);
      setTargetMode("live");
      setConfirmDialogOpen(true);
    } else {
      updateLiveMode(id, false);
    }
  };

  const handleConfirmLiveMode = () => {
    setConfirmDialogOpen(false);
    if (selectedStrategyId !== null) {
      updateLiveMode(selectedStrategyId, true);
      setQuantityDialogOpen(true);
    }
  };

  const handleCancelLiveMode = () => {
    setConfirmDialogOpen(false);
    setSelectedStrategyId(null);
  };

  const handleQuantitySubmit = (quantity: number) => {
    setQuantityDialogOpen(false);
    
    if (selectedStrategyId !== null) {
      // Store the quantity but don't save to database yet
      setPendingQuantity(quantity);
      // Open broker selection dialog
      setBrokerDialogOpen(true);
    }
  };

  const handleCancelQuantity = () => {
    setQuantityDialogOpen(false);
    setSelectedStrategyId(null);
  };

  const handleBrokerSubmit = async (brokerId: string) => {
    setBrokerDialogOpen(false);
    
    if (selectedStrategyId !== null && user) {
      try {
        const strategy = strategies.find(s => s.id === selectedStrategyId);
        
        if (!strategy) {
          throw new Error("Strategy not found");
        }

        await saveStrategyConfiguration(
          user.id,
          selectedStrategyId,
          strategy.name,
          strategy.description,
          pendingQuantity,
          brokerId
        );
        
        setStrategies(prev => 
          prev.map(s => 
            s.id === selectedStrategyId 
              ? { ...s, quantity: pendingQuantity, selectedBroker: brokerId } 
              : s
          )
        );

        toast({
          title: "Strategy Configured",
          description: `Strategy is now set up for live trading`,
        });
        
        navigate("/live-trading");
      } catch (error) {
        console.error('Error saving strategy configuration:', error);
        toast({
          title: "Error",
          description: "Failed to save strategy configuration",
          variant: "destructive"
        });
      }
    }
  };

  const handleCancelBroker = () => {
    setBrokerDialogOpen(false);
    setSelectedStrategyId(null);
    setPendingQuantity(0);
    // If we were switching to live mode but canceled broker selection, revert back to paper
    if (selectedStrategyId !== null) {
      updateLiveMode(selectedStrategyId, false);
    }
  };

  return {
    strategies,
    isLoading,
    confirmDialogOpen,
    setConfirmDialogOpen,
    quantityDialogOpen,
    setQuantityDialogOpen,
    brokerDialogOpen,
    setBrokerDialogOpen,
    targetMode,
    selectedStrategyId,
    handleToggleWishlist,
    handleToggleLiveMode,
    handleConfirmLiveMode,
    handleCancelLiveMode,
    handleQuantitySubmit,
    handleCancelQuantity,
    handleBrokerSubmit,
    handleCancelBroker
  };
};
