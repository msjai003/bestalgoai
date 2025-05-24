
import { toast } from 'sonner';

/**
 * Checks if the app is installable
 * @returns {boolean} Whether the app can be installed
 */
export const isAppInstallable = (): boolean => {
  return !!(window.deferredPrompt && window.matchMedia('(display-mode: browser)').matches);
};

/**
 * Triggers the app installation prompt
 * @returns {Promise<boolean>} Whether the installation was successful
 */
export const installApp = async (): Promise<boolean> => {
  if (!window.deferredPrompt) {
    toast.info('This app is already installed or cannot be installed in this browser');
    return false;
  }
  
  // Show the install prompt
  window.deferredPrompt.prompt();
  
  try {
    // Wait for user choice
    const choiceResult = await window.deferredPrompt.userChoice;
    
    // Clear the saved prompt
    window.deferredPrompt = null;
    
    // Return whether it was accepted
    return choiceResult.outcome === 'accepted';
  } catch (error) {
    console.error('Installation error:', error);
    toast.error('Failed to install the app');
    return false;
  }
};
