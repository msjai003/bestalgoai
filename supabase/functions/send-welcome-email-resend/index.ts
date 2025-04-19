
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

    try {
      // Send the email
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
        console.error("Resend API Error Details:", error);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Resend API Error: ${error.message || 'Unknown error'}` 
          }),
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
      console.error("Comprehensive email sending error:", sendError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: sendError.message || "Comprehensive error in email sending process" 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
  } catch (error: any) {
    console.error("Unexpected error in welcome email function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An unexpected error occurred during email sending"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
