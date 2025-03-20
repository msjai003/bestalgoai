
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

    // In a production environment, you would use a service like Resend, SendGrid, etc.
    // For demo purposes, we're just logging the email
    console.log(`EMAIL WOULD BE SENT TO: ${email}`);
    console.log(`RECIPIENT NAME: ${name}`);
    console.log(`MESSAGE: ${welcomeMessage || "Thank you for signing up with InfoCap Company!"}`);

    // For implementation with an actual email service (e.g., Resend):
    /*
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set");
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "onboarding@yourdomain.com",
        to: email,
        subject: "Welcome to InfoCap Company!",
        html: `<p>Hello ${name},</p><p>${welcomeMessage}</p>`
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to send email");
    }
    */

    return new Response(
      JSON.stringify({ success: true, message: "Email would be sent in production" }),
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
