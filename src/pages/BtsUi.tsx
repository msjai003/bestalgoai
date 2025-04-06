
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Define a type for the trade log data that matches the actual data structure in pnl_logs
interface TradeLog {
  id: string;
  created_at: string;
  client_name: string;
  symbol: string;
  side: string;
  pnl: number;
  strategy_id?: number;
  price?: number;
  alert_time?: string;
  date?: string;
  client_id?: number;
  status?: string;
  qty?: number;
}

export default function BtsUi() {
  const [session, setSession] = useState<any>(null);
  const [userData, setUserData] = useState<TradeLog[]>([]);
  const [strategyFilter, setStrategyFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    
    // Get the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session) {
      fetchTrades();
    }
  }, [session, strategyFilter, startDate, endDate]);

  const fetchTrades = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use the correct table name that exists in your Supabase schema
      let query = supabase
        .from('pnl_logs')
        .select('*');

      if (session?.user?.email) {
        query = query.eq('client_name', session.user.email);
      }
      
      if (strategyFilter) query = query.eq('strategy_id', parseInt(strategyFilter));
      if (startDate) query = query.gte('created_at', startDate);
      if (endDate) query = query.lte('created_at', endDate);

      const { data, error: queryError } = await query;
      
      if (queryError) {
        console.error('Error fetching data:', queryError);
        setError('Failed to fetch trade data. Please try again later.');
      } else {
        // Cast the data to match our TradeLog interface
        setUserData(data as TradeLog[] || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Transform the data for the equity chart
  const equityData = userData.map((row, idx) => ({
    time: row.created_at ? format(new Date(row.created_at), 'HH:mm') : `Trade ${idx + 1}`,
    pnl: Number(row.pnl) || 0,
    equity: userData.slice(0, idx + 1).reduce((acc, cur) => acc + (Number(cur.pnl) || 0), 0),
  }));

  // Calculate drawdown data
  const drawdownData = equityData.map((row, idx) => {
    const peak = Math.max(...equityData.slice(0, idx + 1).map(d => d.equity));
    return {
      time: row.time,
      drawdown: row.equity - peak,
    };
  });

  return (
    <div className="min-h-screen bg-charcoalPrimary text-white p-6">
      <h1 className="text-2xl font-bold mb-6 text-cyan">📈 Your Backtest Results</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input 
          placeholder="Strategy ID" 
          value={strategyFilter} 
          onChange={(e) => setStrategyFilter(e.target.value)} 
          className="bg-charcoalSecondary border-gray-700"
        />
        <Input 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
          className="bg-charcoalSecondary border-gray-700"
        />
        <Input 
          type="date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
          className="bg-charcoalSecondary border-gray-700"
        />
        <Button onClick={fetchTrades} variant="default" className="bg-cyan hover:bg-cyan/90">Apply Filters</Button>
      </div>

      {error && (
        <Card className="bg-charcoalSecondary border border-red-500/30 mb-6">
          <CardContent className="pt-6">
            <p className="text-red-400">{error}</p>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Card className="bg-charcoalSecondary border border-gray-700 mb-6">
          <CardContent className="flex justify-center items-center p-12">
            <div className="animate-spin h-8 w-8 border-4 border-cyan border-t-transparent rounded-full"></div>
            <span className="ml-3 text-gray-400">Loading data...</span>
          </CardContent>
        </Card>
      ) : session ? (
        <div className="grid gap-6">
          <Card className="bg-charcoalSecondary border border-gray-700">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4 text-cyan">Equity Curve</h2>
              <div className="h-[300px] w-full">
                {equityData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={equityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="time" stroke="#B0B0B0" />
                      <YAxis stroke="#B0B0B0" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F1F1F', 
                          borderColor: '#333',
                          color: '#fff' 
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="equity" 
                        stroke="#4CAF50" 
                        strokeWidth={2} 
                        dot={false}
                        name="Equity" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-charcoalSecondary border border-gray-700">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4 text-cyan">Drawdown</h2>
              <div className="h-[200px] w-full">
                {drawdownData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={drawdownData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="time" stroke="#B0B0B0" />
                      <YAxis stroke="#B0B0B0" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F1F1F', 
                          borderColor: '#333',
                          color: '#fff' 
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="drawdown" 
                        stroke="#F44336" 
                        strokeWidth={2} 
                        dot={false}
                        name="Drawdown" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-charcoalSecondary border border-gray-700">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4 text-cyan">Trade History</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-2 px-4">Time</th>
                      <th className="text-left py-2 px-4">Symbol</th>
                      <th className="text-left py-2 px-4">Side</th>
                      <th className="text-left py-2 px-4">PnL (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.length > 0 ? (
                      userData.map((trade, idx) => (
                        <tr key={idx} className="border-t border-gray-700 hover:bg-gray-800/40">
                          <td className="py-2 px-4">{trade.created_at ? format(new Date(trade.created_at), 'HH:mm:ss') : 'N/A'}</td>
                          <td className="py-2 px-4">{trade.symbol || 'N/A'}</td>
                          <td className="py-2 px-4">{trade.side || 'N/A'}</td>
                          <td className={`py-2 px-4 ${Number(trade.pnl) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {Number(trade.pnl || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-gray-400">
                          No trades found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="bg-charcoalSecondary border border-gray-700">
          <CardContent className="p-6">
            <p className="text-red-400">Please log in to view your backtest results.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
