import { supabase, supabaseUrl, supabaseAnonKey, isProxyEnabled } from './client';
import { detectBrowserInfo } from './browser-detection';

// Test if the URL is reachable without Supabase
export const testDirectConnection = async () => {
  try {
    // First check if Supabase credentials are available
    if (!supabaseUrl || !supabaseAnonKey) {
      return { 
        success: false, 
        status: 'missing_credentials',
        statusText: 'Missing Supabase credentials. Please check environment variables.',
        error: new Error('Missing Supabase credentials')
      };
    }

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
    
    // If proxy is enabled, try using the proxy
    if (isProxyEnabled()) {
      try {
        const proxyUrl = 'http://localhost:4000/proxy';
        const proxyResponse = await fetch(`${proxyUrl}/auth/v1/`, {
          method: 'HEAD',
          headers: {
            'apikey': supabaseAnonKey,
            'Content-Type': 'application/json'
          }
        });
        
        return {
          success: proxyResponse.ok,
          status: proxyResponse.status,
          statusText: proxyResponse.statusText,
          usingProxy: true
        };
      } catch (proxyError) {
        console.error('Proxy connection test error:', proxyError);
        return {
          success: false,
          error: proxyError,
          isFetchError: true,
          proxyFailed: true
        };
      }
    }
    
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
    console.log("Proxy enabled:", isProxyEnabled());
    
    // Check if Supabase credentials are available
    if (!supabaseUrl || !supabaseAnonKey) {
      return {
        success: false,
        error: new Error("Missing Supabase credentials. Please check environment variables."),
        isMissingCredentials: true
      };
    }
    
    // First check if we're online at all
    if (!navigator.onLine) {
      return {
        success: false,
        error: new Error("You appear to be offline. Please check your internet connection."),
        isNetworkIssue: true,
        isOffline: true
      };
    }
    
    // Get browser info for better troubleshooting
    const browserInfo = detectBrowserInfo();
    const isChrome = browserInfo.browser === 'Chrome';
    
    // Test direct access to the Supabase URL first
    const directTest = await testDirectConnection();
    if (!directTest.success) {
      console.log("Direct connection to Supabase URL failed:", directTest);
      
      // If the proxy is enabled and we have a proxy failure, suggest starting the proxy server
      if (isProxyEnabled() && directTest.proxyFailed) {
        return {
          success: false,
          error: new Error("The CORS proxy server appears to be offline. Please start the proxy server with 'node proxy-server.js'"),
          directTest,
          isNetworkIssue: false,
          proxyOffline: true,
          browserInfo
        };
      }
      
      // Try a different domain to test general internet connectivity
      try {
        const fallbackTest = await fetch('https://www.cloudflare.com', { 
          method: 'HEAD', 
          mode: 'no-cors',
          cache: 'no-store'
        });
        console.log('Fallback connectivity test:', fallbackTest.type);
        
        // If we can reach cloudflare but not Supabase, it might be a CORS/firewall issue
        let errorMessage = "Cannot reach Supabase, but other websites work. This suggests a network restriction or firewall blocking our service.";
        
        if (isChrome) {
          errorMessage = "Chrome is blocking connection to our services. This is likely due to third-party cookie settings or a network restriction.";
        }
        
        // Suggest enabling the proxy
        if (!isProxyEnabled()) {
          errorMessage += " Try enabling the CORS proxy server option below.";
        }
        
        return {
          success: false,
          error: new Error(errorMessage),
          directTest,
          isNetworkIssue: false,
          isCorsOrCookieIssue: true,
          isSpecificDomainBlocked: true,
          browserInfo
        };
      } catch (e) {
        // If we can't reach cloudflare either, it's likely a general network issue
        console.log('Fallback test also failed:', e);
      }
      
      let errorMessage = "Cannot reach our services directly. This may indicate network restrictions.";
      
      if (isChrome) {
        errorMessage = "Chrome cannot connect to our services. Please check your network settings and ensure third-party cookies are enabled.";
      }
      
      // Suggest enabling the proxy
      if (!isProxyEnabled()) {
        errorMessage += " Try enabling the CORS proxy server option below.";
      }
      
      return {
        success: false,
        error: new Error(errorMessage),
        directTest,
        isNetworkIssue: true,
        isCorsOrCookieIssue: true,
        browserInfo
      };
    }
    
    // Simple ping-style query that should always work
    const { data, error } = await supabase.from('user_profiles').select('count');
    
    if (error) {
      console.error('Supabase connection test error (query):', error);
      
      // Check for specific CORS or cookie-related errors
      if (error.message?.includes('fetch') || error.code === 'PGRST301') {
        let errorMessage = "Browser security settings are preventing connection to our services.";
        
        if (isChrome) {
          errorMessage = "Chrome's security settings are blocking our connection. Please check that third-party cookies are allowed for this site.";
        }
        
        // If proxy is not enabled, suggest it
        if (!isProxyEnabled()) {
          errorMessage += " Try enabling the CORS proxy server option below.";
        }
        
        return { 
          success: false, 
          error: new Error(errorMessage), 
          isCorsOrCookieIssue: true,
          browserInfo,
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
    return { 
      success: true, 
      data,
      usingProxy: isProxyEnabled() 
    };
  } catch (error) {
    console.error('Supabase connection test exception:', error);
    
    // Get browser info for better troubleshooting
    const browserInfo = detectBrowserInfo();
    const isChrome = browserInfo.browser === 'Chrome';
    
    // Check if this is a fetch/network error
    const isFetchError = error instanceof Error && 
      (error.message?.includes('fetch') || 
       error.message?.includes('network') ||
       error.message?.includes('Failed to fetch') ||
       error.message?.includes('NetworkError'));
    
    let errorMessage = "Connection error detected. Please check your network settings.";
    
    if (isChrome && isFetchError) {
      errorMessage = "Chrome cannot connect to our services. This is often caused by third-party cookie settings or network restrictions.";
    }
    
    // If proxy is not enabled, suggest it
    if (!isProxyEnabled() && isFetchError) {
      errorMessage += " Try enabling the CORS proxy server option below.";
    }
       
    return { 
      success: false, 
      error: new Error(errorMessage),
      isCorsOrCookieIssue: isFetchError,
      isNetworkIssue: isFetchError,
      browserInfo,
      networkDetails: {
        onLine: navigator.onLine,
        userAgent: navigator.userAgent,
        cookiesEnabled: navigator.cookieEnabled
      }
    };
  }
};

// Add a new alternate connection method that works around browser restrictions 
export const tryAlternateConnection = async () => {
  try {
    // First determine if we're online at all
    if (!navigator.onLine) {
      return {
        success: false,
        error: new Error("You appear to be offline. Please check your internet connection."),
        isOffline: true
      };
    }
    
    const browserInfo = detectBrowserInfo();
    
    // If proxy is enabled, try using the proxy directly
    if (isProxyEnabled()) {
      try {
        const proxyUrl = 'http://localhost:4000/proxy';
        const response = await fetch(`${proxyUrl}/rest/v1/user_profiles?select=count`, {
          headers: {
            'apikey': supabaseAnonKey,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          console.log("Connection via proxy successful");
          return {
            success: true,
            method: 'proxy',
            browserInfo
          };
        }
      } catch (proxyError) {
        console.error("Proxy connection failed:", proxyError);
        return {
          success: false,
          error: new Error("Could not connect via the proxy server. Please make sure it's running with 'node proxy-server.js'"),
          proxyFailed: true
        };
      }
    }
    
    // Attempt to use a simpler version of the client with different options
    const alternateUrl = supabaseUrl.replace('https://', 'https://alternate-');
    
    // Try to create a public endpoint proxy that bypasses CORS restrictions
    // This only works if your Supabase project has such an endpoint configured
    try {
      // Use a simplified config to reduce chances of CORS issues
      const simpleResponse = await fetch(`${supabaseUrl}/rest/v1/user_profiles?select=count`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-store',
        headers: {
          'apikey': supabaseAnonKey,
          'Accept': 'application/json'
        }
      });
      
      if (simpleResponse.ok) {
        console.log("Alternate connection successful using simplified fetch");
        return {
          success: true,
          method: 'simplified-fetch',
          browserInfo
        };
      }
    } catch (fetchError) {
      console.log("Simplified fetch approach failed:", fetchError);
    }
    
    // As a last resort, we can use the offline mode and try to sync later
    return {
      success: false,
      fallbackToOffline: true,
      error: new Error("All connection methods failed. Using offline mode."),
      browserInfo
    };
  } catch (error) {
    console.error("All alternate connection methods failed:", error);
    return {
      success: false,
      error: new Error("Unable to establish any connection to our services."),
      useOfflineMode: true
    };
  }
};
