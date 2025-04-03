import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ChevronLeft,
  BarChart3,
  TableIcon,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Info,
  ArrowRight
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { useZenflowBacktestResults, getStrategyDisplayName } from '@/hooks/strategy/useZenflowBacktestResults';
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-charcoalSecondary p-3 rounded-lg border border-gray-700 shadow-xl">
        <p className="text-cyan font-medium mb-1">{`Year: ${data.year}`}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <p className={`text-white ${data.Jan > 0 ? 'text-green-500' : data.Jan < 0 ? 'text-red-500' : ''}`}>
            <span className="text-gray-400">Jan:</span> {data.Jan?.toLocaleString()}
          </p>
          <p className={`text-white ${data.Feb > 0 ? 'text-green-500' : data.Feb < 0 ? 'text-red-500' : ''}`}>
            <span className="text-gray-400">Feb:</span> {data.Feb?.toLocaleString()}
          </p>
          <p className={`text-white ${data.Mar > 0 ? 'text-green-500' : data.Mar < 0 ? 'text-red-500' : ''}`}>
            <span className="text-gray-400">Mar:</span> {data.Mar?.toLocaleString()}
          </p>
          <p className={`text-white ${data.Apr > 0 ? 'text-green-500' : data.Apr < 0 ? 'text-red-500' : ''}`}>
            <span className="text-gray-400">Apr:</span> {data.Apr?.toLocaleString()}
          </p>
          <p className={`text-white ${data.May > 0 ? 'text-green-500' : data.May < 0 ? 'text-red-500' : ''}`}>
            <span className="text-gray-400">May:</span> {data.May?.toLocaleString()}
          </p>
          <p className={`text-white ${data.Jun > 0 ? 'text-green-500' : data.Jun < 0 ? 'text-red-500' : ''}`}>
            <span className="text-gray-400">Jun:</span> {data.Jun?.toLocaleString()}
          </p>
          <p className={`text-white ${data.Jul > 0 ? 'text-green-500' : data.Jul < 0 ? 'text-red-500' : ''}`}>
            <span className="text-gray-400">Jul:</span> {data.Jul?.toLocaleString()}
          </p>
          <p className={`text-white ${data.Aug > 0 ? 'text-green-500' : data.Aug < 0 ? 'text-red-500' : ''}`}>
            <span className="text-gray-400">Aug:</span> {data.Aug?.toLocaleString()}
          </p>
          <p className={`text-white ${data.Sep > 0 ? 'text-green-500' : data.Sep < 0 ? 'text-red-500' : ''}`}>
            <span className="text-gray-400">Sep:</span> {data.Sep?.toLocaleString()}
          </p>
          <p className={`text-white ${data.Oct > 0 ? 'text-green-500' : data.Oct < 0 ? 'text-red-500' : ''}`}>
            <span className="text-gray-400">Oct:</span> {data.Oct?.toLocaleString()}
          </p>
          <p className={`text-white ${data.Nov > 0 ? 'text-green-500' : data.Nov < 0 ? 'text-red-500' : ''}`}>
            <span className="text-gray-400">Nov:</span> {data.Nov?.toLocaleString()}
          </p>
          <p className={`text-white ${data.Dec > 0 ? 'text-green-500' : data.Dec < 0 ? 'text-red-500' : ''}`}>
            <span className="text-gray-400">Dec:</span> {data.Dec?.toLocaleString()}
          </p>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-700">
          <p className={`font-medium ${data.Total > 0 ? 'text-green-500' : data.Total < 0 ? 'text-red-500' : 'text-white'}`}>
            <span className="text-cyan">Total:</span> {data.Total?.toLocaleString()}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const formatYAxisTick = (value: number): string => {
  if (Math.abs(value) >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
};

const StatCard = ({ label, value, percentValue, isNegative, tooltip }: { 
  label: string;
  value: string | number;
  percentValue?: string | number;
  isNegative?: boolean;
  tooltip?: string;
}) => {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) || 0 : value;
  const numPercentValue = percentValue !== undefined 
    ? (typeof percentValue === 'string' ? parseFloat(percentValue.replace(/[^\d.-]/g, '')) || 0 : percentValue)
    : 0;
    
  return (
    <div className="flex items-center justify-between border-b border-gray-700/50 py-2 last:border-b-0">
      <div className="flex items-center">
        <span className="text-gray-400 text-sm">{label}</span>
        {tooltip && (
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 ml-1 text-gray-500" />
              </TooltipTrigger>
              <TooltipContent className="bg-charcoalPrimary border-gray-700 text-xs">
                {tooltip}
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="flex items-center">
        <p className={`font-semibold ${numValue > 0 ? (isNegative ? 'text-red-500' : 'text-green-500') : numValue < 0 ? (isNegative ? 'text-green-500' : 'text-red-500') : ''} text-right`}>
          {value}
        </p>
        {percentValue !== undefined && (
          <p className={`text-sm ml-2 ${numPercentValue > 0 ? (isNegative ? 'text-red-400' : 'text-green-400') : numPercentValue < 0 ? (isNegative ? 'text-green-400' : 'text-red-400') : ''}`}>
            ({percentValue}%)
          </p>
        )}
      </div>
    </div>
  );
};

const ZenflowBacktestReport = () => {
  const [searchParams] = useSearchParams();
  const strategyParam = searchParams.get('strategy') as 'zenflow' | 'velox' | 'nova' | 'evercrest' | 'apexflow' || 'zenflow';
  
  const { 
    strategyData, 
    metrics,
    loading, 
    error,
    fetchZenflowBacktestResults,
    strategyType
  } = useZenflowBacktestResults(strategyParam);

  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [activeTab, setActiveTab] = useState<string>('annual');
  const [currentSection, setCurrentSection] = useState<'overview' | 'keyMetrics' | 'detailed'>('overview');
  
  useEffect(() => {
    fetchZenflowBacktestResults();
    console.log("Component mounted, fetching data for strategy:", strategyParam);
    
    const refreshInterval = setInterval(() => {
      fetchZenflowBacktestResults();
      console.log("Refreshing data for strategy:", strategyParam);
    }, 30000);
    
    return () => clearInterval(refreshInterval);
  }, [strategyParam]);

  const handleRefresh = () => {
    fetchZenflowBacktestResults();
    toast.success(`${getStrategyDisplayName(strategyType)} data refreshed`);
  };

  const handleNextSection = () => {
    if (currentSection === 'overview') {
      setCurrentSection('keyMetrics');
    } else if (currentSection === 'keyMetrics') {
      setCurrentSection('detailed');
      setActiveTab('details');
    } else {
      setCurrentSection('overview');
      setActiveTab('annual');
    }
  };

  const prepareChartData = () => {
    console.log("Preparing chart data from strategy data:", strategyData);
    return strategyData.map(year => ({
      year: year.year,
      Jan: year.jan || 0,
      Feb: year.feb || 0,
      Mar: year.mar || 0,
      Apr: year.apr || 0,
      May: year.may || 0,
      Jun: year.jun || 0,
      Jul: year.jul || 0,
      Aug: year.aug || 0,
      Sep: year.sep || 0,
      Oct: year.oct || 0,
      Nov: year.nov || 0,
      Dec: year.dec || 0,
      Total: year.total || 0
    }));
  };

  const prepareMetricsData = () => {
    return [
      {
        name: "Win Rate",
        value: metrics.win_percentage || 0,
        color: "#4CAF50"
      },
      {
        name: "Loss Rate",
        value: metrics.loss_percentage || 0,
        color: "#F44336"
      },
      {
        name: "Profit %",
        value: metrics.overall_profit_percentage || 0,
        color: "#2196F3"
      },
      {
        name: "Drawdown %",
        value: Math.abs(metrics.max_drawdown_percentage || 0),
        color: "#FF9800"
      },
      {
        name: "Reward/Risk",
        value: metrics.reward_to_risk_ratio || 0,
        color: "#9C27B0"
      },
      {
        name: "Return/MaxDD",
        value: metrics.return_max_dd || 0,
        color: "#00BCD4"
      }
    ];
  };

  const getValueClass = (value: number | undefined) => {
    if (value === undefined || value === null) return "";
    return value > 0 ? "text-green-500" : value < 0 ? "text-red-500" : "";
  };

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return 'N/A';
    return `₹${Math.abs(value).toLocaleString('en-IN')}`;
  };

  const isEmptyMetrics = strategyType === 'velox' && 
    (!metrics || Object.keys(metrics).length === 0 || !metrics.overall_profit);

  const getStrategyColor = () => {
    switch (strategyType) {
      case 'nova':
        return "#a855f7";
      case 'velox':
        return "#3b82f6";
      case 'evercrest':
        return "#10b981";
      case 'apexflow':
        return "#f59e0b";
      case 'zenflow':
      default:
        return "#00BCD4";
    }
  };

  return (
    <div className="bg-charcoalPrimary min-h-screen">
      <header className="fixed top-0 left-0 right-0 bg-charcoalPrimary/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Link to="/zenflow-backtest" className="p-2">
            <ChevronLeft className="h-5 w-5 text-charcoalTextSecondary" />
          </Link>
          <h1 className="text-charcoalTextPrimary text-lg font-medium">
            {getStrategyDisplayName(strategyType)} Report
          </h1>
          <div className="w-8"></div>
        </div>
      </header>

      <main className="pt-16 pb-20 px-4">
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <TabsList className="bg-charcoalSecondary/50">
              <TabsTrigger value="annual">Performance Analysis</TabsTrigger>
              <TabsTrigger value="details">Detailed Metrics</TabsTrigger>
            </TabsList>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          <TabsContent value="annual" className="space-y-5">
            {currentSection === 'overview' && (
              <>
                <div className="mt-2 mb-4 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-white">
                    Annual Performance
                    {strategyType === 'nova' && <span className="ml-2 text-sm text-cyan">(Nova Glide Strategy)</span>}
                  </h2>
                  <div className="flex space-x-2">
                    <Button 
                      variant={viewMode === 'table' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setViewMode('table')}
                      className="flex items-center gap-1"
                    >
                      <TableIcon className="h-4 w-4" />
                      Table
                    </Button>
                    <Button 
                      variant={viewMode === 'chart' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setViewMode('chart')}
                      className="flex items-center gap-1"
                    >
                      <BarChart3 className="h-4 w-4" />
                      Chart
                    </Button>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan"></div>
                  </div>
                ) : strategyData.length === 0 ? (
                  <div className="text-center p-8 bg-charcoalSecondary/50 rounded-xl">
                    <p className="text-charcoalTextSecondary">No backtest data available.</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleRefresh}
                      className="mt-4"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : viewMode === 'table' ? (
                  <div className="overflow-x-auto rounded-xl bg-charcoalSecondary/50">
                    <Table className="w-full text-sm">
                      <TableHeader>
                        <TableRow className="border-b border-gray-700">
                          <TableHead className="text-charcoalTextSecondary font-medium">Year</TableHead>
                          <TableHead className="text-charcoalTextSecondary font-medium">Jan</TableHead>
                          <TableHead className="text-charcoalTextSecondary font-medium">Feb</TableHead>
                          <TableHead className="text-charcoalTextSecondary font-medium">Mar</TableHead>
                          <TableHead className="text-charcoalTextSecondary font-medium">Apr</TableHead>
                          <TableHead className="text-charcoalTextSecondary font-medium">May</TableHead>
                          <TableHead className="text-charcoalTextSecondary font-medium">Jun</TableHead>
                          <TableHead className="text-charcoalTextSecondary font-medium">Jul</TableHead>
                          <TableHead className="text-charcoalTextSecondary font-medium">Aug</TableHead>
                          <TableHead className="text-charcoalTextSecondary font-medium">Sep</TableHead>
                          <TableHead className="text-charcoalTextSecondary font-medium">Oct</TableHead>
                          <TableHead className="text-charcoalTextSecondary font-medium">Nov</TableHead>
                          <TableHead className="text-charcoalTextSecondary font-medium">Dec</TableHead>
                          <TableHead className="text-charcoalTextSecondary font-medium">Total</TableHead>
                          <TableHead className="text-charcoalTextSecondary font-medium">Max Drawdown</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {strategyData.map((row) => (
                          <TableRow key={row.id} className="border-b border-gray-700/50">
                            <TableCell className="font-medium text-white">{row.year}</TableCell>
                            <TableCell className={getValueClass(row.jan)}>{row.jan}</TableCell>
                            <TableCell className={getValueClass(row.feb)}>{row.feb}</TableCell>
                            <TableCell className={getValueClass(row.mar)}>{row.mar}</TableCell>
                            <TableCell className={getValueClass(row.apr)}>{row.apr}</TableCell>
                            <TableCell className={getValueClass(row.may)}>{row.may}</TableCell>
                            <TableCell className={getValueClass(row.jun)}>{row.jun}</TableCell>
                            <TableCell className={getValueClass(row.jul)}>{row.jul}</TableCell>
                            <TableCell className={getValueClass(row.aug)}>{row.aug}</TableCell>
                            <TableCell className={getValueClass(row.sep)}>{row.sep}</TableCell>
                            <TableCell className={getValueClass(row.oct)}>{row.oct}</TableCell>
                            <TableCell className={getValueClass(row.nov)}>{row.nov}</TableCell>
                            <TableCell className={getValueClass(row.dec)}>{row.dec}</TableCell>
                            <TableCell className={`font-medium ${getValueClass(row.total)}`}>
                              {row.total}
                            </TableCell>
                            <TableCell className="text-red-500 font-medium">
                              {row.max_drawdown}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="bg-charcoalSecondary/50 rounded-xl p-4 h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={prepareChartData()}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 12,
                          bottom: 20,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis 
                          dataKey="year" 
                          stroke="#888" 
                          tick={{ fill: '#B0B0B0' }}
                          axisLine={{ stroke: '#555' }}
                          tickLine={{ stroke: '#555' }}
                        />
                        <YAxis 
                          stroke="#888" 
                          tick={{ fill: '#B0B0B0', fontSize: 11 }}
                          axisLine={{ stroke: '#555' }}
                          tickLine={{ stroke: '#555' }}
                          tickFormatter={formatYAxisTick}
                          width={45}
                          padding={{ top: 15, bottom: 15 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                          verticalAlign="top" 
                          height={36} 
                          wrapperStyle={{
                            paddingTop: "10px",
                            paddingBottom: "10px",
                            fontSize: "12px"
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="Total"
                          name="Total"
                          stroke={getStrategyColor()}
                          strokeWidth={3}
                          dot={{ r: 6, fill: getStrategyColor(), stroke: getStrategyColor() }}
                          activeDot={{ r: 8, stroke: getStrategyColor(), strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
                
                <div className="flex justify-end mt-4">
                  <Button 
                    onClick={handleNextSection}
                    className="flex items-center gap-2"
                  >
                    <span>Key Performance Metrics</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}

            {currentSection === 'keyMetrics' && (
              <>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-white">Key Performance Metrics</h2>
                  <p className="text-sm text-gray-400">Summary of metrics from the {getStrategyDisplayName(strategyType)} backtest</p>
                </div>
                
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan"></div>
                  </div>
                ) : isEmptyMetrics ? (
                  <div className="text-center p-8 bg-charcoalSecondary/50 rounded-xl">
                    <p className="text-charcoalTextSecondary">No metrics data available for {getStrategyDisplayName(strategyType)}.</p>
                    <p className="text-charcoalTextSecondary mt-2">Use the Update button on the Velox Edge Data page to retrieve metrics.</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleRefresh}
                      className="mt-4"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <Card className="bg-charcoalSecondary/50 border-gray-700 overflow-hidden">
                      <CardHeader className="pb-2 border-b border-gray-700/50">
                        <CardTitle className="text-lg text-white">Performance Summary</CardTitle>
                        <CardDescription>Key metrics at a glance</CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="p-4 space-y-1">
                          <StatCard 
                            label="Win %" 
                            value={metrics.win_percentage || 'N/A'} 
                            tooltip="Percentage of trades that resulted in profit"
                          />
                          <StatCard 
                            label="Overall Profit" 
                            value={formatCurrency(metrics.overall_profit)}
                            percentValue={metrics.overall_profit_percentage}
                            tooltip="Total profit generated" 
                          />
                          <StatCard 
                            label="Max Drawdown" 
                            value={formatCurrency(Math.abs(metrics.max_drawdown || 0))}
                            percentValue={Math.abs(metrics.max_drawdown_percentage || 0)}
                            isNegative
                            tooltip="Maximum peak-to-trough decline"
                          />
                          <StatCard 
                            label="No. of Trades" 
                            value={metrics.number_of_trades || 'N/A'}
                            tooltip="Total number of trades executed"
                          />
                          <StatCard 
                            label="Avg. Profit per Trade" 
                            value={formatCurrency(metrics.avg_profit_per_trade)}
                            percentValue={metrics.avg_profit_per_trade_percentage}
                            tooltip="Average profit per trade across all trades"
                          />
                          <StatCard 
                            label="Reward to Risk Ratio" 
                            value={metrics.reward_to_risk_ratio || 'N/A'}
                            tooltip="Ratio of average profit to average loss"
                          />
                          <StatCard 
                            label="Return/MaxDD" 
                            value={metrics.return_max_dd || 'N/A'}
                            tooltip="Overall return divided by maximum drawdown"
                          />
                          <StatCard 
                            label="Max Win Streak" 
                            value={metrics.max_win_streak || 'N/A'}
                            tooltip="Longest consecutive winning trades"
                          />
                          <StatCard 
                            label="Max Loss Streak" 
                            value={metrics.max_losing_streak || 'N/A'}
                            tooltip="Longest consecutive losing trades"
                          />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="flex justify-end mt-4">
                      <Button 
                        onClick={handleNextSection}
                        className="flex items-center gap-2"
                      >
                        <span>Detailed Metrics</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <div className="mt-2 mb-4">
              <h2 className="text-lg font-semibold text-white">Detailed Performance Metrics</h2>
              <p className="text-sm text-gray-400">Comprehensive analysis of {getStrategyDisplayName(strategyType)} results</p>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan"></div>
              </div>
            ) : isEmptyMetrics ? (
              <div className="text-center p-8 bg-charcoalSecondary/50 rounded-xl">
                <p className="text-charcoalTextSecondary">No metrics data available for {getStrategyDisplayName(strategyType)}.</p>
                <p className="text-charcoalTextSecondary mt-2">Use the Update button on the Velox Edge Data page to retrieve metrics.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                  className="mt-4"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <StatCard 
                    label="Overall Profit" 
                    value={formatCurrency(metrics.overall_profit)}
                    percentValue={metrics.overall_profit_percentage}
                    tooltip="Total profit generated over the entire backtest period" 
                  />
                  <StatCard 
                    label="No. of Trades" 
                    value={metrics.number_of_trades || 'N/A'}
                    tooltip="Total number of trades executed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <StatCard 
                    label="Win %" 
                    value={metrics.win_percentage || 'N/A'} 
                    tooltip="Percentage of trades that resulted in profit"
                  />
                  <StatCard 
                    label="Loss %" 
                    value={metrics.loss_percentage || 'N/A'} 
                    isNegative
                    tooltip="Percentage of trades that resulted in loss"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <StatCard 
                    label="Avg. Profit per Trade" 
                    value={formatCurrency(metrics.avg_profit_per_trade)}
                    percentValue={metrics.avg_profit_per_trade_percentage}
                    tooltip="Average profit per trade across all trades"
                  />
                  <StatCard 
                    label="Max Profit in Single Trade" 
                    value={formatCurrency(metrics.max_profit_in_single_trade)}
                    percentValue={metrics.max_profit_in_single_trade_percentage}
                    tooltip="Largest profit made in a single trade"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <StatCard 
                    label="Avg. Profit on Winning Trades" 
                    value={formatCurrency(metrics.avg_profit_on_winning_trades)}
                    percentValue={metrics.avg_profit_on_winning_trades_percentage}
                    tooltip="Average profit from profitable trades"
                  />
                  <StatCard 
                    label="Avg. Loss on Losing Trades" 
                    value={formatCurrency(Math.abs(metrics.avg_loss_on_losing_trades || 0))}
                    percentValue={Math.abs(metrics.avg_loss_on_losing_trades_percentage || 0)}
                    isNegative
                    tooltip="Average loss from unprofitable trades"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <StatCard 
                    label="Max Loss in Single Trade" 
                    value={formatCurrency(Math.abs(metrics.max_loss_in_single_trade || 0))}
                    percentValue={Math.abs(metrics.max_loss_in_single_trade_percentage || 0)}
                    isNegative
                    tooltip="Largest loss in a single trade"
                  />
                  <StatCard 
                    label="Max Drawdown" 
                    value={formatCurrency(Math.abs(metrics.max_drawdown || 0))}
                    percentValue={Math.abs(metrics.max_drawdown_percentage || 0)}
                    isNegative
                    tooltip="Maximum peak-to-trough decline during the backtesting period"
                  />
                </div>

                <div className="mt-4">
                  <h3 className="text-md font-medium text-white mb-3">Additional Statistics</h3>
                  <div className="bg-charcoalSecondary/30 rounded-xl border border-gray-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-700">
                      <div className="p-3 space-y-3">
                        <div>
                          <p className="text-xs text-gray-400">Duration of Max Drawdown</p>
                          <p className="text-sm text-white">{metrics.drawdown_duration || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Return/MaxDD</p>
                          <p className="text-sm text-white">{metrics.return_max_dd || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Reward to Risk Ratio</p>
                          <p className="text-sm text-white">{metrics.reward_to_risk_ratio || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="p-3 space-y-3">
                        <div>
                          <p className="text-xs text-gray-400">Max Win Streak</p>
                          <p className="text-sm text-white">{metrics.max_win_streak || 'N/A'} trades</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Max Losing Streak</p>
                          <p className="text-sm text-white">{metrics.max_losing_streak || 'N/A'} trades</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Expectancy Ratio</p>
                          <p className="text-sm text-white">{metrics.expectancy_ratio || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {metrics.created_at && (
                  <div className="mt-4 text-right text-xs text-gray-500">
                    Last updated: {new Date(metrics.updated_at || metrics.created_at || '').toLocaleString()}
                  </div>
                )}
                
                <div className="flex justify-end mt-4">
                  <Button 
                    onClick={handleNextSection}
                    className="flex items-center gap-2"
                  >
                    <span>Back to Overview</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default ZenflowBacktestReport;
