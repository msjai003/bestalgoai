
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DownloadCloud,
  RefreshCw,
  ChevronLeft,
  BarChart4,
  Table as TableIcon
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
import LineChartWithColoredSegments from "@/components/charts/LineChartWithColoredSegments";

const ZenflowBacktestReport = () => {
  const { 
    zenflowResults, 
    loading, 
    error,
    fetchZenflowBacktestResults
  } = useZenflowBacktestResults();
  
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  
  useEffect(() => {
    // Refresh data when component mounts
    fetchZenflowBacktestResults();
    console.log("Component mounted, fetching data...");
  }, []);

  useEffect(() => {
    console.log("Current zenflow results:", zenflowResults);
  }, [zenflowResults]);

  // Transform data for the chart
  const chartData = useMemo(() => {
    if (zenflowResults.length === 0) return [];
    
    // Sort by entry date
    const sortedResults = [...zenflowResults].sort((a, b) => {
      const dateA = a["Entry-Date"] ? new Date(a["Entry-Date"]).getTime() : 0;
      const dateB = b["Entry-Date"] ? new Date(b["Entry-Date"]).getTime() : 0;
      return dateA - dateB;
    });
    
    // Calculate cumulative P/L
    let cumulativePL = 0;
    return sortedResults.map(result => {
      cumulativePL += result["P/L"] || 0;
      return {
        time: result["Entry-Date"] ? new Date(result["Entry-Date"]).toLocaleDateString() : 'N/A',
        value: cumulativePL,
        position: result["Position"] || 'N/A'
      };
    });
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

        {/* View toggle buttons */}
        <div className="mb-4 flex">
          <Button
            variant={viewMode === 'chart' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('chart')}
            className="flex items-center mr-2"
          >
            <BarChart4 className="h-4 w-4 mr-1" />
            Chart
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
            className="flex items-center"
          >
            <TableIcon className="h-4 w-4 mr-1" />
            Table
          </Button>
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
        ) : viewMode === 'chart' ? (
          <div className="bg-charcoalSecondary/30 p-4 rounded-lg border border-gray-700">
            <h3 className="text-lg font-medium text-white mb-4">Performance Chart</h3>
            <div className="h-60">
              <LineChartWithColoredSegments
                data={chartData}
                positiveColor="#00BCD4" // Cyan color for positive trends
                negativeColor="#FF5252" // Red for negative trends
                dataKey="value"
                dot={true}
                activeDot={{ r: 6, fill: "#00BCD4", stroke: "#fff", strokeWidth: 2 }}
              />
            </div>
            <div className="flex justify-between mt-4 text-xs text-charcoalTextSecondary">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-[#00BCD4] rounded-full mr-1"></span>
                <span>Positive Trend</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-[#FF5252] rounded-full mr-1"></span>
                <span>Negative Trend</span>
              </div>
            </div>
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
      </main>
      
      <BottomNav />
    </div>
  );
};

export default ZenflowBacktestReport;
