
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
  selectedBrokers?: { brokerId: string; brokerName: string; quantity: number }[];
  selectedBroker?: string; // Keep for backward compatibility
  tradeType?: string;
  pnl?: string;
  successRate?: string;
}

export interface StrategySelection {
  strategy_id: number;
  quantity?: number;
  selected_broker?: string;
  trade_type?: string;
  broker_id?: string; // Add broker_id field for multiple broker support
}
