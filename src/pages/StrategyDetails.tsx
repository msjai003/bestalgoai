import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import Header from '@/components/Header';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { predefinedStrategies } from "@/constants/strategy-data";

const StrategyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const strategyId = parseInt(id || "0", 10);
  const strategy = predefinedStrategies.find((s) => s.id === strategyId);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!strategy) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-4">
            <Link to="/strategy-selection" className="text-gray-400 hover:text-gray-300 transition-colors">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Strategies
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Strategy Not Found</h1>
            <p className="text-gray-500">The requested strategy does not exist.</p>
          </div>
        </main>
      </div>
    );
  }

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `Strategy has been ${isWishlisted ? 'removed from' : 'added to'} your wishlist`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-4">
          <Link to="/strategy-selection" className="text-gray-400 hover:text-gray-300 transition-colors">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Strategies
          </Link>
        </div>

        <Card className="bg-gray-800 border border-gray-700 shadow-lg">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-4">{strategy.name}</h1>
            <p className="text-gray-400 mb-6">{strategy.description}</p>

            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Key Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">
                    <span className="font-medium text-white">Win Rate:</span> {strategy.winRate}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">
                    <span className="font-medium text-white">Risk Score:</span> {strategy.riskScore}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">
                    <span className="font-medium text-white">Average Return:</span> {strategy.avgReturn}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">
                    <span className="font-medium text-white">Max Drawdown:</span> {strategy.maxDrawdown}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Strategy Logic</h2>
              <ScrollArea className="h-40 bg-gray-700/20 rounded-md p-4">
                <p className="text-sm text-gray-300">{strategy.strategyLogic}</p>
              </ScrollArea>
            </div>

            <div className="flex justify-between items-center">
              <Button onClick={handleToggleWishlist} variant="outline">
                {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              </Button>
              <Button>Deploy Strategy</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StrategyDetails;
