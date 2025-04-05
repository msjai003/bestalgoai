
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// SMS API Configuration
const API_KEY = "3330494e464f4341503130301738306627"
const SENDER_ID = "INFCTP"
const TEMPLATE_ID = "1007454955787835764"
const ROUTE = "1"
const API_BASE_URL = "http://smvsms.smvnetwork.in/http-tokenkeyapi.php"

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the request body
    const { fullName, mobileNumber, userId } = await req.json()
    
    console.log(`Received request to send SMS to: ${mobileNumber} for user: ${fullName} (${userId})`)
    
    // Validate input
    if (!fullName || !mobileNumber || !userId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required parameters: fullName, mobileNumber, or userId' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    // Ensure mobile number has country code
    let formattedNumber = mobileNumber
    if (!mobileNumber.startsWith('91')) {
      formattedNumber = `91${mobileNumber}`
    }
    
    // Remove any spaces or special characters
    formattedNumber = formattedNumber.replace(/[^0-9]/g, '')
    
    // Construct the message
    const message = `Thank you for joining ${fullName}! As a registered member, you can enjoy exclusive benefits and features. Get started today! - Infocap`
    
    // URL encode the message
    const encodedMessage = encodeURIComponent(message)
    
    // Construct the SMS API URL
    const url = `${API_BASE_URL}?authentic-key=${API_KEY}&senderid=${SENDER_ID}&route=${ROUTE}&number=${formattedNumber}&message=${encodedMessage}&templateid=${TEMPLATE_ID}`
    
    console.log(`Sending SMS request to URL (truncated): ${url.substring(0, 100)}...`)
    
    // Send the SMS
    const response = await fetch(url)
    const responseText = await response.text()
    
    console.log(`SMS API Response: ${responseText}`)
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // Log the SMS delivery in the database
    const { data: logData, error: logError } = await supabaseClient
      .from('sms_logs')
      .insert({
        user_id: userId,
        mobile_number: formattedNumber,
        message: message,
        response: responseText,
        status: response.ok ? 'success' : 'failed'
      })
    
    if (logError) {
      console.error('Error logging SMS:', logError)
    } else {
      console.log('SMS log saved:', logData)
    }
    
    return new Response(
      JSON.stringify({ 
        success: response.ok, 
        message: 'SMS sent successfully',
        response: responseText
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    console.error('Error sending SMS:', error)
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
