
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Mailgun configuration
const MAILGUN_API_KEY = "c41d83a8a354196b5aecc0d371bc52ce-3d4b3a2a-b5d6f8c8";
const MAILGUN_DOMAIN = "sandbox.mailgun.org"; // You should replace this with your actual domain

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, welcomeMessage } = await req.json();

    if (!email || !name) {
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

    // Send actual email using Mailgun
    const message = welcomeMessage || "Thank you for signing up with InfoCap Company!";
    const result = await sendMailgunEmail(email, name, message);

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully", result }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
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

async function sendMailgunEmail(toEmail: string, recipientName: string, welcomeMessage: string) {
  try {
    const formData = new FormData();
    formData.append("from", "InfoCap Team <welcome@infocap.com>");
    formData.append("to", toEmail);
    formData.append("subject", "Welcome to InfoCap Company!");
    
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
    
    formData.append("html", htmlContent);
    
    console.log(`Sending email to ${toEmail}...`);
    
    // Make the API request to Mailgun
    const response = await fetch(
      `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`,
        },
        body: formData,
      }
    );
    
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(`Mailgun API error: ${JSON.stringify(responseData)}`);
    }
    
    console.log("Email sent successfully via Mailgun:", responseData);
    return responseData;
  } catch (error) {
    console.error("Failed to send email via Mailgun:", error);
    throw error;
  }
}
