
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { StrategySection } from "@/components/strategy/StrategySection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useStrategy } from "@/hooks/useStrategy";
import { usePredefinedStrategies } from "@/hooks/strategy/usePredefinedStrategies";
import { ChartBar, Briefcase, CheckCircle, Plus } from "lucide-react";

const StrategyManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("live");
  const { data: predefinedStrategies } = usePredefinedStrategies();
  
  const {
    strategies,
    isLoading,
    handleDeleteStrategy,
    handleToggleLiveMode
  } = useStrategy(predefinedStrategies || []);
  
  // Filter strategies based on their status
  const liveStrategies = strategies.filter(s => s.isLive === true);
  const paperStrategies = strategies.filter(s => s.isLive === false && s.status !== 'completed');
  const completedStrategies = strategies.filter(s => s.status === 'completed');

  return (
    <div className="bg-charcoalPrimary min-h-screen">
      <Header />
      <main className="pt-16 pb-20 px-4">
        <div className="flex items-center justify-between my-4">
          <h1 className="text-xl font-bold text-white">Strategy Management</h1>
          <Button 
            onClick={() => navigate('/strategy-selection')}
            variant="outline" 
            size="sm"
            className="bg-charcoalSecondary hover:bg-charcoalSecondary/90 border border-gray-700/50 text-cyan hover:text-cyan/90"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Strategy
          </Button>
        </div>
        
        <Tabs defaultValue="live" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-charcoalSecondary border border-gray-800/40">
            <TabsTrigger 
              value="live" 
              className="flex gap-2 items-center data-[state=active]:bg-cyan data-[state=active]:text-charcoalPrimary"
            >
              <ChartBar className="h-4 w-4" />
              <span>Live ({liveStrategies.length})</span>
            </TabsTrigger>
            <TabsTrigger 
              value="paper" 
              className="flex gap-2 items-center data-[state=active]:bg-cyan data-[state=active]:text-charcoalPrimary"
            >
              <Briefcase className="h-4 w-4" />
              <span>Paper ({paperStrategies.length})</span>
            </TabsTrigger>
            <TabsTrigger 
              value="completed" 
              className="flex gap-2 items-center data-[state=active]:bg-cyan data-[state=active]:text-charcoalPrimary"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Completed ({completedStrategies.length})</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="live">
            <StrategySection
              title="Live Trading Strategies"
              icon={<ChartBar className="h-5 w-5 text-cyan" />}
              strategies={liveStrategies}
              emptyMessage="You don't have any live trading strategies yet."
              actionButtonText="Add Strategy"
              actionButtonPath="/strategy-selection"
              onDeleteStrategy={handleDeleteStrategy}
              onToggleLiveMode={handleToggleLiveMode}
            />
          </TabsContent>
          
          <TabsContent value="paper">
            <StrategySection
              title="Paper Trading Strategies"
              icon={<Briefcase className="h-5 w-5 text-cyan" />}
              strategies={paperStrategies}
              emptyMessage="You don't have any paper trading strategies yet."
              actionButtonText="Add Strategy"
              actionButtonPath="/strategy-selection"
              onDeleteStrategy={handleDeleteStrategy}
              onToggleLiveMode={handleToggleLiveMode}
            />
          </TabsContent>
          
          <TabsContent value="completed">
            <StrategySection
              title="Completed Strategies"
              icon={<CheckCircle className="h-5 w-5 text-cyan" />}
              strategies={completedStrategies}
              emptyMessage="You don't have any completed strategies yet."
              actionButtonText=""
              actionButtonPath=""
              onDeleteStrategy={handleDeleteStrategy}
              onToggleLiveMode={handleToggleLiveMode}
              showEmptyStateButton={false}
            />
          </TabsContent>
        </Tabs>
      </main>
      <BottomNav />
    </div>
  );
};

export default StrategyManagement;
