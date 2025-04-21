
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

// Initialize Resend with better error handling
const resendApiKey = Deno.env.get("RESEND_API_KEY");
if (!resendApiKey) {
  console.error("[CRITICAL] RESEND_API_KEY is not set in environment variables");
}
console.log(`[STARTUP] RESEND_API_KEY exists: ${Boolean(resendApiKey)}`);
const resend = new Resend(resendApiKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  name: string;
  welcomeMessage?: string;
}

// Create a helper function for logging
function logInfo(message: string, data?: any) {
  if (data) {
    console.log(`[INFO] ${message}`, JSON.stringify(data));
  } else {
    console.log(`[INFO] ${message}`);
  }
}

function logError(message: string, error: any) {
  console.error(`[ERROR] ${message}`, JSON.stringify(error, Object.getOwnPropertyNames(error)));
}

serve(async (req) => {
  const requestId = crypto.randomUUID();
  const timestamp = new Date().toISOString();
  logInfo(`[${requestId}] Request received at ${timestamp}`);

  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    logInfo(`[${requestId}] Handling CORS preflight request`);
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    logInfo(`[${requestId}] Processing welcome email request`);
    
    // Parse the request body
    let requestData;
    try {
      requestData = await req.json();
      logInfo(`[${requestId}] Request body parsed:`, requestData);
    } catch (error) {
      logError(`[${requestId}] Error parsing request body:`, error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid request body",
          requestId
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    const { email, name, welcomeMessage } = requestData as EmailRequest;
    
    if (!email || !name) {
      logError(`[${requestId}] Missing required fields:`, { email, name });
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required fields: email and name are required",
          requestId
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    logInfo(`[${requestId}] Sending welcome email to: ${email}, Name: ${name}`);
    logInfo(`[${requestId}] RESEND API KEY exists: ${Boolean(resendApiKey)}`);

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        logError(`[${requestId}] Invalid email format:`, { email });
        return new Response(
          JSON.stringify({
            success: false,
            error: "Invalid email format",
            requestId
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }

      // Send the email with more detailed logging
      logInfo(`[${requestId}] Calling Resend API with parameters:`, { 
        from: "BestAlgo <onboarding@resend.dev>",
        to: email,
        subject: "Welcome to BestAlgo!"
      });
      
      const { data, error } = await resend.emails.send({
        from: "BestAlgo <onboarding@resend.dev>",
        to: [email],
        subject: "Welcome to BestAlgo!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #4F46E5;">Welcome to BestAlgo!</h1>
            <p>Hello ${name},</p>
            <p>${welcomeMessage || "Thank you for registering with BestAlgo! We're excited to have you on board."}</p>
            <p>With BestAlgo, you'll gain access to:</p>
            <ul>
              <li>Advanced trading algorithms</li>
              <li>Real-time market analysis</li>
              <li>Personalized trading strategies</li>
              <li>Educational resources</li>
            </ul>
            <p>Get started by logging into your account and exploring our platform.</p>
            <p>Best regards,<br>The BestAlgo Team</p>
          </div>
        `
      });

      if (error) {
        logError(`[${requestId}] Resend API Error:`, error);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Resend API Error: ${error.message || 'Unknown error'}`,
            details: error,
            requestId
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }

      logInfo(`[${requestId}] Email sent successfully:`, data);
      return new Response(
        JSON.stringify({
          success: true,
          message: "Welcome email sent successfully",
          data,
          requestId
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    } catch (sendError) {
      logError(`[${requestId}] Email sending error:`, sendError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: sendError.message || "Error in email sending process",
          requestId 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
  } catch (error: any) {
    logError(`[${requestId}] Unexpected error:`, error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An unexpected error occurred during email sending",
        requestId
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
