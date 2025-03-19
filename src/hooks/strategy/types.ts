
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
  tradeType?: string;
  pnl?: string;
  successRate?: string;
  paidStatus?: string; // Add paidStatus field
}

export interface StrategySelection {
  strategy_id: number;
  quantity?: number;
  selected_broker?: string;
  trade_type?: string;
  paid_status?: string; // Add paid_status field
}
