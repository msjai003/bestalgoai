
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
  tradeType?: "paper trade" | "live trade"; // Restrict to specific values
  pnl?: string;
  successRate?: string;
  isPremium?: boolean; // Whether this is a premium strategy
  isPaid?: boolean; // Whether the user has paid for this strategy
  isCustom?: boolean; // Whether this is a custom strategy or predefined
  paid_status?: string; // Add this property to match what's coming from the database
}

export interface StrategySelection {
  strategy_id: number;
  quantity?: number;
  selected_broker?: string;
  broker_username?: string;
  trade_type?: "paper trade" | "live trade";
}

export interface BrokerFunction {
  id: string;
  broker_id: number;
  broker_name: string;
  function_name: string;
  function_description?: string;
  function_slug: string;
  function_enabled: boolean;
  is_premium: boolean;
  broker_image?: string;
  configuration?: any;
}

export interface BrokerCredentials {
  username: string;
  password: string;
  secretKey: string; // Now required
  twoFactorSecret: string; // Now required
  apiKey?: string; // Optional
  accessToken?: string; // Optional
  sessionId?: string; // Optional
  brokerUsername?: string; // Optional
  tradeType?: string; // Optional
  pnl?: string; // Optional
}
