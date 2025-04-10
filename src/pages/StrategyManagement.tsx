
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useStrategyWishlist } from "@/hooks/strategy/useStrategyWishlist";
import { Button } from "@/components/ui/button";
import { Heart, ChevronLeft, Plus, Trash2, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const StrategyManagement = () => {
  const { toast } = useToast();
  const { 
    wishlistStrategies, 
    removeFromWishlist, 
    clearWishlist 
  } = useStrategyWishlist();
  const [isLoading, setIsLoading] = useState(false);

  const handleRemove = (id: string) => {
    removeFromWishlist(id);
    toast({
      title: "Strategy removed",
      description: "The strategy has been removed from your wishlist",
    });
  };

  const handleClearWishlist = () => {
    if (window.confirm("Are you sure you want to clear your wishlist?")) {
      clearWishlist();
      toast({
        title: "Wishlist cleared",
        description: "All strategies have been removed from your wishlist",
      });
    }
  };

  return (
    <div className="min-h-screen bg-charcoalPrimary text-white">
      <Header />
      
      <main className="pt-16 pb-20 px-4">
        <div className="my-6 flex items-center">
          <Link to="/dashboard" className="text-gray-400 mr-2">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold">Strategy Wishlist</h1>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Heart className="text-red-500 h-5 w-5 mr-2" />
            <h2 className="text-xl font-medium">My Wishlisted Strategies</h2>
          </div>
          
          <Link to="/strategy-selection">
            <Button 
              variant="outline" 
              size="sm"
              className="rounded-full border border-cyan/30 text-cyan bg-transparent hover:bg-cyan/10"
            >
              <Plus className="h-4 w-4 mr-1" />
              Browse Strategies
            </Button>
          </Link>
        </div>
        
        {wishlistStrategies.length > 0 ? (
          <div className="space-y-4">
            {wishlistStrategies.map((strategy) => (
              <div key={strategy.id} className="bg-charcoalSecondary rounded-xl p-4 border border-gray-800">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-white">{strategy.name}</h3>
                </div>
                <p className="text-gray-400 text-sm mb-3">{strategy.description}</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-3">
                    <div className="text-xs">
                      <div className="text-gray-500 mb-1">Status</div>
                      <div className="text-cyan font-medium">Paper Trading</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-full border border-red-500/30 text-red-500 hover:bg-red-500/10"
                      onClick={() => handleRemove(strategy.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    <Link to={`/live-trading?strategy=${strategy.id}`}>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="rounded-full border border-cyan/30 text-cyan hover:bg-cyan/10"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            
            {wishlistStrategies.length > 1 && (
              <Button 
                variant="outline" 
                className="w-full mt-4 border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-full"
                onClick={handleClearWishlist}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Wishlist
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center bg-charcoalSecondary rounded-xl p-8 border border-gray-800">
            <div className="bg-gray-800 p-4 rounded-full mb-4">
              <Heart className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">No strategies yet</h3>
            <p className="text-gray-400 text-center mb-6">Add strategies to your wishlist to keep track of them</p>
            
            <Link to="/strategy-selection">
              <Button 
                variant="cyan"
                className="rounded-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Browse Strategies
              </Button>
            </Link>
          </div>
        )}
      </main>
      
      <BottomNav />
    </div>
  );
};

export default StrategyManagement;
