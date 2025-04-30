
import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Check, AlertCircle, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Order {
  id: string;
  symbol: string;
  type: string;
  quantity: number;
  price: number;
  status: 'completed' | 'pending' | 'canceled';
  date: string;
}

const mockOrders: Order[] = [
  {
    id: "ORD001",
    symbol: "NIFTY 50",
    type: "BUY",
    quantity: 100,
    price: 22560.75,
    status: 'completed',
    date: "2025-04-29"
  },
  {
    id: "ORD002",
    symbol: "RELIANCE",
    type: "SELL",
    quantity: 25,
    price: 2950.50,
    status: 'completed',
    date: "2025-04-28"
  },
  {
    id: "ORD003",
    symbol: "INFY",
    type: "BUY",
    quantity: 50,
    price: 1475.25,
    status: 'pending',
    date: "2025-04-30"
  }
];

interface OrdersViewProps {
  useRealData?: boolean;
}

const OrdersView = ({ useRealData = false }: OrdersViewProps) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [loading, setLoading] = useState(useRealData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (useRealData && user) {
      const fetchOrders = async () => {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('date', { ascending: false });

          if (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to load orders. Please try again later.');
          } else if (data) {
            console.log('Orders fetched successfully:', data);
            setOrders(data);
          }
        } catch (err) {
          console.error('Exception fetching orders:', err);
          setError('An unexpected error occurred.');
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }
  }, [user, useRealData]);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-emerald-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'canceled':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getTypeStyle = (type: string) => {
    return type === 'BUY' 
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
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
        <h2 className="text-xl font-semibold text-white mb-4">Recent Orders</h2>
        
        {orders.length === 0 ? (
          <p className="text-center text-gray-400 py-6">No orders found.</p>
        ) : (
          <div className="overflow-x-auto -mx-4 px-4">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-700/50">
                  <TableHead className="text-gray-400 font-medium">Symbol</TableHead>
                  <TableHead className="text-gray-400 font-medium">Type</TableHead>
                  <TableHead className="text-gray-400 font-medium text-right">Quantity</TableHead>
                  <TableHead className="text-gray-400 font-medium text-right">Price</TableHead>
                  <TableHead className="text-gray-400 font-medium text-center">Status</TableHead>
                  <TableHead className="text-gray-400 font-medium text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow 
                    key={order.id} 
                    className="border-b border-gray-700/30 hover:bg-charcoalPrimary/40"
                  >
                    <TableCell className="font-medium text-white">{order.symbol}</TableCell>
                    <TableCell className={getTypeStyle(order.type)}>{order.type}</TableCell>
                    <TableCell className="text-right text-white">{order.quantity}</TableCell>
                    <TableCell className="text-right text-white">{formatPrice(order.price)}</TableCell>
                    <TableCell className="text-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex items-center">
                              {getStatusIcon(order.status)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="bg-white text-black border border-gray-200">
                            <p>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-right text-gray-300">
                      {formatDate(order.date)}
                    </TableCell>
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
