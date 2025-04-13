
// Add the TradeType import if it's not already there
import { TradeType } from "@/types/strategy";

export interface StrategySelection {
  strategy_id: number;
  quantity?: number;
  selected_broker?: string;
}

export interface Strategy {
  id: number;
  name: string;
  description?: string;
  isWishlisted?: boolean;
  isLive?: boolean;
  isPremium?: boolean;
  isPaid?: boolean;
  isCustom?: boolean;
  quantity?: number;
  selectedBroker?: string;
  brokerUsername?: string;
  tradeType?: TradeType;
  rowId?: string;
  uniqueId?: string;
  successRate?: string;
  pnl?: string;
  performance?: {
    winRate: string;
    profitFactor: string;
    avgProfit: string;
    avgLoss: string;
    drawdown?: string; // Added for compatibility
  };
}
