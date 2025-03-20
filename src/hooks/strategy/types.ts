
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
}

export interface StrategySelection {
  strategy_id: number;
  quantity?: number;
  selected_broker?: string;
  broker_username?: string;
  trade_type?: string;
}

export interface BrokerFunction {
  id: string;
  broker_id: number;
  broker_name: string;
  function_name: string;
  function_description: string | null;
  function_slug: string;
  function_enabled: boolean;
  is_premium: boolean;
  configuration: any; // Changed from Record<string, any> to any to be compatible with Json type
  created_at: string;
  updated_at: string;
}
