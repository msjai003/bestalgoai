
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
  brokerId?: string; // Add broker ID field for reference
  tradeType?: string;
  pnl?: string;
  successRate?: string;
  hasMultipleBrokers?: boolean; // Flag to indicate multiple broker configurations
  brokerConfigs?: Strategy[]; // Array of broker-specific configurations for this strategy
}

export interface StrategySelection {
  strategy_id: number;
  quantity?: number;
  selected_broker?: string;
  broker_id?: string; // Add broker_id field
  trade_type?: string;
}
