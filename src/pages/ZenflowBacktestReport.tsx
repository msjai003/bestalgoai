
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ChevronLeft,
  BarChart3,
  TableIcon,
  RefreshCw
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { useZenflowBacktestResults } from '@/hooks/strategy/useZenflowBacktestResults';
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const ZenflowBacktestReport = () => {
  const { 
    strategyData, 
    loading, 
    error,
    fetchZenflowBacktestResults
  } = useZenflowBacktestResults();

  const [viewMode, setViewMode] = useState<'chart' | 'table'>('table');
  
  useEffect(() => {
    // Refresh data when component mounts
    fetchZenflowBacktestResults();
    console.log("Component mounted, fetching data...");
  }, []);

  const handleRefresh = () => {
    fetchZenflowBacktestResults();
    toast.success("Data refreshed");
  };

  // Prepare chart data
  const prepareChartData = () => {
    // Transform the data for the line chart
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

  // Determine if a number is positive, negative, or zero
  const getValueClass = (value: number | undefined) => {
    if (value === undefined || value === null) return "";
    return value > 0 ? "text-green-500" : value < 0 ? "text-red-500" : "";
  };

  // Chart configuration with cyan colors
  const chartConfig = {
    total: { label: "Total Return", color: "#00BCD4" }, // Cyan color
    jan: { label: "January", color: "#4DD0E1" },
    feb: { label: "February", color: "#26C6DA" },
    mar: { label: "March", color: "#00ACC1" },
    apr: { label: "April", color: "#0097A7" },
    may: { label: "May", color: "#00838F" },
    jun: { label: "June", color: "#006064" },
    jul: { label: "July", color: "#80DEEA" },
    aug: { label: "August", color: "#4DD0E1" },
    sep: { label: "September", color: "#26C6DA" },
    oct: { label: "October", color: "#00ACC1" },
    nov: { label: "November", color: "#0097A7" },
    dec: { label: "December", color: "#00838F" }
  };

  return (
    <div className="bg-charcoalPrimary min-h-screen">
      <header className="fixed top-0 left-0 right-0 bg-charcoalPrimary/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Link to="/zenflow-backtest" className="p-2">
            <ChevronLeft className="h-5 w-5 text-charcoalTextSecondary" />
          </Link>
          <h1 className="text-charcoalTextPrimary text-lg font-medium">Strategy Backtest Report</h1>
          <div className="w-8"></div>
        </div>
      </header>

      <main className="pt-16 pb-20 px-4">
        <div className="mt-4 mb-6 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Zenflow Strategy Performance</h2>
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
          <ChartContainer 
            config={chartConfig}
            className="bg-charcoalSecondary/50 rounded-xl p-4 h-[500px]"
          >
            <LineChart
              data={prepareChartData()}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
              <XAxis 
                dataKey="year" 
                stroke="#888" 
                tick={{ fill: '#B0B0B0' }}
                axisLine={{ stroke: '#555' }}
                tickLine={{ stroke: '#555' }}
              />
              <YAxis 
                stroke="#888" 
                tick={{ fill: '#B0B0B0' }}
                axisLine={{ stroke: '#555' }}
                tickLine={{ stroke: '#555' }}
                width={40}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
              />
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
                stroke="#00BCD4"
                strokeWidth={3}
                dot={{ r: 4, fill: "#00BCD4", stroke: "#00BCD4" }}
                activeDot={{ r: 6, stroke: "#00BCD4", strokeWidth: 2 }}
              />
              <Line type="monotone" dataKey="Jan" name="Jan" stroke="#4DD0E1" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="Feb" name="Feb" stroke="#26C6DA" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="Mar" name="Mar" stroke="#00ACC1" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="Apr" name="Apr" stroke="#0097A7" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="May" name="May" stroke="#00838F" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="Jun" name="Jun" stroke="#006064" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="Jul" name="Jul" stroke="#80DEEA" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="Aug" name="Aug" stroke="#4DD0E1" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="Sep" name="Sep" stroke="#26C6DA" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="Oct" name="Oct" stroke="#00ACC1" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="Nov" name="Nov" stroke="#0097A7" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="Dec" name="Dec" stroke="#00838F" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ChartContainer>
        )}
      </main>
      
      <BottomNav />
    </div>
  );
};

export default ZenflowBacktestReport;
