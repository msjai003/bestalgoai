
import { supabaseUrl, supabaseAnonKey } from './client';

// Function to detect browser information for better error messages
export function detectBrowserInfo() {
  if (typeof navigator === 'undefined') {
    return {
      browser: "unknown",
      isPrivateMode: false,
      userAgent: "",
      cookiesEnabled: false
    };
  }
  
  const userAgent = navigator.userAgent;
  const isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Edg") === -1;
  const isFirefox = userAgent.indexOf("Firefox") > -1;
  const isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1;
  const isEdge = userAgent.indexOf("Edg") > -1;
  const isPrivateMode = !window.localStorage;

  let browserName = "unknown";
  if (isChrome) browserName = "Chrome";
  if (isFirefox) browserName = "Firefox";
  if (isSafari) browserName = "Safari";
  if (isEdge) browserName = "Edge";

  return {
    browser: browserName,
    isPrivateMode: isPrivateMode,
    userAgent: userAgent,
    cookiesEnabled: navigator.cookieEnabled
  };
}

// Add a function to get browser-specific instructions for Firefox
export const getFirefoxInstructions = () => {
  // Make sure userAgent is defined
  if (typeof navigator === 'undefined') {
    return {
      title: "Connection Issues",
      steps: [
        "Check your internet connection and make sure you're online",
        "Try reloading the page",
        "Try using a different browser like Chrome or Edge",
      ]
    };
  }
  
  // Detect if using Chrome
  const userAgent = navigator.userAgent;
  const isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Edg") === -1;
  
  if (isChrome) {
    return {
      title: "Chrome Connection Issues",
      steps: [
        "Check your internet connection and make sure you're online",
        "Check if you're using any VPN or proxy services that might be blocking our connection",
        "Open Chrome settings and go to Privacy and Security → Site Settings → Cookies and site data",
        "Make sure 'Block third-party cookies' is turned off or add this site to exceptions",
        "Try clearing your browser cache and cookies for this site",
        "Disable any browser extensions temporarily",
        "Try using a different internet connection (like mobile data)"
      ]
    };
  }
  
  // Default Firefox instructions
  return {
    title: "Connection Issues",
    steps: [
      "Check your internet connection and make sure you're online",
      "Try reloading the page",
      "If using Firefox: Click the shield icon in the address bar and turn off 'Enhanced Tracking Protection'",
      "If using Chrome/Edge: Try disabling any extensions that might block requests",
      "If using Safari: Go to Preferences > Privacy and uncheck 'Prevent Cross-Site Tracking'",
      "Try using a different browser like Chrome or Edge",
      "Make sure cookies are enabled in your browser settings",
      "If possible, try using a non-private/non-incognito window"
    ]
  };
};

// Add a function to check for common Firefox issues
export const checkFirefoxCompatibility = () => {
  if (typeof navigator === 'undefined') {
    return {
      isFirefox: false,
      isSafari: false,
      cookiesEnabled: false,
      isPrivate: false,
      hasETP: false
    };
  }
  
  const isFirefox = navigator.userAgent.indexOf("Firefox") > -1;
  const isSafari = navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") === -1;
  
  // Check if cookies are enabled
  const cookiesEnabled = navigator.cookieEnabled;
  
  // Check if in private browsing (approximate detection)
  let isPrivate = false;
  try {
    localStorage.setItem("test", "test");
    localStorage.removeItem("test");
  } catch (e) {
    isPrivate = true;
  }
  
  return {
    isFirefox,
    isSafari,
    cookiesEnabled,
    isPrivate,
    hasETP: isFirefox // Assume ETP is on by default in Firefox
  };
};
