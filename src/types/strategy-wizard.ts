
export type StrategyType = "intraday" | "btst" | "positional";
export type SegmentType = "futures" | "options";
export type UnderlyingType = "cash" | "futures";
export type PositionType = "buy" | "sell";
export type ExpiryType = "weekly" | "monthly";
export type StrikeCriteriaType = "strike" | "premium";
export type OptionType = "call" | "put";
export type StrikeLevel = 
  | "ATM"
  | "ITM1" | "ITM2" | "ITM3" | "ITM4" | "ITM5" 
  | "ITM6" | "ITM7" | "ITM8" | "ITM9" | "ITM10"
  | "ITM11" | "ITM12" | "ITM13" | "ITM14" | "ITM15"
  | "ITM16" | "ITM17" | "ITM18" | "ITM19" | "ITM20"
  | "OTM1" | "OTM2" | "OTM3" | "OTM4" | "OTM5"
  | "OTM6" | "OTM7" | "OTM8" | "OTM9" | "OTM10"
  | "OTM11" | "OTM12" | "OTM13" | "OTM14" | "OTM15"
  | "OTM16" | "OTM17" | "OTM18" | "OTM19" | "OTM20";

export enum WizardStep {
  TRADE_SETUP = 0,
  STRIKE_TIMING = 1,
  RISK_MANAGEMENT = 2,
  CONFIRMATION = 3
}

export interface StrategyLeg {
  id: string;
  strategyType: StrategyType;
  instrument: string;
  segment: SegmentType;
  underlying: UnderlyingType;
  positionType: PositionType;
  expiryType: ExpiryType;
  strikeCriteria: StrikeCriteriaType;
  strikeLevel?: StrikeLevel;
  optionType?: OptionType;
  entryTime: string;
  exitTime: string;
  stopLoss: string;
  reEntryOnSL: boolean;
  reEntryOnSLCount: string;
  target: string;
  reEntryOnTarget: boolean;
  reEntryOnTargetCount: string;
  trailingEnabled: boolean;
  trailingLockProfit: string;
  trailingLockAt: string;
}

export interface WizardFormData {
  legs: StrategyLeg[];
  currentLegIndex: number;
}
