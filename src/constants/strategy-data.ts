export const predefinedStrategies = [
  {
    id: 1,
    name: "Momentum Breakout",
    description: "Uses volume and price action to identify breakouts from consolidation patterns, entering positions in the direction of the breakout.",
    performance: {
      winRate: "72%",
      avgProfit: "₹1,850",
      drawdown: "-12%"
    },
    parameters: [
      { name: "Breakout Period", value: "20 days" },
      { name: "Volume Threshold", value: "200% of average" },
      { name: "Stop Loss", value: "5%" },
      { name: "Take Profit", value: "15%" }
    ]
  },
  {
    id: 2,
    name: "Mean Reversion",
    description: "Capitalizes on the tendency of asset prices to revert to their average over time. Trades against extreme price movements expecting a return to normal levels.",
    performance: {
      winRate: "68%",
      avgProfit: "₹1,620",
      drawdown: "-8%"
    },
    parameters: [
      { name: "Bollinger Bands", value: "2 standard deviations" },
      { name: "RSI Threshold", value: "30/70" },
      { name: "Position Size", value: "2% of portfolio" },
      { name: "Exit Timeframe", value: "3 days" }
    ]
  },
  {
    id: 3,
    name: "Straddle / Strangle",
    description: "Options strategy that involves simultaneously buying both a call option and a put option with the same expiration date, benefiting from significant price movements in either direction.",
    performance: {
      winRate: "65%",
      avgProfit: "₹2,240",
      drawdown: "-15%"
    },
    parameters: [
      { name: "Strike Selection", value: "ATM/OTM" },
      { name: "Days to Expiry", value: "15-30 days" },
      { name: "IV Percentile", value: ">30%" },
      { name: "Exit Rule", value: "50% profit or 7 days" }
    ]
  },
  {
    id: 4,
    name: "Iron Condor",
    description: "Options strategy that involves holding four different options with the same expiration date, designed to profit from low volatility in the underlying asset.",
    performance: {
      winRate: "78%",
      avgProfit: "₹980",
      drawdown: "-10%"
    },
    parameters: [
      { name: "Width", value: "20-30 points" },
      { name: "Days to Expiry", value: "30-45 days" },
      { name: "Short Strike Delta", value: "0.16" },
      { name: "Profit Target", value: "50% of max" }
    ]
  },
  {
    id: 5,
    name: "Trend Following",
    description: "Follows the direction of market trends using technical indicators to identify the start and end of trends, entering positions in the direction of the trend.",
    performance: {
      winRate: "58%",
      avgProfit: "₹2,750",
      drawdown: "-18%"
    },
    parameters: [
      { name: "EMA Crossover", value: "9/21" },
      { name: "ADX Threshold", value: ">25" },
      { name: "Trailing Stop", value: "ATR x 3" },
      { name: "Position Sizing", value: "Pyramiding" }
    ]
  },
  {
    id: 6,
    name: "Scalping Strategy",
    description: "Ultra-short-term trading strategy that aims to make small profits on price changes, often entering and exiting positions within minutes or seconds.",
    performance: {
      winRate: "66%",
      avgProfit: "₹680",
      drawdown: "-6%"
    },
    parameters: [
      { name: "Timeframe", value: "1-5 minute" },
      { name: "Order Book Depth", value: "Level 2" },
      { name: "Risk-Reward", value: "1:1.5" },
      { name: "Max Daily Trades", value: "25" }
    ]
  }
];

// Function to merge predefined strategies with customizations from database
export const getCustomizedStrategies = (dbStrategies: any[]) => {
  if (!dbStrategies || dbStrategies.length === 0) {
    return predefinedStrategies;
  }
  
  return predefinedStrategies.map(strategy => {
    const customized = dbStrategies.find(s => s.original_id === strategy.id);
    if (customized) {
      return {
        ...strategy,
        name: customized.name,
        description: customized.description
      };
    }
    return strategy;
  });
};
