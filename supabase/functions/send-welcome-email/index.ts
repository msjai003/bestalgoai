
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// SMTP configuration - using the provided credentials
const SMTP_HOST = "smtp.gmail.com";
const SMTP_PORT = 465;
const SMTP_USERNAME = "learnings1.infocap@gmail.com";
const SMTP_PASSWORD = "jcpv fako lllb dfre";
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
    console.log(`Request payload received - Email: ${email}, Name: ${name}, Message: ${welcomeMessage}`);

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

    // Send actual email using SMTP
    const message = welcomeMessage || "Thank you for signing up with InfoCap Company!";
    console.log(`Preparing to send welcome message: "${message}"`);
    
    try {
      const result = await sendSmtpEmail(email, name, message);
      console.log("Email sending complete, returning success response");
      
      return new Response(
        JSON.stringify({ success: true, message: "Email sent successfully", result }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    } catch (smtpError) {
      console.error("SMTP sending failed:", smtpError);
      return new Response(
        JSON.stringify({ error: "Failed to send email via SMTP", details: smtpError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
  } catch (error) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});

async function sendSmtpEmail(toEmail: string, recipientName: string, welcomeMessage: string) {
  try {
    console.log(`Preparing to send email to ${toEmail}...`);
    
    const client = new SmtpClient();
    
    // Connect to SMTP server
    console.log("Connecting to SMTP server...");
    try {
      await client.connectTLS({
        hostname: SMTP_HOST,
        port: SMTP_PORT,
        username: SMTP_USERNAME,
        password: SMTP_PASSWORD,
      });
      console.log("Successfully connected to SMTP server");
    } catch (connectError) {
      console.error("SMTP connection error:", connectError);
      throw new Error(`SMTP connection failed: ${connectError.message}`);
    }
    
    // HTML email content
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
              <p>Hello ${recipientName},</p>
              <p>${welcomeMessage}</p>
              <p>If you have any questions, please don't hesitate to contact our support team.</p>
              <p>Best regards,<br>The InfoCap Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} InfoCap Company. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    // Send the email
    console.log("Sending email...");
    let result;
    try {
      result = await client.send({
        from: SENDER_EMAIL,
        to: toEmail,
        subject: "Welcome to InfoCap Company!",
        content: "Welcome to InfoCap Company!",
        html: htmlContent,
      });
      console.log("Email sent successfully via SMTP:", result);
    } catch (sendError) {
      console.error("SMTP send error:", sendError);
      throw new Error(`Failed to send email: ${sendError.message}`);
    } finally {
      // Always close the connection, even if sending fails
      try {
        console.log("Closing SMTP connection...");
        await client.close();
        console.log("SMTP connection closed");
      } catch (closeError) {
        console.error("Error closing SMTP connection:", closeError);
      }
    }
    
    return { success: true, messageId: result };
  } catch (error) {
    console.error("Failed to send email via SMTP:", error);
    throw error;
  }
}
