
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Edge function triggered: Attempting to send welcome email via SMTP");
    
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
    
    const { email, name, welcomeMessage } = requestBody as EmailRequest;
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
              <h1>Welcome to BestAlgo.ai!</h1>
            </div>
            <div class="content">
              <p>Hello ${name},</p>
              <p>${welcomeMessage || "Thank you for registering with BestAlgo.ai! We're excited to have you on board."}</p>
              <p>If you have any questions, please don't hesitate to contact our support team.</p>
              <p>Best regards,<br>The BestAlgo.ai Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} BestAlgo.ai. All rights reserved.</p>
              <p>This email was sent to ${email}</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    console.log("Setting up SMTP client...");
    try {
      const client = new SMTPClient({
        connection: {
          hostname: "smtp.gmail.com",
          port: 465,
          tls: true,
          auth: {
            username: "learnings1.infocap@gmail.com",
            password: "jcpv fako lllb dfre"
          }
        }
      });
      
      console.log("SMTP client initialized, attempting to send email...");
      await client.send({
        from: "BestAlgo.ai <learnings1.infocap@gmail.com>",
        to: email,
        subject: "Welcome to BestAlgo.ai!",
        html: htmlContent,
      });
      
      await client.close();
      
      console.log("Email sent successfully via SMTP to:", email);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Email sent successfully",
          recipient: email
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    } catch (smtpError: any) {
      console.error("SMTP error details:", smtpError);
      return new Response(
        JSON.stringify({ 
          error: "SMTP error", 
          details: smtpError.message || "Unknown SMTP error",
          stack: smtpError.stack
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
  } catch (error: any) {
    console.error("Unexpected error in edge function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to send email", 
        details: error.message || "Unknown error",
        stack: error.stack 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
