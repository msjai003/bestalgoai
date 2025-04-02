// Supabase Edge Function to update Strategy data
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.22.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    
    // Parse request to determine which strategy to update
    const { strategy } = await req.json();
    const strategyType = strategy || 'zenflow';
    
    if (strategyType === 'zenflow') {
      // Clear existing zenflow data for the years we're going to insert
      await supabaseClient
        .from('zenflow_strategy')
        .delete()
        .in('year', [2020, 2021, 2022, 2023, 2024, 2025]);
      
      // Insert sample data for Zenflow Strategy
      const { data, error } = await supabaseClient
        .from('zenflow_strategy')
        .insert([
          {
            year: 2020,
            jan: 15000,
            feb: 5000,
            mar: 3000,
            apr: 20000,
            may: -2000,
            jun: 6000,
            jul: 18000,
            aug: 3000,
            sep: 7500,
            oct: 4000,
            nov: 2000,
            dec: 6000,
            total: 87500,
            max_drawdown: -10000
          },
          {
            year: 2021,
            jan: 22000,
            feb: 8000,
            mar: 10000,
            apr: 28000,
            may: 20000,
            jun: -4000,
            jul: 8000,
            aug: -1500,
            sep: 1000,
            oct: 15000,
            nov: 14000,
            dec: 25000,
            total: 145500,
            max_drawdown: -14000
          },
          {
            year: 2022,
            jan: 1000,
            feb: 25000,
            mar: 14000,
            apr: -500,
            may: 30000,
            jun: 12000,
            jul: 5000,
            aug: 25000,
            sep: 12000,
            oct: 6000,
            nov: 6000,
            dec: 4500,
            total: 140000,
            max_drawdown: -10000
          },
          {
            year: 2023,
            jan: 20000,
            feb: -2000,
            mar: 20000,
            apr: -3500,
            may: 3500,
            jun: 7000,
            jul: -1200,
            aug: -4000,
            sep: 3500,
            oct: 5000,
            nov: 2000,
            dec: -700,
            total: 49600,
            max_drawdown: -12000
          },
          {
            year: 2024,
            jan: 28000,
            feb: 10000,
            mar: 18000,
            apr: -1000,
            may: 7000,
            jun: 4000,
            jul: 4000,
            aug: -10000,
            sep: -3000,
            oct: 15000,
            nov: -1500,
            dec: -1000,
            total: 69500,
            max_drawdown: -20000
          }
        ]);
      
      if (error) {
        console.error("Error inserting data:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400 
          }
        );
      }
      
      // Update metrics for Zenflow Strategy
      // Calculate key metrics based on the data
      const totalProfit = 87500 + 145500 + 140000 + 49600 + 69500; // Sum of all yearly totals
      const worstDrawdown = -20000; // Worst max drawdown
      const initialCapital = 100000; // Assumed initial capital
      
      // Prepare metrics update
      const metricsData = {
        overall_profit: totalProfit,
        overall_profit_percentage: parseFloat(((totalProfit / initialCapital) * 100).toFixed(2)),
        number_of_trades: 250, // Estimated based on monthly data points
        win_percentage: 72.5,
        loss_percentage: 27.5,
        max_drawdown: worstDrawdown,
        max_drawdown_percentage: parseFloat(((worstDrawdown / initialCapital) * 100).toFixed(2)),
        avg_profit_per_trade: parseFloat((totalProfit / 250).toFixed(2)),
        avg_profit_per_trade_percentage: parseFloat(((totalProfit / 250 / initialCapital) * 100).toFixed(2)),
        max_profit_in_single_trade: 30000, // Highest monthly value
        max_profit_in_single_trade_percentage: parseFloat(((30000 / initialCapital) * 100).toFixed(2)),
        max_loss_in_single_trade: -10000, // Lowest monthly value
        max_loss_in_single_trade_percentage: parseFloat(((-10000 / initialCapital) * 100).toFixed(2)),
        avg_profit_on_winning_trades: 10000,
        avg_profit_on_winning_trades_percentage: parseFloat(((10000 / initialCapital) * 100).toFixed(2)),
        avg_loss_on_losing_trades: -4000,
        avg_loss_on_losing_trades_percentage: parseFloat(((-4000 / initialCapital) * 100).toFixed(2)),
        reward_to_risk_ratio: parseFloat((10000 / 4000).toFixed(2)),
        max_win_streak: 7,
        max_losing_streak: 3,
        return_max_dd: parseFloat((totalProfit / Math.abs(worstDrawdown)).toFixed(2)),
        drawdown_duration: "15 days",
        max_trades_in_drawdown: 8,
        expectancy_ratio: parseFloat((((72.5/100) * 10000) - ((27.5/100) * 4000)).toFixed(2))
      };
      
      // Update the metrics table
      const { data: metricsUpdateData, error: metricsError } = await supabaseClient
        .from('zenflow_metrics')
        .upsert([metricsData])
        .select();
      
      if (metricsError) {
        console.error("Error updating metrics:", metricsError);
        return new Response(
          JSON.stringify({ error: metricsError.message, data: data }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200 
          }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          message: "Zenflow Strategy data updated successfully",
          data: data,
          metrics: metricsUpdateData
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200 
        }
      );
    } else if (strategyType === 'velox') {
      // For Velox Edge Strategy, we only need to insert strategy data now
      
      // Check if there's any data already
      const { data: veloxCheckData, error: veloxCheckError } = await supabaseClient
        .from('velox_edge_strategy')
        .select('id')
        .limit(1);
        
      if (veloxCheckError) {
        console.error("Error checking Velox Edge data:", veloxCheckError);
        return new Response(
          JSON.stringify({ error: veloxCheckError.message }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400 
          }
        );
      }
      
      // If no data exists, insert sample data
      if (!veloxCheckData || veloxCheckData.length === 0) {
        const veloxData = [
          {
            year: 2020,
            jan: 18000,
            feb: 6000,
            mar: 3600,
            apr: 24000,
            may: -2400,
            jun: 7200,
            jul: 21600,
            aug: 3600,
            sep: 9000,
            oct: 4800,
            nov: 2400,
            dec: 7200,
            total: 105000,
            max_drawdown: -12000
          },
          {
            year: 2021,
            jan: 26400,
            feb: 9600,
            mar: 12000,
            apr: 33600,
            may: 24000,
            jun: -4800,
            jul: 9600,
            aug: -1800,
            sep: 1200,
            oct: 18000,
            nov: 16800,
            dec: 30000,
            total: 174600,
            max_drawdown: -16800
          },
          {
            year: 2022,
            jan: 1200,
            feb: 30000,
            mar: 16800,
            apr: -600,
            may: 36000,
            jun: 14400,
            jul: 6000,
            aug: 30000,
            sep: 14400,
            oct: 7200,
            nov: 7200,
            dec: 5400,
            total: 168000,
            max_drawdown: -12000
          },
          {
            year: 2023,
            jan: 24000,
            feb: -2400,
            mar: 24000,
            apr: -4200,
            may: 4200,
            jun: 8400,
            jul: -1440,
            aug: -4800,
            sep: 4200,
            oct: 6000,
            nov: 2400,
            dec: -840,
            total: 59520,
            max_drawdown: -14400
          },
          {
            year: 2024,
            jan: 33600,
            feb: 12000,
            mar: 21600,
            apr: -1200,
            may: 8400,
            jun: 4800,
            jul: 4800,
            aug: -12000,
            sep: -3600,
            oct: 18000,
            nov: -1800,
            dec: -1200,
            total: 83400,
            max_drawdown: -24000
          }
        ];
        
        const { error: insertVeloxError } = await supabaseClient
          .from('velox_edge_strategy')
          .insert(veloxData);
          
        if (insertVeloxError) {
          console.error("Error inserting Velox Edge strategy data:", insertVeloxError);
          return new Response(
            JSON.stringify({ error: insertVeloxError.message }),
            { 
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400 
            }
          );
        }
        console.log("Successfully inserted Velox Edge strategy data");
      }
      
      // Velox Edge metrics are now handled through mock data in the frontend,
      // so we don't try to access or update the veloxedge_metrics table
      console.log("Velox Edge metrics will be provided through mock data in the frontend");
      
      // Fetch the complete velox strategy data to return
      const { data: veloxData, error: fetchError } = await supabaseClient
        .from('velox_edge_strategy')
        .select('*')
        .order('year', { ascending: true });
        
      if (fetchError) {
        console.error("Error fetching Velox Edge data:", fetchError);
        return new Response(
          JSON.stringify({ 
            message: "Failed to fetch strategy data",
            error: fetchError.message
          }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200 
          }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          message: "Velox Edge Strategy data updated successfully",
          data: veloxData,
          metrics: null // No metrics from database, will use mock data
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200 
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        message: "Invalid strategy type specified",
        error: "Please specify a valid strategy type"
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400 
      }
    );
    
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
