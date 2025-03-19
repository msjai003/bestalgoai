
export interface Strategy {
  id: number;
  name: string;
  description: string;
  performance: {
    winRate: string;
    avgProfit: string;
    drawdown: string;
  };
  isWishlisted: boolean;
  isLive: boolean;
  quantity: number;
  selectedBroker?: string;
  tradeType?: string; // Add tradeType field to Strategy interface
  pnl?: string;
  successRate?: string;
}

export interface StrategySelection {
  strategy_id: number;
  quantity?: number;
  selected_broker?: string;
  trade_type?: string; // Add trade_type field to StrategySelection interface
}
