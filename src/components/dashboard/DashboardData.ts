
// Mock data to be used in the Dashboard components

export const mockPerformanceData = [
  { date: '1/5', value: 1200000, trend: 'up' },
  { date: '2/5', value: 1300000, trend: 'up' },
  { date: '3/5', value: 1280000, trend: 'down' }, // First red dot with small drawdown
  { date: '4/5', value: 1250000, trend: 'down' }, // Second red dot with small drawdown
  { date: '5/5', value: 1280000, trend: 'up' }, 
  { date: '6/5', value: 1330000, trend: 'up' },
  { date: '7/5', value: 1380000, trend: 'up' },
  { date: '8/5', value: 1350000, trend: 'down' }, // Changed to down (red)
  { date: '9/5', value: 1320000, trend: 'down' }, // Changed to down (red)
  { date: '10/5', value: 1380000, trend: 'up' },
];

export const mockStrategies = [
  { 
    id: '1', 
    name: 'Moving Average Crossover', 
    description: 'A trend-following strategy based on the crossover of two moving averages',
    isPremium: false
  },
  { 
    id: '2', 
    name: 'RSI Reversal', 
    description: 'Identifies potential market reversals using the Relative Strength Index',
    isPremium: true
  },
  { 
    id: '3', 
    name: 'Bollinger Band Squeeze', 
    description: 'Capitalizes on breakouts when volatility increases after a period of contraction',
    isPremium: true
  }
];
