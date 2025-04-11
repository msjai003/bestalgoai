
import { Button } from "@/components/ui/button";
import { ChevronLeft, HelpCircle } from "lucide-react";

interface BrokerHeaderProps {
  onBack: () => void;
  title: string;
}

export const BrokerHeader = ({ onBack, title }: BrokerHeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 z-50">
      <div className="flex items-center justify-between px-4 h-16">
        <Button 
          variant="outline" 
          className="bg-surfaceBg border border-gray-700 text-textPrimary hover:bg-surfaceBg/80"
          onClick={onBack}
          size="sm"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span className="text-xs">Back</span>
        </Button>
        <h1 className="text-lg font-semibold">{title}</h1>
        <Button variant="ghost" className="p-2">
          <HelpCircle className="w-5 h-5 text-gray-300" />
        </Button>
      </div>
    </header>
  );
};
