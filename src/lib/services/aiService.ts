
import { supabase } from '@/integrations/supabase/client';

/**
 * Sends a query to the AI trading assistant and returns the response
 * @param query The user's question or message
 * @returns The AI assistant's response as a string
 */
export const askTradingAssistant = async (query: string): Promise<string> => {
  try {
    // Create a fetch request directly to the Supabase Edge Function
    const response = await fetch('https://fzvrozrjtvflksumiqsk.supabase.co/functions/v1/trading-assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.auth.session()?.access_token || ''}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Error calling assistant: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Return the assistant's response
    return data?.response || 'I apologize, but I couldn\'t generate a helpful response.';
  } catch (error) {
    console.error('Error in askTradingAssistant:', error);
    throw error;
  }
};

/**
 * Gets relevant educational content based on keywords
 * @param keywords Array of keywords to search for
 * @returns Educational content that matches the keywords
 */
export const getRelevantEducationalContent = async (keywords: string[]): Promise<any[]> => {
  try {
    // Create a fetch request directly to the Supabase Edge Function
    const response = await fetch('https://fzvrozrjtvflksumiqsk.supabase.co/functions/v1/search-educational-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.auth.session()?.access_token || ''}`,
      },
      body: JSON.stringify({ keywords }),
    });

    if (!response.ok) {
      throw new Error(`Error searching content: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data?.results || [];
  } catch (error) {
    console.error('Error in getRelevantEducationalContent:', error);
    throw error;
  }
};
