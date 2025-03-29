import React, { useState, useRef, useEffect } from 'react';
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
  ArrowDownRight,
  Save,
  Trash
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
import { useBacktestResults, BacktestResult } from "@/hooks/strategy/useBacktestResults";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

const saveFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

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
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [currentBacktest, setCurrentBacktest] = useState<BacktestResult | null>(null);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  
  const { 
    backtestResults, 
    loading: resultsLoading, 
    saveBacktestResult,
    deleteBacktestResult 
  } = useBacktestResults();
  
  const saveForm = useForm<z.infer<typeof saveFormSchema>>({
    resolver: zodResolver(saveFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

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
        setCurrentBacktest(null); // Clear currently loaded backtest
        toast.success("Backtest data loaded successfully");
      } catch (error) {
        console.error("Error parsing CSV:", error);
        toast.error("There was an error processing your file. Please check the format.");
      }
    };
    reader.readAsText(file);
  };

  const handleSaveBacktest = async (values: z.infer<typeof saveFormSchema>) => {
    // Create a new date for the start date (30 days ago from today)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    // Prepare the data for saving
    const backtestData = {
      title: values.title,
      description: values.description || null,
      strategyId: null, // No strategy linked in this demo
      startDate: startDate.toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      metrics: {
        totalTrades: metrics.totalTrades,
        winRate: metrics.winRatio,
        avgProfit: metrics.avgProfitPerDay,
        maxDrawdown: metrics.maxDrawdown,
        sharpeRatio: metrics.sharpeRatio,
        cagr: metrics.cagr,
        calmerRatio: metrics.calmerRatio,
        winningStreak: metrics.winningStreak,
        lossStreak: metrics.lossStreak
      },
      dailyPerformance: dailyData,
      monthlyPerformance: monthlyData
    };
    
    const result = await saveBacktestResult(backtestData);
    
    if (result) {
      setSaveDialogOpen(false);
      saveForm.reset();
    }
  };

  const loadBacktestResult = (result: BacktestResult) => {
    setCurrentBacktest(result);
    setDailyData(result.dailyPerformance);
    setMonthlyData(result.monthlyPerformance);
    setMetrics({
      totalTrades: result.metrics.totalTrades,
      winRatio: result.metrics.winRate,
      avgProfitPerDay: result.metrics.avgProfit,
      maxDrawdown: result.metrics.maxDrawdown,
      sharpeRatio: result.metrics.sharpeRatio,
      cagr: result.metrics.cagr,
      calmerRatio: result.metrics.calmerRatio,
      winningStreak: result.metrics.winningStreak,
      lossStreak: result.metrics.lossStreak
    });
    setFileUploaded(true);
    setLoadDialogOpen(false);
  };

  const handleDeleteBacktest = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this backtest result?")) {
      await deleteBacktestResult(id);
      // If the deleted result was the current one, clear the view
      if (currentBacktest && currentBacktest.id === id) {
        setCurrentBacktest(null);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const exportToCSV = () => {
    try {
      const currentMetrics = {
        "Metrics": "Values",
        "Total Trades": currentBacktest?.metrics.totalTrades || metrics.totalTrades,
        "Win Rate (%)": currentBacktest?.metrics.winRate || metrics.winRatio,
        "Average Profit": currentBacktest?.metrics.avgProfit || metrics.avgProfitPerDay,
        "Max Drawdown": currentBacktest?.metrics.maxDrawdown || metrics.maxDrawdown,
        "Sharpe Ratio": currentBacktest?.metrics.sharpeRatio || metrics.sharpeRatio,
        "CAGR (%)": currentBacktest?.metrics.cagr || metrics.cagr,
        "Calmer Ratio": currentBacktest?.metrics.calmerRatio || metrics.calmerRatio,
        "Winning Streak": currentBacktest?.metrics.winningStreak || metrics.winningStreak,
        "Loss Streak": currentBacktest?.metrics.lossStreak || metrics.lossStreak,
      };
      
      // Convert metrics to CSV
      let metricsCSV = Object.entries(currentMetrics)
        .map(([key, value]) => `${key},${value}`)
        .join('\n');
      
      // Convert daily data to CSV
      const dailyHeaders = "Date,Profit,Trades,Win Rate\n";
      const dailyRows = dailyData.map(d => 
        `${d.date},${d.profit},${d.trades},${d.winRate}`
      ).join('\n');
      const dailyCSV = dailyHeaders + dailyRows;
      
      // Combine all into a single CSV
      const combinedCSV = "METRICS\n" + metricsCSV + "\n\nDAILY PERFORMANCE\n" + dailyCSV;
      
      // Create blob and download
      const blob = new Blob([combinedCSV], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `backtest-${currentBacktest?.title || 'report'}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Report exported successfully");
    } catch (error) {
      console.error("Error exporting report:", error);
      toast.error("Failed to export report");
    }
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
            <div className="flex flex-col space-y-3 w-full items-center">
              <Button onClick={triggerFileInput} className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Select CSV File
              </Button>
              
              {backtestResults.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={() => setLoadDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Load Saved Backtest
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">
                  {currentBacktest ? currentBacktest.title : "Current Backtest"}
                </h2>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSaveDialogOpen(true)}
                    className="text-xs"
                  >
                    <Save className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={exportToCSV}
                    className="text-xs"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                  {currentBacktest && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteBacktest(currentBacktest.id)}
                      className="text-xs text-red-500 hover:text-red-400"
                    >
                      <Trash className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  )}
                </div>
              </div>
              
              {currentBacktest?.description && (
                <p className="text-charcoalTextSecondary text-sm">
                  {currentBacktest.description}
                </p>
              )}

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
            </section>
          </>
        )}
      </main>
      
      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Backtest Result</DialogTitle>
            <DialogDescription>
              Save your backtest result to access it later.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...saveForm}>
            <form onSubmit={saveForm.handleSubmit(handleSaveBacktest)} className="space-y-4">
              <FormField
                control={saveForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="NIFTY Options Strategy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={saveForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Short description of this backtest..."
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setSaveDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Backtest</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Load Saved Backtest Dialog */}
      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Load Saved Backtest</DialogTitle>
            <DialogDescription>
              Select a previously saved backtest result to load.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {backtestResults.length === 0 ? (
              <p className="text-center text-gray-400">No saved backtest results found.</p>
            ) : (
              backtestResults.map((result) => (
                <div 
                  key={result.id}
                  className="p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-cyan/50 cursor-pointer transition-colors"
                  onClick={() => loadBacktestResult(result)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-white">{result.title}</h4>
                      <p className="text-xs text-gray-400">
                        {new Date(result.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBacktest(result.id);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  {result.description && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                      {result.description}
                    </p>
                  )}
                  <div className="flex space-x-4 mt-2 text-xs">
                    <span className="text-cyan">Win Rate: {result.metrics.winRate}%</span>
                    <span className="text-green-400">Trades: {result.metrics.totalTrades}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setLoadDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
