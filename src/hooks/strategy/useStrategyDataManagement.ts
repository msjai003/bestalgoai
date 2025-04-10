
import { useState, useEffect } from "react";
import { Strategy } from "./types";
import { useAuth } from "@/contexts/AuthContext";
import { loadUserStrategies } from "./useStrategyDatabase";
import { useCustomStrategies } from "./useCustomStrategies";

export const useStrategyDataManagement = () => {
  const { user } = useAuth();
  const [selectedMode, setSelectedMode] = useState<"all" | "live" | "paper">("all");
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isActive, setIsActive] = useState(false);
  
  // Get custom strategies
  const { customStrategies } = useCustomStrategies();
  
  useEffect(() => {
    const fetchStrategies = async () => {
      if (!user) return;
      
      try {
        const userStrategies = await loadUserStrategies(user.id);
        setStrategies(prev => {
          // Combine predefined strategies with custom strategies
          const combinedStrategies = [...userStrategies, ...customStrategies];
          
          // Filter by selected mode if needed
          if (selectedMode !== "all") {
            return combinedStrategies.filter(strategy => 
              (selectedMode === "live" && strategy.isLive) || 
              (selectedMode === "paper" && !strategy.isLive)
            );
          }
          
          return combinedStrategies;
        });
      } catch (error) {
        console.error("Error fetching strategies:", error);
      }
    };
    
    fetchStrategies();
  }, [user, selectedMode, customStrategies]);
  
  const handleModeChange = (mode: "all" | "live" | "paper") => {
    setSelectedMode(mode);
  };
  
  const toggleTradingActive = () => {
    setIsActive(!isActive);
  };
  
  return {
    selectedMode,
    strategies,
    isActive,
    handleModeChange,
    toggleTradingActive,
    setStrategies
  };
};
