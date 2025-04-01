
import { supabase } from '@/lib/supabase/client';

/**
 * Sends a query to the AI trading assistant and returns the response
 * @param query The user's question or message
 * @returns The AI assistant's response as a string
 */
export const askTradingAssistant = async (query: string): Promise<string> => {
  try {
    // Call to the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('trading-assistant', {
      body: { query },
    });

    if (error) {
      console.error('Error calling trading assistant:', error);
      throw new Error(`Error calling assistant: ${error.message || 'Unknown error'}`);
    }

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
    const { data, error } = await supabase.functions.invoke('search-educational-content', {
      body: { keywords },
    });

    if (error) {
      console.error('Error searching educational content:', error);
      throw new Error(`Error searching content: ${error.message || 'Unknown error'}`);
    }

    return data?.results || [];
  } catch (error) {
    console.error('Error in getRelevantEducationalContent:', error);
    throw error;
  }
};
