
import React from 'react';
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from '@/components/Header';
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { TradingModeFilter } from "@/components/strategy/TradingModeFilter";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { TradingModeConfirmationDialog } from "@/components/strategy/TradingModeConfirmationDialog";
import { QuantityInputDialog } from "@/components/strategy/QuantityInputDialog";
import { AlertCircle, BarChart2, ChevronRight, Info, Settings, ToggleLeft, ToggleRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StrategyCard } from "@/components/strategy/LiveTradingStrategyCard";

type TradingModeOption = "all" | "live" | "paper";

const LiveTrading = () => {
  const [timeFrame, setTimeFrame] = useState("1D");
  const [isActive, setIsActive] = useState(false);
  const [selectedMode, setSelectedMode] = useState<TradingModeOption>("all");
  const [strategies, setStrategies] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showQuantityDialog, setShowQuantityDialog] = useState(false);
  const [targetStrategyId, setTargetStrategyId] = useState<number | null>(null);
  const [targetMode, setTargetMode] = useState<"live" | "paper" | null>(null);

  useEffect(() => {
    const storedStrategies = localStorage.getItem('wishlistedStrategies');
    if (storedStrategies) {
      try {
        const parsedStrategies = JSON.parse(storedStrategies);
        setStrategies(parsedStrategies);
      } catch (error) {
        console.error("Error parsing wishlisted strategies:", error);
        setStrategies([]);
      }
    }
  }, []);

  const handleTradingToggle = () => {
    setIsActive(!isActive);
    
    toast({
      title: !isActive ? "Trading started" : "Trading stopped",
      description: !isActive ? "Your strategies are now actively trading" : "Your strategies are now paused",
    });
  };

  const handleModeChange = (mode: TradingModeOption) => {
    setSelectedMode(mode);
  };

  const handleToggleLiveMode = (id: number) => {
    const strategy = strategies.find(s => s.id === id);
    if (strategy) {
      setTargetStrategyId(id);
      setTargetMode(strategy.isLive ? 'paper' : 'live');
      setShowConfirmationDialog(true);
    }
  };

  const handleOpenQuantityDialog = (id: number) => {
    setTargetStrategyId(id);
    setShowQuantityDialog(true);
  };

  const confirmModeChange = () => {
    if (targetStrategyId === null || targetMode === null) return;
    
    const updatedStrategies = strategies.map(strategy => {
      if (strategy.id === targetStrategyId) {
        const newLiveStatus = targetMode === 'live';
        return { ...strategy, isLive: newLiveStatus };
      }
      return strategy;
    });
    
    setStrategies(updatedStrategies);
    localStorage.setItem('wishlistedStrategies', JSON.stringify(updatedStrategies));
    
    const strategy = strategies.find(s => s.id === targetStrategyId);
    if (strategy) {
      toast({
        title: targetMode === 'live' ? "Switched to live trading" : "Switched to paper trading",
        description: `Strategy "${strategy.name}" is now in ${targetMode} trading mode`,
      });
    }
    
    // If switching to live mode, open quantity dialog
    if (targetMode === 'live') {
      setShowQuantityDialog(true);
    } else {
      setShowConfirmationDialog(false);
      setTargetStrategyId(null);
      setTargetMode(null);
    }
  };

  const cancelModeChange = () => {
    setShowConfirmationDialog(false);
    setTargetStrategyId(null);
    setTargetMode(null);
  };

  const handleQuantitySubmit = (quantity: number) => {
    if (targetStrategyId === null) return;
    
    const updatedStrategies = strategies.map(strategy => {
      if (strategy.id === targetStrategyId) {
        return { ...strategy, quantity };
      }
      return strategy;
    });
    
    setStrategies(updatedStrategies);
    localStorage.setItem('wishlistedStrategies', JSON.stringify(updatedStrategies));
    
    toast({
      title: "Quantity updated",
      description: `Trading quantity set to ${quantity}`,
    });
    
    setShowQuantityDialog(false);
    setShowConfirmationDialog(false);
    setTargetStrategyId(null);
    setTargetMode(null);
  };

  const handleCancelQuantity = () => {
    setShowQuantityDialog(false);
    setTargetStrategyId(null);
    // If we were switching to live mode but canceled quantity, revert back to paper
    if (targetMode === 'live') {
      const updatedStrategies = strategies.map(strategy => {
        if (strategy.id === targetStrategyId) {
          return { ...strategy, isLive: false };
        }
        return strategy;
      });
      setStrategies(updatedStrategies);
      localStorage.setItem('wishlistedStrategies', JSON.stringify(updatedStrategies));
    }
    setTargetMode(null);
  };

  const filteredStrategies = selectedMode === "all" 
    ? strategies 
    : strategies.filter(strategy => 
        (selectedMode === "live" && strategy.isLive) || 
        (selectedMode === "paper" && !strategy.isLive)
      );

  return (
    <div className="bg-gray-900 min-h-screen">
      <Header />
      <main className="pt-16 pb-20 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-white">Live Trading</h1>
          <Button 
            variant="outline" 
            size="sm"
            className="border-gray-700 text-gray-400 hover:text-white"
            onClick={() => navigate('/strategy-selection')}
          >
            Add Strategy
          </Button>
        </div>

        <div className="mb-6">
          <TradingModeFilter 
            selectedMode={selectedMode}
            onModeChange={handleModeChange}
          />
        </div>

        <section className="space-y-4 mb-6">
          {filteredStrategies.length > 0 ? (
            filteredStrategies.map(strategy => (
              <StrategyCard 
                key={strategy.id}
                strategy={strategy}
                onToggleLiveMode={() => handleToggleLiveMode(strategy.id)}
                onEditQuantity={() => handleOpenQuantityDialog(strategy.id)}
                onViewDetails={() => navigate(`/strategy-details/${strategy.id}`)}
              />
            ))
          ) : (
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 shadow-lg text-center">
              <p className="text-gray-400 mb-4">No strategies found in your wishlist.</p>
              <Button
                onClick={() => navigate('/strategy-selection')}
                className="bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white"
              >
                Add Strategies
              </Button>
            </div>
          )}
        </section>

        {filteredStrategies.length > 0 && (
          <section className="space-y-4">
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 shadow-lg">
              <div className="space-y-3">
                {!isActive ? (
                  <Button 
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-6 rounded-lg font-medium shadow-lg hover:opacity-90 transition-opacity"
                    onClick={handleTradingToggle}
                  >
                    Start Trading All
                  </Button>
                ) : (
                  <Button 
                    variant="destructive"
                    className="w-full py-6 rounded-lg font-medium"
                    onClick={handleTradingToggle}
                  >
                    Square Off All Positions
                  </Button>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
      <BottomNav />
      
      <TradingModeConfirmationDialog
        open={showConfirmationDialog}
        onOpenChange={setShowConfirmationDialog}
        targetMode={targetMode}
        onConfirm={confirmModeChange}
        onCancel={cancelModeChange}
      />
      
      <QuantityInputDialog
        open={showQuantityDialog}
        onOpenChange={setShowQuantityDialog}
        onConfirm={handleQuantitySubmit}
        onCancel={handleCancelQuantity}
      />
    </div>
  );
};

export default LiveTrading;
