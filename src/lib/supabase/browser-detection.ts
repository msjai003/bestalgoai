
// Helper function to detect browser information
export const detectBrowserInfo = () => {
  if (typeof navigator === 'undefined') {
    return {
      browser: 'Unknown',
      isPrivateMode: false,
      userAgent: 'Unknown',
      cookiesEnabled: false
    };
  }
  
  const userAgent = navigator.userAgent || '';
  
  let browser = "Unknown";
  if (userAgent.indexOf("Firefox") > -1) browser = "Firefox";
  if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Edg") === -1) browser = "Chrome";
  if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) browser = "Safari";
  if (userAgent.indexOf("Edg") > -1) browser = "Edge";
  
  return {
    browser,
    isPrivateMode: !window.localStorage,
    userAgent: userAgent,
    cookiesEnabled: navigator.cookieEnabled
  };
};

// Get browser-specific instructions for enabling cookies/fixing connection issues
export const getFirefoxInstructions = () => {
  const userAgent = navigator.userAgent || '';
  const isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Edg") === -1;
  const isFirefox = userAgent.indexOf("Firefox") > -1;
  const isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1;
  
  if (isChrome) {
    return {
      title: "Chrome Browser Settings",
      steps: [
        "Open Chrome Settings (click the three dots in the top right corner)",
        "Scroll down and click on 'Privacy and security'",
        "Click on 'Cookies and other site data'",
        "Make sure 'Block third-party cookies in Incognito' is unchecked",
        "Check 'Allow all cookies' or add our site to the allowed list",
        "Return to this page and click 'Test Connection' again"
      ]
    };
  }
  
  if (isFirefox) {
    return {
      title: "Firefox Privacy Settings",
      steps: [
        "Open Firefox Settings (click the hamburger menu in the top right)",
        "Click on 'Privacy & Security'",
        "Under 'Enhanced Tracking Protection', select 'Standard' or 'Custom'",
        "If 'Custom', ensure 'Cookies' is set to 'All cookies' or 'Cross-site tracking cookies'",
        "Click the shield icon in the address bar and disable protection for this site",
        "Reload the page and try again"
      ]
    };
  }
  
  if (isSafari) {
    return {
      title: "Safari Privacy Settings",
      steps: [
        "Open Safari Preferences (Safari menu > Preferences)",
        "Click on the 'Privacy' tab",
        "Uncheck 'Prevent cross-site tracking'",
        "Ensure 'Block all cookies' is NOT selected",
        "Close preferences, reload the page and try again"
      ]
    };
  }
  
  return {
    title: "Browser Privacy Settings",
    steps: [
      "Check your browser's privacy settings and ensure cookies are enabled",
      "Disable any tracking protection features for this site",
      "Check if you have a content blocker or firewall that might be blocking our service",
      "Try using a different browser like Chrome or Firefox",
      "Reload the page and try again"
    ]
  };
};
