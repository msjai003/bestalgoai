
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
  brokerId?: string; // Change to string to match database schema
  tradeType?: string;
  pnl?: string;
  successRate?: string;
  hasMultipleBrokers?: boolean; // Flag to indicate multiple broker configurations
  brokerConfigs?: BrokerConfig[]; // Array of broker-specific configurations for this strategy
}

export interface BrokerConfig {
  brokerId: string; // Change to string to match database schema
  brokerName: string;
  quantity: number;
  tradeType: string;
  isLive: boolean;
}

export interface StrategySelection {
  strategy_id: number;
  quantity?: number;
  selected_broker?: string;
  broker_id?: string; // Change to string to match database schema
  trade_type?: string;
}
