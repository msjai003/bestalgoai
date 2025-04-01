
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DownloadCloud,
  RefreshCw,
  ChevronLeft,
  BarChart3
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { useZenflowBacktestResults } from '@/hooks/strategy/useZenflowBacktestResults';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

const ZenflowBacktestReport = () => {
  const { 
    zenflowResults, 
    loading, 
    error,
    fetchZenflowBacktestResults
  } = useZenflowBacktestResults();

  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    // Refresh data when component mounts
    fetchZenflowBacktestResults();
    console.log("Component mounted, fetching data...");
  }, []);

  useEffect(() => {
    console.log("Current zenflow results:", zenflowResults);
    
    // Transform data for chart when zenflowResults change
    if (zenflowResults && zenflowResults.length > 0) {
      const transformedData = zenflowResults.map((result, index) => {
        // Parse P/L value and convert to number
        let plValue = result["P/L"];
        if (typeof plValue === 'string') {
          plValue = parseFloat(plValue);
        }
        
        return {
          name: result["Entry-Date"] || `Trade ${index + 1}`,
          pl: plValue || 0,
          entryPrice: result["Entry-Price"] || 0,
          exitPrice: result["ExitPrice"] || 0,
        };
      });
      
      setChartData(transformedData);
    }
  }, [zenflowResults]);

  const handleRefresh = () => {
    fetchZenflowBacktestResults();
    toast.success("Data refreshed");
  };

  const exportToCSV = () => {
    try {
      if (zenflowResults.length === 0) {
        toast.error("No data to export");
        return;
      }
      
      // Get headers from the first result
      const firstResult = zenflowResults[0];
      const headers = Object.keys(firstResult).join(',');
      
      // Map each result to CSV row
      const csvRows = zenflowResults.map(result => {
        return Object.values(result).map(value => {
          // Handle values that need quotes (contain commas, quotes, or newlines)
          if (value === null || value === undefined) {
            return '';
          }
          
          const valueStr = String(value);
          if (valueStr.includes(',') || valueStr.includes('"') || valueStr.includes('\n')) {
            return `"${valueStr.replace(/"/g, '""')}"`;
          }
          return valueStr;
        }).join(',');
      });
      
      // Combine headers and rows
      const csvContent = [headers, ...csvRows].join('\n');
      
      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `zenflow-backtest-report-${new Date().toISOString().split('T')[0]}.csv`);
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

  const toggleViewMode = () => {
    setViewMode(viewMode === 'chart' ? 'table' : 'chart');
  };

  // Find min and max P/L values for chart domain
  const minPL = chartData.length > 0 ? Math.min(...chartData.map(d => d.pl)) : 0;
  const maxPL = chartData.length > 0 ? Math.max(...chartData.map(d => d.pl)) : 0;
  // Add 10% padding to the domain
  const domainPadding = Math.max(Math.abs(minPL), Math.abs(maxPL)) * 0.1;

  return (
    <div className="bg-charcoalPrimary min-h-screen">
      <header className="fixed top-0 left-0 right-0 bg-charcoalPrimary/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Link to="/backtest" className="p-2">
            <ChevronLeft className="h-5 w-5 text-charcoalTextSecondary" />
          </Link>
          <h1 className="text-charcoalTextPrimary text-lg font-medium">Zenflow Backtest Report</h1>
          <div className="w-8"></div>
        </div>
      </header>

      <main className="pt-16 pb-20 px-4">
        <div className="mt-4 mb-6 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Zenflow Backtest Data</h2>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleViewMode}
              className="flex items-center gap-1"
            >
              <BarChart3 className="h-4 w-4" />
              {viewMode === 'chart' ? 'View Table' : 'View Chart'}
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
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportToCSV}
              className="flex items-center gap-1"
            >
              <DownloadCloud className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan"></div>
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-charcoalSecondary/50 rounded-xl">
            <p className="text-charcoalDanger">Error loading data: {error.message}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : zenflowResults.length === 0 ? (
          <div className="text-center p-8 bg-charcoalSecondary/50 rounded-xl">
            <p className="text-charcoalTextSecondary">No Zenflow backtest data available.</p>
            <p className="text-charcoalTextSecondary mt-2">Please make sure data is present in the Zenflow_backtest table.</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="mt-4"
            >
              Refresh Data
            </Button>
          </div>
        ) : (
          <>
            {viewMode === 'chart' ? (
              <div className="bg-charcoalSecondary/30 p-4 rounded-lg border border-gray-700 h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 10,
                      bottom: 10,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#aaa', fontSize: 12 }}
                      stroke="#555"
                    />
                    <YAxis 
                      domain={[Math.min(minPL - domainPadding, 0), Math.max(maxPL + domainPadding, 0)]}
                      tick={{ fill: '#aaa', fontSize: 12 }}
                      stroke="#555"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #333',
                        borderRadius: '4px',
                        color: '#eee'
                      }} 
                    />
                    <ReferenceLine y={0} stroke="#555" />
                    <Line 
                      type="monotone" 
                      dataKey="pl" 
                      name="P/L"
                      stroke="#1EAEDB" // Cyan color
                      strokeWidth={3}
                      dot={{ 
                        stroke: '#1EAEDB', 
                        strokeWidth: 2, 
                        fill: '#111', 
                        r: 4 
                      }}
                      activeDot={{ 
                        stroke: '#1EAEDB', 
                        strokeWidth: 2, 
                        fill: '#1EAEDB', 
                        r: 6 
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-700 bg-charcoalSecondary/30">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-charcoalTextSecondary">Entry Date</TableHead>
                      <TableHead className="text-charcoalTextSecondary">Position</TableHead>
                      <TableHead className="text-charcoalTextSecondary">Entry Price</TableHead>
                      <TableHead className="text-charcoalTextSecondary">Exit Price</TableHead>
                      <TableHead className="text-charcoalTextSecondary">P/L</TableHead>
                      <TableHead className="text-charcoalTextSecondary">P/L %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {zenflowResults.map((result, index) => (
                      <TableRow key={index} className="hover:bg-charcoalSecondary/50">
                        <TableCell className="text-charcoalTextPrimary">{result["Entry-Date"] || "-"}</TableCell>
                        <TableCell className="text-charcoalTextPrimary">{result["Position"] || "-"}</TableCell>
                        <TableCell className="text-charcoalTextPrimary">{result["Entry-Price"] != null ? result["Entry-Price"].toFixed(2) : "-"}</TableCell>
                        <TableCell className="text-charcoalTextPrimary">{result["ExitPrice"] != null ? result["ExitPrice"].toFixed(2) : "-"}</TableCell>
                        <TableCell className={`font-medium ${result["P/L"] && result["P/L"] > 0 ? 'text-green-500' : result["P/L"] && result["P/L"] < 0 ? 'text-red-500' : 'text-charcoalTextPrimary'}`}>
                          {result["P/L"] != null ? result["P/L"].toFixed(2) : "-"}
                        </TableCell>
                        <TableCell className={`font-medium ${result["P/L-Percentage"] && parseFloat(String(result["P/L-Percentage"])) > 0 ? 'text-green-500' : result["P/L-Percentage"] && parseFloat(String(result["P/L-Percentage"])) < 0 ? 'text-red-500' : 'text-charcoalTextPrimary'}`}>
                          {result["P/L-Percentage"] || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </main>
      
      <BottomNav />
    </div>
  );
};

export default ZenflowBacktestReport;
