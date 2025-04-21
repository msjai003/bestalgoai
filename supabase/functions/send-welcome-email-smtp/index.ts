
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// Updated from outdated denomailer to a more reliable SMTP client
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

// CORS headers to allow cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Sanitize and validate SMTP configuration
const getSmtpConfig = () => {
  const host = Deno.env.get("SMTP_HOST");
  const portStr = Deno.env.get("SMTP_PORT");
  const username = Deno.env.get("SMTP_USERNAME") || Deno.env.get("SMTP_USER");
  const password = Deno.env.get("SMTP_PASSWORD") || Deno.env.get("SMTP_PASS");
  const secureStr = Deno.env.get("SMTP_SECURE");

  // Debug all environment variables without exposing sensitive data
  console.log("Environment variables check:", {
    SMTP_HOST_EXISTS: !!host,
    SMTP_PORT_EXISTS: !!portStr,
    SMTP_USERNAME_EXISTS: !!username,
    SMTP_PASSWORD_EXISTS: !!password,
    SMTP_FROM_EMAIL_EXISTS: !!Deno.env.get("SMTP_FROM_EMAIL") || !!Deno.env.get("SMTP_FROM"),
    SMTP_SECURE_EXISTS: !!secureStr,
    SMTP_HOST_VALUE: host, // Include actual values for debugging
    SMTP_PORT_VALUE: portStr
  });

  // Validate required fields
  if (!host) throw new Error("SMTP_HOST is not configured");
  if (!portStr) throw new Error("SMTP_PORT is not configured");
  if (!username) throw new Error("SMTP_USERNAME is not configured");
  if (!password) throw new Error("SMTP_PASSWORD is not configured");

  // Parse port as integer with fallback to 587
  const port = parseInt(portStr, 10);
  if (isNaN(port)) throw new Error("SMTP_PORT must be a valid number");

  // Parse secure as boolean with fallback to false
  let secure = false;
  if (secureStr) {
    secure = secureStr.toLowerCase() === "true";
  }

  return {
    hostname: host,
    port,
    username,
    password,
    secure,
  };
};

interface EmailRequest {
  email: string;
  name: string;
  welcomeMessage?: string;
  testOnly?: boolean;
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

// Test SMTP connection without sending an email
async function testSmtpConnection(config: any) {
  try {
    logInfo("Testing SMTP connection...");
    
    const client = new SmtpClient();
    
    await client.connect({
      hostname: config.hostname,
      port: config.port,
      username: config.username,
      password: config.password,
      // Set tls option based on port and secure setting
      tls: config.secure || config.port === 465,
    });
    
    logInfo("SMTP connection test successful!");
    await client.close();
    return { success: true };
  } catch (error) {
    logError("SMTP connection test failed", error);
    return { 
      success: false, 
      error: error.message || "Unknown error during SMTP connection test" 
    };
  }
}

serve(async (req: Request) => {
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
    let smtpConfig;
    try {
      smtpConfig = getSmtpConfig();
      logInfo(`[${requestId}] SMTP configuration loaded`, {
        host: smtpConfig.hostname,
        port: smtpConfig.port,
        username: smtpConfig.username,
        secure: smtpConfig.secure,
        // Do not log password
      });
    } catch (configError: any) {
      logError(`[${requestId}] SMTP configuration error`, configError);
      return new Response(
        JSON.stringify({
          success: false,
          error: `SMTP configuration error: ${configError.message}`,
          requestId,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    // First test the SMTP connection
    const connectionTest = await testSmtpConnection(smtpConfig);
    if (!connectionTest.success) {
      logError(`[${requestId}] SMTP connection test failed`, connectionTest);
      return new Response(
        JSON.stringify({
          success: false,
          error: `SMTP connection failed: ${connectionTest.error}`,
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
      logInfo(`[${requestId}] Request body parsed`, {
        email: requestData.email,
        name: requestData.name,
        hasWelcomeMessage: !!requestData.welcomeMessage,
        testOnly: !!requestData.testOnly,
      });
      
      // If testOnly flag is set, we don't need to send an actual email
      if (requestData.testOnly) {
        logInfo(`[${requestId}] Test only mode, not sending actual email`);
        return new Response(
          JSON.stringify({
            success: true,
            message: "SMTP connection test completed successfully. No email sent in test mode.",
            requestId
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
    } catch (error) {
      logError(`[${requestId}] Error parsing request body`, error);
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
      logError(`[${requestId}] Missing required fields`, { email, name });
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
      logError(`[${requestId}] Invalid email format`, { email });
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
      // Create SMTP client with specific configuration
      const client = new SmtpClient();
      
      // Connect to SMTP server with improved error handling
      logInfo(`[${requestId}] Attempting to connect to SMTP server at ${smtpConfig.hostname}:${smtpConfig.port}`);
      
      await client.connect({
        hostname: smtpConfig.hostname,
        port: smtpConfig.port,
        username: smtpConfig.username,
        password: smtpConfig.password,
        // Set tls option based on port and secure setting
        tls: smtpConfig.secure || smtpConfig.port === 465,
      });
      
      logInfo(`[${requestId}] SMTP client connected successfully`);
      
      // Send the email
      const fromEmail = Deno.env.get("SMTP_FROM_EMAIL") || Deno.env.get("SMTP_FROM") || smtpConfig.username;
      if (!fromEmail) {
        throw new Error("No sender email available. Please configure SMTP_FROM_EMAIL");
      }
      
      logInfo(`[${requestId}] Sending email from ${fromEmail} to ${email}`);
      
      await client.send({
        from: `BestAlgo <${fromEmail}>`,
        to: email,
        subject: "Welcome to BestAlgo!",
        content: `
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
        `
      });
      
      logInfo(`[${requestId}] Email sent successfully`);
      
      // Close the connection
      await client.close();
      
      return new Response(
        JSON.stringify({
          success: true,
          message: "Welcome email sent successfully",
          requestId
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    } catch (sendError: any) {
      logError(`[${requestId}] SMTP Error`, sendError);
      
      let errorMessage = sendError.message || "Error in email sending process";
      let errorDetails = {};
      
      // Enhanced error diagnosis for common SMTP issues
      if (errorMessage.includes("timeout")) {
        errorMessage = "SMTP server connection timeout. Please check your server host and port.";
        errorDetails = { type: "timeout", suggestion: "Verify SMTP_HOST and SMTP_PORT values" };
      } else if (errorMessage.includes("authentication")) {
        errorMessage = "SMTP authentication failed. Please check your username and password.";
        errorDetails = { type: "auth_failure", suggestion: "Verify SMTP_USERNAME and SMTP_PASSWORD" };
      } else if (errorMessage.toLowerCase().includes("connect")) {
        errorMessage = "Failed to connect to SMTP server. Please check server details and network.";
        errorDetails = { 
          type: "connection_failure", 
          suggestion: "Verify SMTP_HOST, SMTP_PORT, and network connectivity" 
        };
      } else if (errorMessage.toLowerCase().includes("secure")) {
        errorMessage = "SSL/TLS error when connecting to SMTP server.";
        errorDetails = { 
          type: "ssl_error", 
          suggestion: "Check SMTP_SECURE setting and ensure it matches server requirements" 
        };
      }
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: errorMessage,
          details: errorDetails,
          requestId 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
  } catch (error: any) {
    logError(`[${requestId}] Unexpected error`, error);
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
