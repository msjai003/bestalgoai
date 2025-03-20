
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { method, brokerId, brokerName, imageUrl } = await req.json();
    
    console.log(`Processing ${method} request for broker ID: ${brokerId}`);
    
    let data;
    let error;
    
    switch (method) {
      case 'GET':
        // Get broker image
        ({ data, error } = await supabase
          .from('broker_images')
          .select('*')
          .eq('broker_id', brokerId)
          .order('updated_at', { ascending: false })
          .limit(1));
        break;
        
      case 'POST':
        // Create/update broker image
        const insertData = {
          broker_id: brokerId,
          broker_name: brokerName,
          image_url: imageUrl,
        };
        
        // Check if record exists
        const { data: existingData } = await supabase
          .from('broker_images')
          .select('id')
          .eq('broker_id', brokerId)
          .limit(1);
          
        if (existingData && existingData.length > 0) {
          // Update existing record
          ({ data, error } = await supabase
            .from('broker_images')
            .update({ image_url: imageUrl })
            .eq('id', existingData[0].id)
            .select());
        } else {
          // Insert new record
          ({ data, error } = await supabase
            .from('broker_images')
            .insert(insertData)
            .select());
        }
        break;
        
      case 'DELETE':
        // Delete broker image
        ({ data, error } = await supabase
          .from('broker_images')
          .delete()
          .eq('broker_id', brokerId));
        break;
        
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid method' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }
    
    if (error) {
      console.error('Error in broker image operation:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    return new Response(
      JSON.stringify({ data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Exception in broker image operation:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
