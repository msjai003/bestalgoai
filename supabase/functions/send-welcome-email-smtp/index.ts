
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

// Initialize SMTP client with environment variables
const smtpConfig = {
  hostname: Deno.env.get("SMTP_HOST") || "",
  port: parseInt(Deno.env.get("SMTP_PORT") || "587"),
  username: Deno.env.get("SMTP_USERNAME") || "",
  password: Deno.env.get("SMTP_PASSWORD") || "",
  secure: Deno.env.get("SMTP_SECURE")?.toLowerCase() === "true",
};

// CORS headers to allow cross-origin requests
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
    
    // Validate SMTP configuration
    if (!smtpConfig.hostname || !smtpConfig.username || !smtpConfig.password) {
      logError(`[${requestId}] Missing SMTP configuration`, smtpConfig);
      return new Response(
        JSON.stringify({
          success: false,
          error: "SMTP configuration is incomplete",
          requestId,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
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

    logInfo(`[${requestId}] Preparing SMTP client for ${email}`);

    try {
      // Create SMTP client
      const client = new SMTPClient(smtpConfig);
      
      // Connect to SMTP server
      await client.connect();
      logInfo(`[${requestId}] SMTP client connected successfully`);
      
      // Send the email
      const fromEmail = Deno.env.get("SMTP_FROM_EMAIL") || smtpConfig.username;
      
      const send = await client.send({
        from: `"BestAlgo" <${fromEmail}>`,
        to: email,
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
            <p style="font-size: 12px; color: #666;">This email was sent to ${email}.</p>
          </div>
        `,
      });
      
      logInfo(`[${requestId}] Email sent successfully:`, send);
      
      // Close the connection
      await client.close();
      
      return new Response(
        JSON.stringify({
          success: true,
          message: "Welcome email sent successfully",
          data: send,
          requestId
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    } catch (sendError) {
      logError(`[${requestId}] SMTP Error:`, sendError);
      
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
