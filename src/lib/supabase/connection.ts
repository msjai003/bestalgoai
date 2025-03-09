
import { supabase, supabaseUrl, supabaseAnonKey } from './client';
import { detectBrowserInfo } from './browser-detection';

// Test if the URL is reachable without Supabase
export const testDirectConnection = async () => {
  try {
    // First try to check internet connectivity in general
    const onlineStatus = navigator.onLine;
    if (!onlineStatus) {
      return { 
        success: false, 
        status: 'offline',
        statusText: 'No internet connection',
        isOffline: true 
      };
    }
    
    // Try connecting to a reliable service as a fallback test
    try {
      const googleResponse = await fetch('https://www.google.com', { 
        method: 'HEAD', 
        mode: 'no-cors',
        cache: 'no-store'
      });
      console.log('Google connectivity test:', googleResponse.type);
    } catch (e) {
      console.log('Unable to reach Google either, might be a network issue');
    }
    
    // Use a simple fetch to test direct URL access
    const response = await fetch(`${supabaseUrl}/auth/v1/`, {
      method: 'HEAD',
      mode: 'cors',
      credentials: 'include',
      cache: 'no-store',
      headers: {
        'apikey': supabaseAnonKey,
        'Content-Type': 'application/json'
      }
    });
    
    return { 
      success: response.ok, 
      status: response.status,
      statusText: response.statusText
    };
  } catch (error) {
    console.error('Direct connection test error:', error);
    return { 
      success: false, 
      error,
      isFetchError: true
    };
  }
};

// Helper function to test Supabase connection with specific guidance
export const testSupabaseConnection = async () => {
  try {
    console.log("Testing Supabase connection...");
    
    // First check if we're online at all
    if (!navigator.onLine) {
      return {
        success: false,
        error: new Error("You appear to be offline. Please check your internet connection."),
        isNetworkIssue: true,
        isOffline: true
      };
    }
    
    // Test direct access to the Supabase URL first
    const directTest = await testDirectConnection();
    if (!directTest.success) {
      console.log("Direct connection to Supabase URL failed:", directTest);
      
      // Try a different domain to test general internet connectivity
      try {
        const fallbackTest = await fetch('https://www.cloudflare.com', { 
          method: 'HEAD', 
          mode: 'no-cors',
          cache: 'no-store'
        });
        console.log('Fallback connectivity test:', fallbackTest.type);
        
        // If we can reach cloudflare but not Supabase, it might be a CORS/firewall issue
        return {
          success: false,
          error: new Error("Cannot reach Supabase, but other websites work. This suggests a network restriction or firewall blocking our service."),
          directTest,
          isNetworkIssue: false,
          isCorsOrCookieIssue: true,
          isSpecificDomainBlocked: true,
          browserInfo: detectBrowserInfo()
        };
      } catch (e) {
        // If we can't reach cloudflare either, it's likely a general network issue
        console.log('Fallback test also failed:', e);
      }
      
      return {
        success: false,
        error: new Error("Cannot reach our services directly. This may indicate network restrictions."),
        directTest,
        isNetworkIssue: true,
        isCorsOrCookieIssue: true,
        browserInfo: detectBrowserInfo()
      };
    }
    
    // Simple ping-style query that should always work
    const { data, error } = await supabase.from('user_profiles').select('count');
    
    if (error) {
      console.error('Supabase connection test error (query):', error);
      
      // Check for specific CORS or cookie-related errors
      if (error.message?.includes('fetch') || error.code === 'PGRST301') {
        return { 
          success: false, 
          error, 
          isCorsOrCookieIssue: true,
          browserInfo: detectBrowserInfo(),
          networkDetails: {
            onLine: navigator.onLine,
            userAgent: navigator.userAgent,
            cookiesEnabled: navigator.cookieEnabled
          }
        };
      }
      
      return { success: false, error };
    }
    
    console.log("Connection test successful:", data);
    return { success: true, data };
  } catch (error) {
    console.error('Supabase connection test exception:', error);
    
    // Check if this is a fetch/network error
    const isFetchError = error instanceof Error && 
      (error.message?.includes('fetch') || 
       error.message?.includes('network') ||
       error.message?.includes('Failed to fetch') ||
       error.message?.includes('NetworkError'));
       
    return { 
      success: false, 
      error,
      isCorsOrCookieIssue: isFetchError,
      isNetworkIssue: isFetchError,
      browserInfo: detectBrowserInfo(),
      networkDetails: {
        onLine: navigator.onLine,
        userAgent: navigator.userAgent,
        cookiesEnabled: navigator.cookieEnabled
      }
    };
  }
};
