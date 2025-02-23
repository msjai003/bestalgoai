
export const strategies = {
  intraday: [
    "Short Straddle",
    "Combined Short Straddle",
    "Straddle Spread",
    "Supertrend"
  ],
  btst: [
    "Overnight Momentum",
    "Gap Up Strategy",
    "Trend Following BTST"
  ],
  positional: [
    "Swing Trading",
    "Position Trading",
    "Trend Following"
  ]
} as const;

export const indices = ["Nifty", "Sensex"];
export const positionTypes = ["Buy", "Sell"];
export const optionTypes = ["Call", "Put"];
export const expiryTypes = ["Weekly", "Next Weekly", "Monthly"];
export const brokers = ["Zerodha", "Aliceblue", "Angel One"];
export const highLowTypes = ["High", "Low"];

export const strikeTypes = [
  "OTM10", "OTM9", "OTM8", "OTM7", "OTM6", "OTM5", "OTM4", "OTM3", "OTM2", "OTM1",
  "ATM",
  "ITM1", "ITM2", "ITM3", "ITM4", "ITM5", "ITM6", "ITM7", "ITM8", "ITM9", "ITM10"
];

export const strategyDescriptions = {
  "Short Straddle": "A neutral options strategy that involves simultaneously selling a put and a call of the same strike price and expiration date.",
  "Combined Short Straddle": "An advanced version of short straddle with additional hedging positions.",
  "Straddle Spread": "Involves buying and selling straddles at different strike prices.",
  "Supertrend": "A trend-following indicator that shows buy and sell signals based on volatility and momentum."
} as const;
