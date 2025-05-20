
export type StrategyType = "predefined" | "custom";
export type StrategyCategory = "intraday" | "btst" | "positional";

export interface FormData {
  strategy: string;
  strategyDescription: string;
  index: string;
  entryTime: string;
  exitTime: string;
  quantity: string;
  position: string;
  optionType: string;
  expiry: string;
  strikeType: string;
  target: string;
  stoploss: string;
  entryMomentum: string;
  rangeBreakout: string;
  highLow: string;
  instrument: string;
  broker: string;
  apiKey: string;
  accessToken: string;
}

export type StepType = typeof STEPS[keyof typeof STEPS];

export const STEPS = {
  STRATEGY_TYPE: 0,
  STRATEGY_DETAILS: 1,
  POSITION: 2,
  OPTIONS: 3,
  PARAMETERS: 4,
  BROKER: 5
} as const;
