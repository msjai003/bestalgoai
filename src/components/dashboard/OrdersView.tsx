
import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { ArrowUpCircle, ArrowDownCircle, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface TradeResult {
  id: number;
  time: string;
  price: number;
  rsi: number;
  action: string;
  shares: number;
  capital: number;
  profit_loss: number;
}

const mockTradeResults: TradeResult[] = [
  {
    id: 1,
    time: "2025-04-29T10:30:00",
    price: 22560.75,
    rsi: 70.5,
    action: "BUY",
    shares: 100,
    capital: 2256075,
    profit_loss: 0
  },
  {
    id: 2,
    time: "2025-04-29T11:45:00",
    price: 22580.50,
    rsi: 65.2,
    action: "SELL",
    shares: 100,
    capital: 2258050,
    profit_loss: 1975
  },
  {
    id: 3,
    time: "2025-04-30T09:15:00",
    price: 22475.25,
    rsi: 30.1,
    action: "BUY",
    shares: 50,
    capital: 1123762.5,
    profit_loss: 0
  }
];

interface OrdersViewProps {
  useRealData?: boolean;
}

const OrdersView = ({ useRealData = false }: OrdersViewProps) => {
  const { user } = useAuth();
  const [tradeResults, setTradeResults] = useState<TradeResult[]>(mockTradeResults);
  const [loading, setLoading] = useState(useRealData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (useRealData && user) {
      const fetchTradeResults = async () => {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('trade_results')
            .select('*')
            .order('time', { ascending: false });

          if (error) {
            console.error('Error fetching trade results:', error);
            setError('Failed to load trade results. Please try again later.');
          } else if (data) {
            console.log('Trade results fetched successfully:', data);
            setTradeResults(data);
          }
        } catch (err) {
          console.error('Exception fetching trade results:', err);
          setError('An unexpected error occurred.');
        } finally {
          setLoading(false);
        }
      };

      fetchTradeResults();
    }
  }, [user, useRealData]);

  const getActionIcon = (action: string) => {
    switch (action?.toUpperCase()) {
      case 'BUY':
        return <ArrowUpCircle className="h-4 w-4 text-emerald-500" />;
      case 'SELL':
        return <ArrowDownCircle className="h-4 w-4 text-rose-500" />;
      default:
        return null;
    }
  };

  const getActionStyle = (action: string) => {
    return action?.toUpperCase() === 'BUY' 
      ? 'text-emerald-400'
      : 'text-rose-400';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      minimumFractionDigits: 2 
    }).format(price);
  };

  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return "N/A";
    
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatProfitLoss = (value: number) => {
    if (value === 0) return '-';
    
    const formatted = new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      minimumFractionDigits: 2 
    }).format(Math.abs(value));
    
    const colorClass = value > 0 ? 'text-emerald-400' : 'text-rose-400';
    const prefix = value > 0 ? '+' : '-';
    
    return <span className={colorClass}>{prefix}{formatted}</span>;
  };

  if (loading) {
    return (
      <div className="bg-charcoalSecondary rounded-xl p-6 border border-gray-800/40 shadow-lg flex items-center justify-center" style={{ minHeight: "200px" }}>
        <Loader className="h-8 w-8 animate-spin text-cyan mx-auto" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-charcoalSecondary rounded-xl p-6 border border-gray-800/40 shadow-lg">
        <p className="text-red-400 text-center">{error}</p>
      </div>
    );
  }

  return (
    <section id="orders-view" className="mt-6">
      <div className="bg-charcoalSecondary rounded-xl p-6 border border-gray-800/40 shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Trade Results</h2>
        
        {tradeResults.length === 0 ? (
          <p className="text-center text-gray-400 py-6">No trade results found.</p>
        ) : (
          <div className="overflow-x-auto -mx-4 px-4">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-700/50">
                  <TableHead className="text-gray-400 font-medium">Time</TableHead>
                  <TableHead className="text-gray-400 font-medium">Action</TableHead>
                  <TableHead className="text-gray-400 font-medium text-right">Shares</TableHead>
                  <TableHead className="text-gray-400 font-medium text-right">Price</TableHead>
                  <TableHead className="text-gray-400 font-medium text-right">RSI</TableHead>
                  <TableHead className="text-gray-400 font-medium text-right">Capital</TableHead>
                  <TableHead className="text-gray-400 font-medium text-right">P/L</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tradeResults.map((result) => (
                  <TableRow 
                    key={result.id} 
                    className="border-b border-gray-700/30 hover:bg-charcoalPrimary/40"
                  >
                    <TableCell className="font-medium text-white">{formatDateTime(result.time)}</TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className={`inline-flex items-center ${getActionStyle(result.action)}`}>
                              {getActionIcon(result.action)}
                              <span className="ml-1">{result.action}</span>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="bg-white text-black border border-gray-200">
                            <p>{result.action === 'BUY' ? 'Buy Order' : 'Sell Order'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-right text-white">{result.shares}</TableCell>
                    <TableCell className="text-right text-white">{formatPrice(result.price)}</TableCell>
                    <TableCell className="text-right text-white">{result.rsi?.toFixed(2) || 'N/A'}</TableCell>
                    <TableCell className="text-right text-white">{formatPrice(result.capital)}</TableCell>
                    <TableCell className="text-right">{formatProfitLoss(result.profit_loss)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </section>
  );
};

export default OrdersView;
