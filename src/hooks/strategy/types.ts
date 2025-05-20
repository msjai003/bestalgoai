export interface StrategyPerformance {
  winRate?: string;
  avgProfit?: string;
  drawdown?: string;
}

// Extend the Strategy interface to include necessary properties
export interface Strategy {
  id: number | string;
  name: string;
  description: string;
  isPremium?: boolean;
  package?: string;
  performance?: StrategyPerformance;
  isWishlisted?: boolean;
  isLive?: boolean;
  tradeMode?: 'live trade' | 'paper trade';
  isPaid?: boolean;
  quantity?: number;
}
