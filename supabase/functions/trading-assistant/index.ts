
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to fetch educational content
async function fetchEducationalContent() {
  try {
    // Fetch education modules
    const { data: modules, error: modulesError } = await supabase
      .from('education_modules')
      .select('*')
      .order('order_index');
    
    if (modulesError) throw modulesError;
    
    // Fetch education content
    const { data: content, error: contentError } = await supabase
      .from('education_content')
      .select('*')
      .order('order_index');
    
    if (contentError) throw contentError;
    
    // Fetch quiz questions
    const { data: questions, error: questionsError } = await supabase
      .from('education_quiz_questions')
      .select('*, education_quiz_answers(*)');
    
    if (questionsError) throw questionsError;
    
    return {
      modules,
      content,
      questions
    };
  } catch (error) {
    console.error("Error fetching educational content:", error);
    return {
      modules: [],
      content: [],
      questions: []
    };
  }
}

// Main handler for the edge function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { query } = await req.json();
    
    if (!OPENAI_API_KEY) {
      throw new Error('Missing OpenAI API key');
    }
    
    // Fetch educational content from database to provide context
    const educationalContent = await fetchEducationalContent();
    
    // Format educational content as a string for context
    const modulesContext = educationalContent.modules.map(m => 
      `Module: ${m.title} (Level: ${m.level}) - ${m.description}`
    ).join('\n');
    
    const contentContext = educationalContent.content.map(c => 
      `Content: ${c.title} - ${c.content.substring(0, 200)}...`
    ).join('\n');
    
    const questionsContext = educationalContent.questions.map(q => 
      `Question: ${q.question} - ${q.explanation || ''}`
    ).join('\n');
    
    // Limit context size
    const context = `
    Available educational content:
    ${modulesContext.substring(0, 1500)}...
    
    Sample content:
    ${contentContext.substring(0, 1500)}...
    
    Sample questions:
    ${questionsContext.substring(0, 1000)}...
    `.substring(0, 4000);
    
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an algorithmic trading expert specializing in trading strategies, backtesting, risk management, and technical analysis. 
            You have access to educational content which helps you understand the user's context.
            
            When responding:
            1. Be precise, informative and educational
            2. Use markdown formatting for better readability
            3. Include examples where appropriate
            4. If discussing strategies, mention both pros and cons
            5. When appropriate, mention that the user can explore related topics in the Education section of the app
            
            Here's some educational content from the app to help with context:
            ${context}`
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });
    
    const data = await response.json();
    const generatedResponse = data.choices[0]?.message?.content || 
      "I'm sorry, but I couldn't generate a helpful response at this time.";
    
    return new Response(
      JSON.stringify({ response: generatedResponse }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in trading-assistant function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unknown error occurred' }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
