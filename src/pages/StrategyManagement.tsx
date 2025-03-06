
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Play, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { predefinedStrategies } from "@/constants/strategy-data";

const StrategyManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [wishlistedStrategies, setWishlistedStrategies] = useState<typeof predefinedStrategies>([]);

  const handleDeleteStrategy = (id: number) => {
    setWishlistedStrategies(prev => prev.filter(strategy => strategy.id !== id));
    toast({
      title: "Strategy deleted",
      description: "The strategy has been removed from your wishlist",
    });
  };

  const handleDeployStrategy = (strategy: any) => {
    navigate("/live-trading");
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      <Header />
      <main className="pt-16 pb-20 px-4 flex-1">
        <section className="py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold text-white">Strategy Management</h1>
            </div>
          </div>
        </section>

        {/* My Wishlist Section */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">My Wishlist</h2>
          
          <div className="space-y-4">
            {wishlistedStrategies.length === 0 ? (
              <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 flex flex-col items-center justify-center">
                <p className="text-gray-400 mb-4">No strategies in your wishlist</p>
                <Button 
                  onClick={() => navigate('/strategy-selection')}
                  variant="outline"
                  className="border-[#FF00D4]/30 text-white"
                >
                  Browse Strategies
                </Button>
              </div>
            ) : (
              wishlistedStrategies.map((strategy) => (
                <div key={strategy.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 shadow-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-white">{strategy.name}</h3>
                      <p className="text-sm text-gray-400">{strategy.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {strategy.performance && (
                        <>
                          <span className="text-gray-400">Win Rate:</span>
                          <span className="text-green-400">{strategy.performance.winRate}</span>
                        </>
                      )}
                    </div>
                    <div className="flex space-x-3">
                      <button 
                        className="text-pink-500 hover:text-pink-400"
                        onClick={() => handleDeleteStrategy(strategy.id)}
                        title="Remove from wishlist"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-gray-400 hover:text-green-400"
                        onClick={() => handleDeployStrategy(strategy)}
                        title="Deploy strategy"
                      >
                        <Play className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
};

export default StrategyManagement;
