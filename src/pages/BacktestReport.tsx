
import React, { useState, useRef } from 'react';
import Header from '@/components/Header';
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ChevronDown, 
  Calendar, 
  Upload, 
  Download, 
  AlertTriangle, 
  ArrowUpRight,
  ArrowDownRight 
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { toast } from "sonner";

// Type definitions for parsed CSV data
interface DailyData {
  date: string;
  profit: number;
  trades: number;
  winRate: number;
}

interface MetricsData {
  maxDrawdown: number;
  winRatio: number;
  avgProfitPerDay: number;
  cagr: number;
  calmerRatio: number;
  winningStreak: number;
  lossStreak: number;
  sharpeRatio: number;
  totalTrades: number;
}

const BacktestReport = () => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<MetricsData>({
    maxDrawdown: 0,
    winRatio: 0,
    avgProfitPerDay: 0,
    cagr: 0,
    calmerRatio: 0,
    winningStreak: 0,
    lossStreak: 0,
    sharpeRatio: 0,
    totalTrades: 0
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');

  // Mock function to calculate metrics from CSV data
  const calculateMetrics = (data: any[]): MetricsData => {
    // This would be replaced with actual calculations based on your data
    const winRatio = Math.round(Math.random() * 30 + 55); // Between 55-85%
    
    return {
      maxDrawdown: Math.round(Math.random() * 3000 + 2000),
      winRatio: winRatio,
      avgProfitPerDay: Math.round(Math.random() * 200 + 150),
      cagr: Math.round((Math.random() * 15 + 10) * 10) / 10, // Between 10-25%
      calmerRatio: Math.round((Math.random() * 2 + 1) * 100) / 100, // Between 1.00-3.00
      winningStreak: Math.round(Math.random() * 5 + 4), // Between 4-9
      lossStreak: Math.round(Math.random() * 3 + 1), // Between 1-4
      sharpeRatio: Math.round((Math.random() * 1 + 1) * 100) / 100, // Between 1.00-2.00
      totalTrades: Math.round(Math.random() * 50 + 30) // Between 30-80
    };
  };

  // Function to handle CSV file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // For demo purposes, we'll generate mock data instead of parsing CSV
        const mockDailyData: DailyData[] = Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - 30 + i);
          const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          
          return {
            date: dateStr,
            profit: Math.round((Math.random() * 2000 - 500)),
            trades: Math.round(Math.random() * 7 + 2),
            winRate: Math.round(Math.random() * 40 + 50)
          };
        });

        const mockMonthlyData = Array.from({ length: 12 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - 12 + i);
          const monthStr = date.toLocaleDateString('en-US', { month: 'short' });
          
          return {
            month: monthStr,
            profit: Math.round((Math.random() * 15000 - 3000)),
            trades: Math.round(Math.random() * 40 + 30),
            winRate: Math.round(Math.random() * 30 + 55)
          };
        });

        setDailyData(mockDailyData);
        setMonthlyData(mockMonthlyData);
        setMetrics(calculateMetrics(mockDailyData));
        setFileUploaded(true);
        toast.success("Backtest data loaded successfully");
      } catch (error) {
        console.error("Error parsing CSV:", error);
        toast.error("There was an error processing your file. Please check the format.");
      }
    };
    reader.readAsText(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-charcoalPrimary min-h-screen">
      <header className="fixed top-0 left-0 right-0 bg-charcoalPrimary/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Link to="/dashboard" className="p-2">
            <i className="fa-solid fa-arrow-left text-charcoalTextSecondary"></i>
          </Link>
          <h1 className="text-charcoalTextPrimary text-lg font-medium">Backtest Report</h1>
          <button className="p-2">
            <i className="fa-solid fa-gear text-charcoalTextSecondary"></i>
          </button>
        </div>
      </header>

      <main className="pt-16 pb-20 px-4">
        <div className="bg-charcoalSecondary/50 p-1 rounded-xl mt-4 mb-6">
          <div className="grid grid-cols-2 gap-1">
            <button className="bg-gradient-to-r from-cyan to-cyan/80 text-charcoalPrimary py-2 px-4 rounded-lg text-sm font-medium">
              Backtesting
            </button>
            <Link to="/strategy-builder" className="text-charcoalTextSecondary py-2 px-4 rounded-lg text-sm font-medium text-center">
              Strategy Builder
            </Link>
          </div>
        </div>

        {!fileUploaded ? (
          <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-700 rounded-xl bg-charcoalSecondary/20 mt-8">
            <Upload className="w-12 h-12 text-gray-500 mb-4" />
            <h3 className="text-charcoalTextPrimary text-lg font-medium mb-2">Upload Backtest Data</h3>
            <p className="text-charcoalTextSecondary text-sm text-center mb-6">
              Upload a CSV file containing your trading data to generate a detailed backtest report
            </p>
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button onClick={triggerFileInput} className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Select CSV File
            </Button>
          </div>
        ) : (
          <>
            <section className="space-y-4">
              <div className="bg-charcoalSecondary/30 rounded-xl p-4 border border-gray-700 shadow-lg">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-charcoalSecondary/50 p-3 rounded-lg">
                    <p className="text-charcoalTextSecondary text-xs mb-1">Profit/Loss</p>
                    <p className="text-charcoalSuccess text-lg font-semibold">+₹12,450</p>
                  </div>
                  <div className="bg-charcoalSecondary/50 p-3 rounded-lg">
                    <p className="text-charcoalTextSecondary text-xs mb-1">Win Rate</p>
                    <p className="text-charcoalTextPrimary text-lg font-semibold">{metrics.winRatio}%</p>
                  </div>
                </div>
                <div className="space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-charcoalTextSecondary text-sm">Total Trades</span>
                    <span className="text-charcoalTextPrimary">{metrics.totalTrades}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-charcoalTextSecondary text-sm">Avg. Profit per Trade</span>
                    <span className="text-charcoalSuccess">₹{metrics.avgProfitPerDay}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-charcoalTextSecondary text-sm">Max Drawdown</span>
                    <span className="text-charcoalDanger">-₹{metrics.maxDrawdown}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-charcoalTextSecondary text-sm">Sharpe Ratio</span>
                    <span className="text-charcoalTextPrimary">{metrics.sharpeRatio}</span>
                  </div>
                </div>
              </div>

              <div className="bg-charcoalSecondary/30 rounded-xl border border-gray-700 shadow-lg overflow-hidden mt-6">
                <div className="flex border-b border-gray-700">
                  <button
                    className={`flex-1 py-3 px-4 text-sm font-medium ${
                      activeTab === 'daily' 
                        ? 'text-cyan border-b-2 border-cyan' 
                        : 'text-charcoalTextSecondary'
                    }`}
                    onClick={() => setActiveTab('daily')}
                  >
                    Daily Performance
                  </button>
                  <button
                    className={`flex-1 py-3 px-4 text-sm font-medium ${
                      activeTab === 'monthly' 
                        ? 'text-cyan border-b-2 border-cyan' 
                        : 'text-charcoalTextSecondary'
                    }`}
                    onClick={() => setActiveTab('monthly')}
                  >
                    Monthly Performance
                  </button>
                </div>

                <div className="p-4">
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      {activeTab === 'daily' ? (
                        <LineChart
                          data={dailyData}
                          margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                          <XAxis 
                            dataKey="date" 
                            tick={{ fill: '#888' }} 
                            tickLine={{ stroke: '#888' }}
                            axisLine={{ stroke: '#555' }}
                          />
                          <YAxis 
                            tick={{ fill: '#888' }} 
                            tickLine={{ stroke: '#888' }}
                            axisLine={{ stroke: '#555' }}
                            tickFormatter={(value) => `₹${value}`}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(17, 17, 17, 0.9)',
                              borderColor: '#444',
                              borderRadius: '4px',
                              color: '#fff',
                            }}
                            formatter={(value: any) => [`₹${value}`, 'Profit/Loss']}
                          />
                          <Line
                            type="monotone"
                            dataKey="profit"
                            stroke="#00BCD4"
                            strokeWidth={2}
                            dot={{ r: 3, fill: '#00BCD4', stroke: '#00BCD4' }}
                            activeDot={{ r: 5, stroke: '#00BCD4', strokeWidth: 2 }}
                          />
                        </LineChart>
                      ) : (
                        <BarChart
                          data={monthlyData}
                          margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                          <XAxis 
                            dataKey="month" 
                            tick={{ fill: '#888' }} 
                            tickLine={{ stroke: '#888' }}
                            axisLine={{ stroke: '#555' }}
                          />
                          <YAxis 
                            tick={{ fill: '#888' }} 
                            tickLine={{ stroke: '#888' }}
                            axisLine={{ stroke: '#555' }}
                            tickFormatter={(value) => `₹${value}`}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(17, 17, 17, 0.9)',
                              borderColor: '#444',
                              borderRadius: '4px',
                              color: '#fff',
                            }}
                            formatter={(value: any) => [`₹${value}`, 'Profit/Loss']}
                          />
                          <Bar 
                            dataKey="profit" 
                            fill="#00BCD4"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="bg-charcoalSecondary/30 rounded-xl border border-gray-700 shadow-lg overflow-hidden mt-6">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="text-charcoalTextPrimary font-medium">Advanced Metrics</h3>
                </div>
                <div className="grid grid-cols-2 p-4 gap-4">
                  <MetricCard 
                    label="CAGR" 
                    value={`${metrics.cagr}%`} 
                    icon={<ArrowUpRight className="h-4 w-4 text-charcoalSuccess" />}
                  />
                  <MetricCard 
                    label="Calmer Ratio" 
                    value={metrics.calmerRatio.toString()} 
                    icon={<ArrowUpRight className="h-4 w-4 text-charcoalSuccess" />}
                  />
                  <MetricCard 
                    label="Winning Streak" 
                    value={metrics.winningStreak.toString()} 
                    icon={<ArrowUpRight className="h-4 w-4 text-charcoalSuccess" />}
                  />
                  <MetricCard 
                    label="Loss Streak" 
                    value={metrics.lossStreak.toString()} 
                    icon={<ArrowDownRight className="h-4 w-4 text-charcoalDanger" />}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Report
                </Button>
              </div>
            </section>
          </>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

const MetricCard = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => {
  return (
    <div className="bg-charcoalSecondary/50 p-3 rounded-lg">
      <div className="flex justify-between items-center mb-1">
        <p className="text-charcoalTextSecondary text-xs">{label}</p>
        {icon}
      </div>
      <p className="text-charcoalTextPrimary text-lg font-semibold">{value}</p>
    </div>
  );
};

export default BacktestReport;
