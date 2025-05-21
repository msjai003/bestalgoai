
import { Button } from "@/components/ui/button";

interface TradingModeFilterProps {
  selectedMode: "all" | "live" | "paper";
  onModeChange: (mode: "all" | "live" | "paper") => void;
}

export const TradingModeFilter: React.FC<TradingModeFilterProps> = ({
  selectedMode,
  onModeChange
}) => {
  const getModeClass = (mode: "all" | "live" | "paper") => {
    const baseClass = "border-b-2 pb-2 transition-all duration-200 px-3";
    if (mode === selectedMode) {
      return `${baseClass} border-cyan text-cyan font-medium`;
    }
    return `${baseClass} border-transparent text-gray-400 hover:text-white`;
  };

  return (
    <div className="flex space-x-4 overflow-x-auto pb-1">
      <button
        className={getModeClass("all")}
        onClick={() => onModeChange("all")}
      >
        All Strategies
      </button>
      <button
        className={getModeClass("live")}
        onClick={() => onModeChange("live")}
      >
        Live Trading
      </button>
      <button
        className={getModeClass("paper")}
        onClick={() => onModeChange("paper")}
      >
        Paper Trading
      </button>
    </div>
  );
};
