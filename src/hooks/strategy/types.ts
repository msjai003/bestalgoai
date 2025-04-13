
// Add the TradeType import if it's not already there
import { TradeType } from "@/types/strategy";

export interface Strategy {
  id: number;
  name: string;
  description?: string;
  isWishlisted?: boolean;
  isLive?: boolean;
  isPremium?: boolean;
  isPaid?: boolean;
  quantity?: number;
  selectedBroker?: string;
  brokerUsername?: string;
  tradeType?: TradeType;
  performance?: {
    winRate: string;
    profitFactor: string;
    avgProfit: string;
    avgLoss: string;
  };
  uniqueId?: string;
  pnl?: string;
  successRate?: string;
}
