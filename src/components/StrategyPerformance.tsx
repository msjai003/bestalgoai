
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { 
  Line, 
  LineChart, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Area,
  AreaChart,
  Tooltip,
  Bar,
  BarChart
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { predefinedStrategies } from '@/constants/strategy-data';

// Sample performance data
const performanceData = [
  { month: 'Jan', profit: 12000, trades: 22 },
  { month: 'Feb', profit: 19000, trades: 31 },
  { month: 'Mar', profit: 9000, trades: 18 },
  { month: 'Apr', profit: 18000, trades: 26 },
  { month: 'May', profit: 25000, trades: 35 },
  { month: 'Jun', profit: 17000, trades: 29 },
];

const strategyComparisonData = [
  { name: 'Momentum Breakout', win: 72, loss: 28 },
  { name: 'Mean Reversion', win: 68, loss: 32 },
  { name: 'Trend Following', win: 58, loss: 42 },
  { name: 'Scalping Strategy', win: 66, loss: 34 },
];

const chartConfig = {
  profit: {
    label: 'Profit',
    theme: {
      light: '#10b981',
      dark: '#10b981',
    },
  },
  trades: {
    label: 'Trades',
    theme: {
      light: '#6366f1',
      dark: '#818cf8',
    },
  },
  win: {
    label: 'Win',
    theme: {
      light: '#10b981',
      dark: '#10b981',
    },
  },
  loss: {
    label: 'Loss',
    theme: {
      light: '#ef4444',
      dark: '#ef4444',
    },
  },
};

export const StrategyPerformance = () => {
  // Get the top 4 strategies by win rate
  const topStrategies = [...predefinedStrategies]
    .sort((a, b) => {
      const aWinRate = parseInt(a.performance.winRate.replace('%', ''));
      const bWinRate = parseInt(b.performance.winRate.replace('%', ''));
      return bWinRate - aWinRate;
    })
    .slice(0, 4);

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center">Strategy Performance Analysis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Performance chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#9ca3af"
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    tickLine={false}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#10b981"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
          
          {/* Strategy comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Strategy Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <BarChart data={strategyComparisonData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    type="number" 
                    stroke="#9ca3af"
                    tickLine={false}
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    stroke="#9ca3af"
                    tickLine={false}
                    width={120}
                  />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="win" stackId="a" fill="#10b981" />
                  <Bar dataKey="loss" stackId="a" fill="#ef4444" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        
        {/* Top strategies table */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Strategy</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Win Rate</TableHead>
                  <TableHead className="text-right">Avg. Profit</TableHead>
                  <TableHead className="text-right">Drawdown</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topStrategies.map((strategy) => (
                  <TableRow key={strategy.id}>
                    <TableCell className="font-medium">{strategy.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{strategy.description}</TableCell>
                    <TableCell className="text-right font-semibold text-green-500">{strategy.performance.winRate}</TableCell>
                    <TableCell className="text-right">{strategy.performance.avgProfit}</TableCell>
                    <TableCell className="text-right text-red-500">{strategy.performance.drawdown}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
