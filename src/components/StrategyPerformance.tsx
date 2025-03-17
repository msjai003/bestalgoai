
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Line, 
  LineChart, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Tooltip,
  Bar,
  BarChart
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { predefinedStrategies } from '@/constants/strategy-data';
import { Progress } from '@/components/ui/progress';

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
  { name: 'Momentum Breakout', performance: 72, color: '#FF00D4' },
  { name: 'Mean Reversion', performance: 68, color: '#9333ea' },
  { name: 'Trend Following', performance: 58, color: '#818cf8' },
  { name: 'Scalping Strategy', performance: 66, color: '#60a5fa' },
];

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
    <section className="py-8 px-4" id="strategy-performance">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Strategy Performance</h2>
        
        {/* Performance Metrics Card */}
        <Card className="mb-6 border border-gray-700 bg-gray-800/50">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold">Performance Metrics</CardTitle>
              <button className="text-sm px-3 py-1 rounded-lg bg-[#FF00D4]/20 text-[#FF00D4] flex items-center">
                Export <span className="ml-1">↓</span>
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-gray-400 text-sm">Win Rate</div>
                <div className="text-xl font-bold text-[#FF00D4]">72.5%</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-gray-400 text-sm">Max Drawdown</div>
                <div className="text-xl font-bold text-red-400">-12.3%</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-gray-400 text-sm">Sharpe Ratio</div>
                <div className="text-xl font-bold text-green-400">2.1</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-gray-400 text-sm">Avg. Profit</div>
                <div className="text-xl font-bold text-green-400">₹1,850</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Strategy Comparison Card */}
        <Card className="mb-6 border border-gray-700 bg-gray-800/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Strategy Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {strategyComparisonData.map((strategy, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{strategy.name}</span>
                    <span className="text-[#FF00D4]">+{strategy.performance}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{
                        width: `${strategy.performance}%`,
                        backgroundColor: strategy.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Monthly Performance Chart */}
        <Card className="mb-6 border border-gray-700 bg-gray-800/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
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
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      borderColor: '#374151',
                      color: '#ffffff'
                    }} 
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#FF00D4"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Top Strategies Table */}
        <Card className="border border-gray-700 bg-gray-800/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Top Performing Strategies</CardTitle>
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
                    <TableCell className="text-right font-semibold text-[#FF00D4]">{strategy.performance.winRate}</TableCell>
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
