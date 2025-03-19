
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface DeploymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeployStrategy: (mode: "paper" | "real") => void;
  strategyName: string;
}

export const DeploymentDialog = ({
  open,
  onOpenChange,
  onDeployStrategy,
  strategyName,
}: DeploymentDialogProps) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleDeployStrategy = (mode: "paper" | "real") => {
    if (!user) {
      toast({
        title: "Sign in Required",
        description: "Your strategy will be saved locally. Sign in to fully save your strategies.",
        duration: 5000,
      });
    }
    
    onDeployStrategy(mode);
    onOpenChange(false); // Ensure dialog closes after deployment selection
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md mx-auto rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Select Deployment Mode</DialogTitle>
          <DialogDescription className="text-gray-300 mt-2">
            Would you like to deploy in Paper Trade mode or Real Mode?
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Button 
            variant="outline" 
            onClick={() => handleDeployStrategy("paper")}
            className="h-24 w-full flex flex-col items-center justify-center bg-gray-700 border-gray-600 text-white hover:bg-gray-600 rounded-xl"
          >
            <span className="text-lg mb-1">📝</span>
            <span className="text-base font-medium">Paper Trade</span>
            <span className="text-xs text-gray-400 mt-1 text-center w-full px-3">Simulation Only</span>
          </Button>
          <Button 
            onClick={() => handleDeployStrategy("real")}
            className="h-24 w-full flex flex-col items-center justify-center bg-gradient-to-r from-pink-500/80 to-purple-500/80 text-white hover:from-pink-500/70 hover:to-purple-500/70 rounded-xl"
          >
            <span className="text-lg mb-1">💰</span>
            <span className="text-base font-medium">Real Mode</span>
            <span className="text-xs text-gray-200 mt-1 text-center w-full px-3">Live Execution</span>
          </Button>
        </div>
        <div className="mt-4 p-4 bg-gray-700/50 rounded-lg text-gray-300 text-sm">
          <p>{user ? "Your strategy will be saved to your account and can be accessed across devices." : "Sign in to save your strategies permanently and access them across devices."}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
