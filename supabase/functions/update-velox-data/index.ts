
// Follow Deno deploy standard: https://deno.land/std@0.168.0/http/server.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract the request body
    const { strategy = 'velox' } = await req.json();
    
    console.log(`Received request to update ${strategy} data`);
    
    // Create sample data based on the strategy type
    if (strategy === 'velox') {
      // Generate new mock data for velox_edge_strategy
      const mockStrategyData = [
        {
          year: 2020,
          jan: 12000,
          feb: 4000,
          mar: 2500,
          apr: 17000,
          may: -1500,
          jun: 5000,
          jul: 15000,
          aug: 2500,
          sep: 6500,
          oct: 3500,
          nov: 1500,
          dec: 5000,
          total: 73000,
          max_drawdown: -8000
        },
        {
          year: 2021,
          jan: 18000,
          feb: 7000,
          mar: 9000,
          apr: 24000,
          may: 17000,
          jun: -3000,
          jul: 7000,
          aug: -1000,
          sep: 800,
          oct: 13000,
          nov: 12000,
          dec: 21000,
          total: 125000,
          max_drawdown: -12000
        },
        {
          year: 2022,
          jan: 800,
          feb: 21000,
          mar: 12000,
          apr: -300,
          may: 26000,
          jun: 10000,
          jul: 4200,
          aug: 21000,
          sep: 10000,
          oct: 5000,
          nov: 5000,
          dec: 3800,
          total: 118500,
          max_drawdown: -8500
        },
        {
          year: 2023,
          jan: 17000,
          feb: -1700,
          mar: 17000,
          apr: -2900,
          may: 2900,
          jun: 6000,
          jul: -900,
          aug: -3400,
          sep: 2900,
          oct: 4200,
          nov: 1700,
          dec: -600,
          total: 42200,
          max_drawdown: -10000
        },
        {
          year: 2024,
          jan: 24000,
          feb: 8500,
          mar: 15000,
          apr: -800,
          may: 6000,
          jun: 3400,
          jul: 3400,
          aug: -8500,
          sep: -2500,
          oct: 13000,
          nov: -1300,
          dec: -800,
          total: 59400,
          max_drawdown: -17000
        }
      ];
      
      // Clear existing data
      const { error: deleteError } = await supabase
        .from('velox_edge_strategy')
        .delete()
        .neq('id', 0);
        
      if (deleteError) {
        throw new Error(`Error clearing existing data: ${deleteError.message}`);
      }
      
      // Insert new data
      const { error: insertError } = await supabase
        .from('velox_edge_strategy')
        .insert(mockStrategyData);
        
      if (insertError) {
        throw new Error(`Error inserting new data: ${insertError.message}`);
      }
      
      // Mock data for velox_edge_metrics
      const mockMetricsData = {
        overall_profit: 592758.75,
        overall_profit_percentage: 266.62,
        number_of_trades: 1295,
        win_percentage: 44.09,
        loss_percentage: 55.91,
        max_drawdown: -25942.5,
        max_drawdown_percentage: -11.67,
        avg_profit_per_trade: 457.73,
        avg_profit_per_trade_percentage: 0.21,
        max_profit_in_single_trade: 7323.75,
        max_profit_in_single_trade_percentage: 3.29,
        max_loss_in_single_trade: -4136.25,
        max_loss_in_single_trade_percentage: -1.86,
        avg_profit_on_winning_trades: 2853.84,
        avg_profit_on_winning_trades_percentage: 1.28,
        avg_loss_on_losing_trades: -1432.02,
        avg_loss_on_losing_trades_percentage: -0.64,
        reward_to_risk_ratio: 1.99,
        max_win_streak: 7,
        max_losing_streak: 10,
        return_max_dd: 4.36,
        drawdown_duration: "57 [7/29/2024 to 9/23/2024]",
        max_trades_in_drawdown: 70,
        expectancy_ratio: 0.32
      };
      
      // Clear existing metrics
      const { error: deleteMetricsError } = await supabase
        .from('velox_edge_metrics')
        .delete()
        .neq('id', 0);
        
      if (deleteMetricsError) {
        throw new Error(`Error clearing existing metrics: ${deleteMetricsError.message}`);
      }
      
      // Insert new metrics
      const { error: insertMetricsError } = await supabase
        .from('velox_edge_metrics')
        .insert(mockMetricsData);
        
      if (insertMetricsError) {
        throw new Error(`Error inserting new metrics: ${insertMetricsError.message}`);
      }
      
      console.log("Velox Edge data update completed successfully");
      
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Velox Edge data updated successfully',
          data: { strategy: 'velox' }
        }),
        { 
          headers: { 
            ...corsHeaders,
            "Content-Type": "application/json" 
          } 
        }
      );
    } 
    else if (strategy === 'nova') {
      // Generate mock data for novaglide_strategy
      const mockNovaData = [
        { 
          year: 2020, 
          jan: 13000, feb: 4500, mar: 2800, apr: 18500, may: -1800, jun: 5500, 
          jul: 16500, aug: 2800, sep: 7000, oct: 3800, nov: 1800, dec: 5500, 
          total: 80000, max_drawdown: -9000 
        },
        { 
          year: 2021, 
          jan: 20000, feb: 7500, mar: 9500, apr: 26000, may: 18500, jun: -3600, 
          jul: 7500, aug: -1400, sep: 900, oct: 14000, nov: 13000, dec: 23000, 
          total: 135000, max_drawdown: -13000 
        },
        { 
          year: 2022, 
          jan: 900, feb: 23000, mar: 13000, apr: -400, may: 28000, jun: 11000, 
          jul: 4600, aug: 23000, sep: 11000, oct: 5500, nov: 5500, dec: 4200, 
          total: 130000, max_drawdown: -9500 
        },
        { 
          year: 2023, 
          jan: 18500, feb: -1900, mar: 18500, apr: -3200, may: 3200, jun: 6500, 
          jul: -1000, aug: -3700, sep: 3200, oct: 4600, nov: 1900, dec: -650, 
          total: 46000, max_drawdown: -11000 
        },
        { 
          year: 2024, 
          jan: 26000, feb: 9300, mar: 16500, apr: -900, may: 6500, jun: 3700, 
          jul: 3700, aug: -9300, sep: -2700, oct: 14000, nov: -1400, dec: -900, 
          total: 64000, max_drawdown: -18500 
        }
      ];
      
      console.log("Updating Nova Glide strategy data...");
      
      // Clear existing data
      const { error: deleteError } = await supabase
        .from('novaglide_strategy')
        .delete()
        .neq('id', 0);
        
      if (deleteError) {
        throw new Error(`Error clearing existing Nova data: ${deleteError.message}`);
      }
      
      // Insert new data
      const { data, error: insertError } = await supabase
        .from('novaglide_strategy')
        .insert(mockNovaData)
        .select();
        
      if (insertError) {
        throw new Error(`Error inserting new Nova data: ${insertError.message}`);
      }
      
      console.log("Nova Glide data update completed successfully:", data);
      
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Nova Glide data updated successfully',
          data: { strategy: 'nova', rows: data }
        }),
        { 
          headers: { 
            ...corsHeaders,
            "Content-Type": "application/json" 
          } 
        }
      );
    }
    else {
      throw new Error(`Unsupported strategy type: ${strategy}`);
    }
    
    // Return a success response for other strategies
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${strategy} data updated successfully` 
      }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      }
    );
  }
});
