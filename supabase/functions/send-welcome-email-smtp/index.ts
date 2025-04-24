
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
      console.log("Request body received:", JSON.stringify(requestBody));
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
    console.log(`Email request details - To: ${email}, Name: ${name}, Custom Message: ${welcomeMessage ? 'Yes' : 'No'}`);

    if (!email || !name) {
      console.error("Missing required fields in request:", requestBody);
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

    // Initialize Supabase client to fetch welcome message
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables:", { 
        hasUrl: !!supabaseUrl, 
        hasKey: !!supabaseKey 
      });
      
      return new Response(
        JSON.stringify({ error: "Server configuration error - missing environment variables" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    console.log("Creating Supabase client with URL:", supabaseUrl);
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.38.4");
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Fetch welcome message from the database if not provided
    let messageContent = welcomeMessage;
    
    if (!messageContent) {
      console.log("Fetching welcome message from database");
      try {
        const { data: welcomeData, error: welcomeError } = await supabase
          .from("welcome_messages")
          .select("content")
          .eq("id", 1)
          .single();
        
        if (welcomeError) {
          console.error("Error fetching welcome message:", welcomeError);
          // Continue with default message if there's an error
        } else if (welcomeData) {
          console.log("Welcome message retrieved successfully");
          messageContent = welcomeData.content;
        }
      } catch (dbError) {
        console.error("Exception while fetching welcome message:", dbError);
        // Continue with default message
      }
    }
    
    const finalWelcomeMessage = messageContent || "Welcome to BestAlgo.ai! We're excited to have you join our trading platform.";
    console.log("Using welcome message:", finalWelcomeMessage.substring(0, 50) + "...");
    
    // Create HTML content with proper formatting
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; white-space: pre-line; }
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
              <p>${finalWelcomeMessage}</p>
              <p>If you have any questions, our support team is here to help!</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} BestAlgo.ai. All rights reserved.</p>
              <p>This email was sent to ${email}</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    console.log("Setting up SMTP client with Gmail using port 465 and SSL...");
    try {
      const client = new SMTPClient({
        connection: {
          hostname: Deno.env.get("SMTP_HOST") || "",
          port: parseInt(Deno.env.get("SMTP_PORT") || "465"),
          tls: true,
          auth: {
            username: Deno.env.get("SMTP_USERNAME") || "",
            password: Deno.env.get("SMTP_PASSWORD") || ""
          }
        }
      });
      
      console.log("SMTP client initialized, preparing to send email to:", email);
      
      const emailToSend = {
        from: Deno.env.get("SMTP_FROM_EMAIL") || "",
        to: email,
        subject: "Welcome to BestAlgo.ai!",
        html: htmlContent,
      };
      
      console.log("Sending email with subject:", emailToSend.subject);
      const sendResult = await client.send(emailToSend);
      console.log("SMTP send result:", sendResult);
      
      await client.close();
      console.log("SMTP client closed successfully");
      
      console.log("Email sent successfully via SMTP to:", email);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Email sent successfully",
          recipient: email,
          timestamp: new Date().toISOString()
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    } catch (smtpError: any) {
      console.error("SMTP error occurred:", smtpError);
      console.error("SMTP error details:", {
        message: smtpError.message,
        stack: smtpError.stack,
        code: smtpError.code || "UNKNOWN"
      });
      
      return new Response(
        JSON.stringify({ 
          error: "SMTP error", 
          details: smtpError.message || "Unknown SMTP error",
          code: smtpError.code || "UNKNOWN",
          timestamp: new Date().toISOString()
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
  } catch (error: any) {
    console.error("Unexpected error in edge function:", error);
    console.error("Error details:", {
      name: error.name || "Unknown",
      message: error.message || "No message",
      stack: error.stack || "No stack trace"
    });
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to send email", 
        details: error.message || "Unknown error",
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
