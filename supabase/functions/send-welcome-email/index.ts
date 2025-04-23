
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// SMTP configuration - using the Gmail SMTP
const SMTP_HOST = "smtp.gmail.com";
const SMTP_PORT = 587; // Changed to standard TLS port for better deliverability
const SMTP_USERNAME = "learnings1.infocap@gmail.com";
const SMTP_PASSWORD = "jcpv fako lllb dfre"; // App password for Gmail
const SENDER_EMAIL = "learnings1.infocap@gmail.com";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Edge function triggered: Attempting to send welcome email");
    
    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json();
      console.log("Request body parsed successfully:", JSON.stringify(requestBody));
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    const { email, name, welcomeMessage } = requestBody;
    console.log(`Email request received - To: ${email}, Name: ${name}`);

    if (!email || !name) {
      console.error("Missing required fields in request");
      return new Response(
        JSON.stringify({
          error: "Missing required fields: email and name are required"
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Check email format validity
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error(`Invalid email format: ${email}`);
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Create HTML content with proper formatting
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to InfoCap!</h1>
            </div>
            <div class="content">
              <p>Hello ${name},</p>
              <p>${welcomeMessage || "Thank you for registering with InfoCap! We're excited to have you on board."}</p>
              <p>If you have any questions, please don't hesitate to contact our support team.</p>
              <p>Best regards,<br>The InfoCap Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} InfoCap Company. All rights reserved.</p>
              <p>This email was sent to ${email}</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    console.log("Starting SMTP connection process...");
    
    try {
      // Using TLS instead of direct SSL for better compatibility
      const client = new SmtpClient();
      
      // Connect to SMTP server with detailed logging
      console.log(`Connecting to SMTP server ${SMTP_HOST}:${SMTP_PORT}...`);
      await client.connectTLS({
        hostname: SMTP_HOST,
        port: SMTP_PORT,
        username: SMTP_USERNAME,
        password: SMTP_PASSWORD,
      });
      console.log("Successfully connected to SMTP server");
      
      // Send the email with detailed logging
      console.log(`Preparing to send email to ${email}...`);
      const result = await client.send({
        from: `InfoCap <${SENDER_EMAIL}>`,
        to: email,
        subject: "Welcome to InfoCap!",
        content: "Welcome to InfoCap Company!",
        html: htmlContent,
      });
      
      console.log("Email sent successfully:", result);
      
      // Close connection
      await client.close();
      console.log("SMTP connection closed");
      
      return new Response(
        JSON.stringify({ success: true, message: "Email sent successfully" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    } catch (smtpError) {
      // Detailed SMTP error logging
      console.error("SMTP error details:", {
        message: smtpError.message,
        name: smtpError.name,
        stack: smtpError.stack,
        code: smtpError.code
      });
      
      return new Response(
        JSON.stringify({ 
          error: "Failed to send email", 
          details: smtpError.message,
          code: smtpError.code || "UNKNOWN"
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
  } catch (error) {
    console.error("Unexpected error in edge function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
