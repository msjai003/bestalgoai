
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Info, ArrowLeft } from "lucide-react";
import { predefinedStrategies } from "@/constants/strategy-data";
import { ScrollArea } from "@/components/ui/scroll-area";

const StrategyDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [strategy, setStrategy] = useState<any>(null);
  
  useEffect(() => {
    if (id) {
      const foundStrategy = predefinedStrategies.find(
        (s) => s.id.toString() === id
      );
      
      if (foundStrategy) {
        setStrategy(foundStrategy);
      } else {
        // If strategy not found, go back to selection
        navigate("/strategy-selection");
      }
    }
  }, [id, navigate]);

  const handleDeployStrategy = () => {
    navigate("/backtest");
  };

  const handleBack = () => {
    navigate("/strategy-selection");
  };

  if (!strategy) {
    return (
      <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center">
        <p className="text-white">Loading strategy details...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      <Header />
      <main className="pt-14 pb-20 flex-1 overflow-auto">
        <div className="px-4 py-3 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="text-gray-400 hover:text-white mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-white">Strategy Details</h1>
        </div>

        <div className="px-4 pb-24">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">{strategy.name}</h2>
            <p className="text-gray-300">{strategy.description}</p>
            
            <div className="mt-6">
              <h4 className="text-lg text-white font-medium mb-3">Performance Summary</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-gray-400 text-xs">Win Rate</p>
                  <p className="text-white text-lg font-semibold mt-1">{strategy.performance?.winRate}</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-gray-400 text-xs">Avg Profit</p>
                  <p className="text-green-400 text-lg font-semibold mt-1">{strategy.performance?.avgProfit}</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-gray-400 text-xs">Drawdown</p>
                  <p className="text-red-400 text-lg font-semibold mt-1">{strategy.performance?.drawdown}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-lg text-white font-medium mb-3">Parameters</h4>
              <div className="space-y-3">
                {strategy.parameters?.map((param: any, index: number) => (
                  <div key={index} className="flex justify-between items-center bg-gray-800/30 p-3 rounded-lg">
                    <span className="text-gray-300">{param.name}</span>
                    <span className="text-white font-medium">{param.value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 flex items-start gap-3 bg-gray-800/30 p-4 rounded-lg">
              <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-gray-300">This strategy uses machine learning algorithms to identify market trends and execute trades accordingly.</p>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-16 left-0 right-0 p-4 bg-gradient-to-t from-gray-900 via-gray-900 to-transparent">
        <Button 
          onClick={handleDeployStrategy}
          className="w-full py-6 bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80 text-white hover:from-[#FF00D4]/90 hover:to-[#FF00D4]/70"
        >
          Use for Live Trading
        </Button>
      </div>
      <BottomNav />
    </div>
  );
};

export default StrategyDetails;
