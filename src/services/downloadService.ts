
import { toast } from 'sonner';

/**
 * Checks if the app is installable as a PWA
 * @returns {boolean} Whether the app can be installed
 */
export const isAppInstallable = (): boolean => {
  return !!(window.deferredPrompt && window.matchMedia('(display-mode: browser)').matches);
};

/**
 * Triggers the app installation prompt or provides download alternatives
 * @returns {Promise<boolean>} Whether the operation was successful
 */
export const installApp = async (): Promise<boolean> => {
  // Try PWA installation first
  if (window.deferredPrompt) {
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
      // Fall through to alternative download
    }
  }
  
  // If PWA installation is not available or failed, offer a traditional download
  provideAlternativeDownload();
  return true;
};

/**
 * Provides alternative download options when PWA installation is not available
 */
const provideAlternativeDownload = (): void => {
  // Create a zip file containing the essential app files
  const downloadLink = document.createElement('a');
  downloadLink.href = '/downloads/bestalgo-app.zip';
  downloadLink.download = 'bestalgo-app.zip';
  downloadLink.target = '_blank';
  
  // Show toast with instructions
  toast.info('Starting download. Extract the ZIP file and open index.html to use the app offline.', {
    duration: 5000
  });
  
  // Trigger the download
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

