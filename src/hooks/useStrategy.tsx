
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
    const fetchStrategies = async () => {
      setIsLoading(true);
      
      try {
        let strategiesWithStatus = predefinedStrategies.map(strategy =>({
          ...strategy,
          isWishlisted: false,
          isLive: false,
          quantity: 0,
          selectedBroker: ""
        }));
        
        if (user) {
          const { data: selections, error } = await supabase
            .from('strategy_selections')
            .select('strategy_id, quantity, selected_broker')
            .eq('user_id', user.id);
            
          if (error) {
            console.error("Error fetching wishlisted strategies:", error);
            toast({
              title: "Error fetching wishlist",
              description: "There was a problem loading your wishlisted strategies",
              variant: "destructive"
            });
          } else if (selections) {
            strategiesWithStatus = strategiesWithStatus.map(strategy => ({
              ...strategy,
              isWishlisted: selections.some(item => item.strategy_id === strategy.id),
              quantity: selections.find(item => item.strategy_id === strategy.id)?.quantity || 0,
              selectedBroker: selections.find(item => item.strategy_id === strategy.id)?.selected_broker || ""
            }));
          }
        }
        
        setStrategies(strategiesWithStatus);
      } catch (error) {
        console.error("Error setting up strategies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStrategies();
  }, [user, toast, predefinedStrategies]);

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
      if (!wishlistedStrategies.some(s => s.id === id)) {
        const strategyToAdd = strategies.find(s => s.id === id);
        if (strategyToAdd) {
          wishlistedStrategies.push({...strategyToAdd, isWishlisted: true});
        }
      }
    } else {
      wishlistedStrategies = wishlistedStrategies.filter(s => s.id !== id);
    }
    
    localStorage.setItem('wishlistedStrategies', JSON.stringify(wishlistedStrategies));
    
    if (user) {
      try {
        if (isWishlisted) {
          const { error } = await supabase
            .from('strategy_selections')
            .insert({
              user_id: user.id,
              strategy_id: id,
              strategy_name: strategy?.name || '',
              strategy_description: strategy?.description || ''
            });
            
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('strategy_selections')
            .delete()
            .eq('user_id', user.id)
            .eq('strategy_id', id);
            
          if (error) throw error;
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

        const { error } = await supabase
          .from('strategy_selections')
          .upsert({
            user_id: user.id,
            strategy_id: selectedStrategyId,
            strategy_name: strategy.name,
            strategy_description: strategy.description,
            quantity: pendingQuantity,
            selected_broker: brokerId
          });

        if (error) throw error;
        
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
