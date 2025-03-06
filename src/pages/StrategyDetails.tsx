
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Info, ArrowLeft, Check, X } from "lucide-react";
import { predefinedStrategies } from "@/constants/strategy-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

const StrategyDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [strategy, setStrategy] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
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
    setShowConfirmation(true);
  };

  const handleConfirmDeploy = () => {
    setShowConfirmation(false);
    // Proceed with live trading implementation
    navigate("/live-trading");
  };

  const handleCancelDeploy = () => {
    setShowConfirmation(false);
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
          className="w-full py-6 bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80 text-white hover:from-[#FF00D4]/90 hover:to-[#FF00D4]/70 rounded-xl"
        >
          Use for Live Trading
        </Button>
      </div>
      <BottomNav />
      
      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md mx-auto rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Confirm Strategy Deployment</DialogTitle>
            <DialogDescription className="text-gray-300 mt-2">
              You are about to implement this strategy for live trading using your selected default brokerage account. Please review your settings before proceeding. Live execution will follow the defined parameters and risk controls.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end items-center gap-4 mt-6">
            <Button 
              variant="outline" 
              onClick={handleCancelDeploy}
              className="border-gray-700 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white rounded-xl h-11 px-5"
            >
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button 
              onClick={handleConfirmDeploy}
              className="bg-gradient-to-r from-[#FF00D4] to-[#FF00D4]/80 text-white hover:from-[#FF00D4]/90 hover:to-[#FF00D4]/70 rounded-xl h-11 px-5"
            >
              <Check className="mr-2 h-4 w-4" /> Confirm & Deploy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StrategyDetails;
