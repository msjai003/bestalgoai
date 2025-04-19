
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    console.log("Processing welcome email request");
    
    // Parse the request body
    const requestData = await req.json().catch(error => {
      console.error("Error parsing request body:", error);
      throw new Error("Invalid request body");
    });
    
    const { email, name, welcomeMessage } = requestData as EmailRequest;
    
    if (!email || !name) {
      console.error("Missing required fields:", { email, name });
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required fields: email and name are required"
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log(`Sending welcome email to: ${email}, Name: ${name}`);
    console.log(`RESEND API KEY exists: ${Boolean(Deno.env.get("RESEND_API_KEY"))}`);
    
    // Email HTML template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to BestAlgo.ai</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(to right, #3490dc, #6574cd);
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background: #f8fafc;
              padding: 20px;
              border-left: 1px solid #e2e8f0;
              border-right: 1px solid #e2e8f0;
            }
            .footer {
              background: #f1f5f9;
              padding: 15px;
              text-align: center;
              font-size: 12px;
              color: #64748b;
              border-radius: 0 0 5px 5px;
              border: 1px solid #e2e8f0;
            }
            .button {
              background: #3490dc;
              color: white;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
              display: inline-block;
              margin: 15px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Welcome to BestAlgo.ai!</h1>
          </div>
          <div class="content">
            <p>Hello ${name},</p>
            <p>${welcomeMessage || "Thank you for registering with BestAlgo.ai! We're excited to have you on board and help you on your trading journey."}</p>
            <p>With BestAlgo.ai, you'll gain access to:</p>
            <ul>
              <li>Advanced trading algorithms</li>
              <li>Real-time market analysis</li>
              <li>Personalized trading strategies</li>
              <li>Educational resources to improve your trading skills</li>
            </ul>
            <p>To get started, log in to your account and explore our platform. If you have any questions or need assistance, our support team is always ready to help.</p>
            <p>Happy trading!</p>
            <p>Best regards,<br>The BestAlgo.ai Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} BestAlgo.ai. All rights reserved.</p>
            <p>This email was sent to ${email}</p>
          </div>
        </body>
      </html>
    `;

    try {
      // Send the email
      const { data, error } = await resend.emails.send({
        from: "BestAlgo <onboarding@resend.dev>",
        to: [email],
        subject: "Welcome to BestAlgo.ai!",
        html: htmlContent,
      });

      if (error) {
        console.error("Error sending email:", error);
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }

      console.log("Email sent successfully:", data);
      return new Response(
        JSON.stringify({
          success: true,
          message: "Welcome email sent successfully",
          data
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    } catch (sendError) {
      console.error("Error from Resend API:", sendError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: sendError.message || "Error sending email through Resend API" 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An unexpected error occurred"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
