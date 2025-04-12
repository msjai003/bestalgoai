
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { toast } from 'sonner';
import { BeforeInstallPromptEvent } from '@/types/installation';
import IOSInstallInstructions from './install/IOSInstallInstructions';
import AndroidInstallInstructions from './install/AndroidInstallInstructions';
import GenericInstallInstructions from './install/GenericInstallInstructions';
import InstallButton from './install/InstallButton';

// Save a global reference to the deferredPrompt for use by other components
declare global {
  interface Window {
    deferredInstallPrompt: BeforeInstallPromptEvent | null;
    showInstallPrompt: () => void;
  }
}

const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Check for various platform types
    const userAgent = navigator.userAgent || '';
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    const isAndroidDevice = /Android/.test(userAgent);
    
    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);
    
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone || 
                          document.referrer.includes('android-app://');
    
    if (isStandalone) {
      setShowPrompt(false);
      return;
    }
    
    // Handle the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Store the event for later use
      const promptEvent = e as BeforeInstallPromptEvent;
      window.deferredInstallPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, we'll show different instructions
    if (isIOSDevice && !isStandalone) {
      setIsInstallable(true);
    }

    // Create a global function to show the install prompt
    window.showInstallPrompt = () => {
      const installPromptDismissed = localStorage.getItem('installPromptDismissed');
      if (!installPromptDismissed || isInstallable) {
        setShowPrompt(true);
      } else {
        toast.info("You've previously dismissed the install prompt. The app is still available to install.");
      }
    };

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      // Clear the prompt
      window.deferredInstallPrompt = null;
      setDeferredPrompt(null);
      setShowPrompt(false);
      setIsInstallable(false);
      // Show success message
      toast.success("App installed successfully!");
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  const dismissPrompt = () => {
    setShowPrompt(false);
    // Save in localStorage that user has dismissed the prompt
    localStorage.setItem('installPromptDismissed', 'true');
    // Show a toast to let users know they can still install later
    toast.info("You can install the app later from the menu", {
      duration: 3000
    });
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-gradient-to-r from-gray-800/95 to-gray-900/95 backdrop-blur-lg border border-purple-700 rounded-xl p-4 shadow-lg z-50 animate-in fade-in duration-300">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-white font-semibold flex items-center">
          <Download className="h-5 w-5 mr-2 text-[#FF00D4]" />
          Install BestAlgo.ai
        </h3>
        <Button variant="ghost" size="icon" onClick={dismissPrompt} className="p-1 h-auto w-auto text-gray-400">
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {isIOS ? (
        <IOSInstallInstructions />
      ) : isAndroid ? (
        <AndroidInstallInstructions />
      ) : (
        <GenericInstallInstructions />
      )}
      
      <InstallButton 
        isIOS={isIOS} 
        isAndroid={isAndroid} 
        deferredPrompt={window.deferredInstallPrompt} 
      />
    </div>
  );
};

export default InstallPrompt;
