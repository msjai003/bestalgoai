export interface Strategy {
  id: number | string;
  name: string;
  description?: string;
  performance?: {
    winRate: string;
    avgProfit: string;
    drawdown: string;
  };
  isLive?: boolean;
  isPremium?: boolean;
  isPaid?: boolean;
  quantity?: number;
  selectedBroker?: string | null;
  brokerUsername?: string | null;
  tradeType?: 'paper trade' | 'live trade';
  isWishlisted?: boolean;
  isCustom?: boolean;
  isFeatured?: boolean;
  legs?: any[];
  uniqueId?: string;
  rowId?: string | null;
  paid_status?: string;
  createdBy?: string;
  // New field to support broker-specific configurations
  brokerConfigs?: BrokerConfig[];
}

export interface BrokerConfig {
  brokerName: string;
  brokerUsername: string;
  quantity: number;
  tradeType: 'paper trade' | 'live trade';
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

export interface PerformanceMetrics {
  winRate: string;
  avgProfit: string;
  drawdown: string;
}

export interface StrategyWithMetrics extends Strategy {
  metrics: PerformanceMetrics;
}
