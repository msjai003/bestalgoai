
export const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  
  let browser = "unknown";
  if (userAgent.indexOf("Firefox") > -1) browser = "Firefox";
  if (userAgent.indexOf("Chrome") > -1) browser = "Chrome";
  if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) browser = "Safari";
  if (userAgent.indexOf("Edge") > -1) browser = "Edge";
  
  return {
    browser,
    isPrivateMode: !window.localStorage,
    userAgent: userAgent,
    cookiesEnabled: navigator.cookieEnabled
  };
};

export const validateEmail = (email: string) => {
  return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};
