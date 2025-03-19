
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
  brokerUsername?: string; // Add new field for broker username
  tradeType?: string;
  pnl?: string;
  successRate?: string;
}

export interface StrategySelection {
  strategy_id: number;
  quantity?: number;
  selected_broker?: string;
  broker_username?: string; // Add new field for broker username
  trade_type?: string;
}
