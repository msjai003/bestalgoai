
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
  ArrowRight,
  MoreVertical
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
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [currentSection, setCurrentSection] = useState<'overview' | 'details'>('overview');
  
  useEffect(() => {
    fetchZenflowBacktestResults();
    console.log("Component mounted, fetching data for strategy:", strategyParam);
    
    const refreshInterval = setInterval(() => {
      fetchZenflowBacktestResults();
    }, 30000);
    
    return () => clearInterval(refreshInterval);
  }, [strategyParam]);

  const handleRefresh = () => {
    fetchZenflowBacktestResults();
    toast.success(`${getStrategyDisplayName(strategyType)} data refreshed`);
  };

  const prepareChartData = () => {
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

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return 'N/A';
    return `₹${Math.abs(value).toLocaleString('en-IN')}`;
  };

  const isEmptyMetrics = !metrics || Object.keys(metrics).length === 0 || !metrics.overall_profit;

  const getStrategyColor = () => {
    switch (strategyType) {
      case 'nova':
        return "#a855f7";  // Purple
      case 'velox':
        return "#3b82f6";  // Blue
      case 'evercrest':
        return "#10b981";  // Green
      case 'apexflow':
        return "#f59e0b";  // Amber
      case 'zenflow':
      default:
        return "#00BCD4";  // Cyan
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
          <div className="w-8">
            <Button variant="ghost" size="icon" className="text-gray-400">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-16 pb-20 px-4">
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <TabsList className="bg-charcoalSecondary/50">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
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

          <TabsContent value="overview" className="space-y-5">
            {/* Unified Stats Card */}
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan"></div>
              </div>
            ) : (
              <Card className="bg-charcoalSecondary/40 border border-gray-700 overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-5 space-y-6">
                    {/* Key Metrics in a single frame */}
                    <div>
                      {/* Win % */}
                      <div className="mb-4">
                        <div className="flex items-center mb-1">
                          <p className="text-gray-400 text-sm">Win %</p>
                          <TooltipProvider>
                            <UITooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3.5 w-3.5 ml-1 text-gray-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                Percentage of trades that resulted in profit
                              </TooltipContent>
                            </UITooltip>
                          </TooltipProvider>
                        </div>
                        <p className="text-green-500 text-3xl font-bold">
                          {metrics.win_percentage?.toFixed(2) || 'N/A'}
                        </p>
                      </div>
                      
                      {/* Overall Profit */}
                      <div className="mb-4">
                        <div className="flex items-center mb-1">
                          <p className="text-gray-400 text-sm">Overall Profit</p>
                          <TooltipProvider>
                            <UITooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3.5 w-3.5 ml-1 text-gray-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                Total profit generated over the backtest period
                              </TooltipContent>
                            </UITooltip>
                          </TooltipProvider>
                        </div>
                        <div className="flex items-baseline">
                          <p className="text-green-500 text-3xl font-bold">
                            {formatCurrency(metrics.overall_profit)}
                          </p>
                          <span className="text-green-400 ml-2 text-lg">
                            ({metrics.overall_profit_percentage?.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                      
                      {/* Max Drawdown */}
                      <div className="mb-4">
                        <div className="flex items-center mb-1">
                          <p className="text-gray-400 text-sm">Max Drawdown</p>
                          <TooltipProvider>
                            <UITooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3.5 w-3.5 ml-1 text-gray-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                Maximum peak-to-trough decline
                              </TooltipContent>
                            </UITooltip>
                          </TooltipProvider>
                        </div>
                        <div className="flex items-baseline">
                          <p className="text-red-500 text-3xl font-bold">
                            {formatCurrency(Math.abs(metrics.max_drawdown || 0))}
                          </p>
                          <span className="text-red-400 ml-2 text-lg">
                            ({Math.abs(metrics.max_drawdown_percentage || 0).toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                      
                      {/* Number of Trades */}
                      <div>
                        <div className="flex items-center mb-1">
                          <p className="text-gray-400 text-sm">No. of Trades</p>
                          <TooltipProvider>
                            <UITooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3.5 w-3.5 ml-1 text-gray-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                Total number of trades executed
                              </TooltipContent>
                            </UITooltip>
                          </TooltipProvider>
                        </div>
                        <p className="text-green-500 text-3xl font-bold">
                          {metrics.number_of_trades || 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex items-center mb-3">
                        <h3 className="text-white text-lg font-medium">
                          Performance
                          <span className="text-cyan ml-2 text-sm">
                            ({getStrategyDisplayName(strategyType)})
                          </span>
                        </h3>
                        
                        <div className="ml-auto flex space-x-2">
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
                      
                      {strategyData.length === 0 ? (
                        <div className="text-center p-8 bg-charcoalSecondary/50 rounded-lg">
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
                        <div className="overflow-x-auto rounded-lg bg-charcoalSecondary/50">
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
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {strategyData.map((row) => (
                                <TableRow key={row.id} className="border-b border-gray-700/50">
                                  <TableCell className="font-medium text-white">{row.year}</TableCell>
                                  <TableCell className={row.jan && row.jan > 0 ? 'text-green-500' : row.jan && row.jan < 0 ? 'text-red-500' : ''}>
                                    {row.jan}
                                  </TableCell>
                                  <TableCell className={row.feb && row.feb > 0 ? 'text-green-500' : row.feb && row.feb < 0 ? 'text-red-500' : ''}>
                                    {row.feb}
                                  </TableCell>
                                  <TableCell className={row.mar && row.mar > 0 ? 'text-green-500' : row.mar && row.mar < 0 ? 'text-red-500' : ''}>
                                    {row.mar}
                                  </TableCell>
                                  <TableCell className={row.apr && row.apr > 0 ? 'text-green-500' : row.apr && row.apr < 0 ? 'text-red-500' : ''}>
                                    {row.apr}
                                  </TableCell>
                                  <TableCell className={row.may && row.may > 0 ? 'text-green-500' : row.may && row.may < 0 ? 'text-red-500' : ''}>
                                    {row.may}
                                  </TableCell>
                                  <TableCell className={row.jun && row.jun > 0 ? 'text-green-500' : row.jun && row.jun < 0 ? 'text-red-500' : ''}>
                                    {row.jun}
                                  </TableCell>
                                  <TableCell className={row.jul && row.jul > 0 ? 'text-green-500' : row.jul && row.jul < 0 ? 'text-red-500' : ''}>
                                    {row.jul}
                                  </TableCell>
                                  <TableCell className={row.aug && row.aug > 0 ? 'text-green-500' : row.aug && row.aug < 0 ? 'text-red-500' : ''}>
                                    {row.aug}
                                  </TableCell>
                                  <TableCell className={row.sep && row.sep > 0 ? 'text-green-500' : row.sep && row.sep < 0 ? 'text-red-500' : ''}>
                                    {row.sep}
                                  </TableCell>
                                  <TableCell className={row.oct && row.oct > 0 ? 'text-green-500' : row.oct && row.oct < 0 ? 'text-red-500' : ''}>
                                    {row.oct}
                                  </TableCell>
                                  <TableCell className={row.nov && row.nov > 0 ? 'text-green-500' : row.nov && row.nov < 0 ? 'text-red-500' : ''}>
                                    {row.nov}
                                  </TableCell>
                                  <TableCell className={row.dec && row.dec > 0 ? 'text-green-500' : row.dec && row.dec < 0 ? 'text-red-500' : ''}>
                                    {row.dec}
                                  </TableCell>
                                  <TableCell className={`font-medium ${row.total && row.total > 0 ? 'text-green-500' : row.total && row.total < 0 ? 'text-red-500' : ''}`}>
                                    {row.total}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="bg-charcoalSecondary/30 rounded-lg p-3 h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={prepareChartData()}
                              margin={{
                                top: 10,
                                right: 5,
                                left: 0,
                                bottom: 10,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                              <XAxis 
                                dataKey="year" 
                                stroke="#888" 
                                tick={{ fill: '#B0B0B0', fontSize: 12 }}
                                axisLine={{ stroke: '#555' }}
                                tickLine={{ stroke: '#555' }}
                              />
                              <YAxis 
                                stroke="#888" 
                                tick={{ fill: '#B0B0B0', fontSize: 12 }}
                                axisLine={{ stroke: '#555' }}
                                tickLine={{ stroke: '#555' }}
                                tickFormatter={formatYAxisTick}
                                width={45}
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Legend 
                                verticalAlign="top" 
                                height={24} 
                                wrapperStyle={{ fontSize: "12px" }}
                              />
                              <Line
                                type="monotone"
                                dataKey="Total"
                                name="Total"
                                stroke={getStrategyColor()}
                                strokeWidth={3}
                                dot={{ r: 5, fill: getStrategyColor(), stroke: getStrategyColor() }}
                                activeDot={{ r: 7, stroke: getStrategyColor(), strokeWidth: 2 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <Card className="bg-charcoalSecondary/40 border border-gray-700">
              <CardContent className="p-5">
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan"></div>
                  </div>
                ) : isEmptyMetrics ? (
                  <div className="text-center py-8">
                    <p className="text-charcoalTextSecondary">No metrics data available for {getStrategyDisplayName(strategyType)}.</p>
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
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-white text-lg font-medium mb-4">Performance Metrics</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Reward to Risk Ratio</p>
                          <p className="text-white text-xl font-medium">{metrics.reward_to_risk_ratio?.toFixed(2) || 'N/A'}</p>
                        </div>
                        
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Return/MaxDD</p>
                          <p className="text-white text-xl font-medium">{metrics.return_max_dd?.toFixed(2) || 'N/A'}</p>
                        </div>
                        
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Max Win Streak</p>
                          <p className="text-white text-xl font-medium">{metrics.max_win_streak || 'N/A'} trades</p>
                        </div>
                        
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Max Loss Streak</p>
                          <p className="text-white text-xl font-medium">{metrics.max_losing_streak || 'N/A'} trades</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-700 pt-4">
                      <h3 className="text-white text-lg font-medium mb-4">Trade Details</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Avg. Profit per Trade</p>
                          <div className="flex items-baseline">
                            <p className="text-white text-xl font-medium">{formatCurrency(metrics.avg_profit_per_trade)}</p>
                            <span className="text-gray-400 ml-1 text-xs">
                              ({metrics.avg_profit_per_trade_percentage?.toFixed(2)}%)
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Max Profit in Trade</p>
                          <div className="flex items-baseline">
                            <p className="text-green-500 text-xl font-medium">{formatCurrency(metrics.max_profit_in_single_trade)}</p>
                            <span className="text-green-400 ml-1 text-xs">
                              ({metrics.max_profit_in_single_trade_percentage?.toFixed(2)}%)
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Avg. Loss on Losing Trades</p>
                          <div className="flex items-baseline">
                            <p className="text-red-500 text-xl font-medium">{formatCurrency(Math.abs(metrics.avg_loss_on_losing_trades || 0))}</p>
                            <span className="text-red-400 ml-1 text-xs">
                              ({Math.abs(metrics.avg_loss_on_losing_trades_percentage || 0).toFixed(2)}%)
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Drawdown Duration</p>
                          <p className="text-white text-xl font-medium">{metrics.drawdown_duration || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    
                    {metrics.created_at && (
                      <div className="text-right text-xs text-gray-500 pt-2">
                        Last updated: {new Date(metrics.updated_at || metrics.created_at || '').toLocaleString()}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default ZenflowBacktestReport;
