
export interface Strategy {
  id: number;
  uniqueId?: string; // Add uniqueId property for multiple instances of the same strategy
  rowId?: string; // Add rowId to store the actual database row ID
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
  brokerUsername?: string;
  tradeType?: string;
  pnl?: string;
  successRate?: string;
  brokerId?: number; // Add brokerId property for broker logo fetching
}

export interface StrategySelection {
  strategy_id: number;
  quantity?: number;
  selected_broker?: string;
  broker_username?: string;
  trade_type?: string;
}
