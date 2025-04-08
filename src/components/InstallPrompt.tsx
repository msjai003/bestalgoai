
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { toast } from 'sonner';
import { BeforeInstallPromptEvent } from '@/types/installation';
import IOSInstallInstructions from './install/IOSInstallInstructions';
import AndroidInstallInstructions from './install/AndroidInstallInstructions';
import GenericInstallInstructions from './install/GenericInstallInstructions';
import InstallButton from './install/InstallButton';

const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

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
      window.deferredInstallPrompt = e as BeforeInstallPromptEvent;
      setIsInstallable(true);
      
      // Show our custom install button immediately instead of after a delay
      const installPromptDismissed = localStorage.getItem('installPromptDismissed');
      if (!installPromptDismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, we'll show different instructions
    if (isIOSDevice && !isStandalone) {
      const installPromptDismissed = localStorage.getItem('installPromptDismissed');
      setIsInstallable(true);
      
      // Show the iOS prompt immediately instead of after a delay
      if (!installPromptDismissed) {
        setShowPrompt(true);
      }
    }

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      // Clear the prompt
      window.deferredInstallPrompt = null;
      setShowPrompt(false);
      setIsInstallable(false);
      // Show success message
      toast.success("App installed successfully!");
    });

    // Check if manifest exists and is correctly linked
    const linkManifest = document.querySelector('link[rel="manifest"]');
    if (!linkManifest) {
      console.error("No manifest link found in document head");
    }

    // Show a message to help users find the install option
    setTimeout(() => {
      if (!isStandalone && (window.deferredInstallPrompt || isIOSDevice || isAndroidDevice)) {
        toast.info("You can install this app on your device for a better experience!", {
          duration: 5000,
          position: "top-center"
        });
      }
    }, 2000);

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

  if (!showPrompt || !isInstallable) return null;

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
