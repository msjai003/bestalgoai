
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { BeforeInstallPromptEvent } from '@/types/installation';
import { toast } from 'sonner';

interface InstallButtonProps {
  isIOS: boolean;
  isAndroid: boolean;
  deferredPrompt: BeforeInstallPromptEvent | null;
}

const InstallButton = ({ isIOS, isAndroid, deferredPrompt }: InstallButtonProps) => {
  const handleInstallClick = async () => {
    if (!deferredPrompt && !isIOS && !isAndroid) return;
    
    if (deferredPrompt) {
      try {
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const choiceResult = await deferredPrompt.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
          toast.success("Installation started");
        } else {
          console.log('User dismissed the install prompt');
          toast.info("Installation declined");
        }
        
        // Clear the saved prompt since it can't be used again
        window.deferredInstallPrompt = null;
      } catch (error) {
        console.error('Error during installation:', error);
        toast.error("Installation failed. Please try again.");
      }
    } else if (isIOS) {
      // For iOS, provide more visible instructions with animation
      const shareButton = document.getElementById('ios-share-button');
      if (shareButton) shareButton.classList.add('animate-pulse');
      
      toast.info("To install: tap the share button and select 'Add to Home Screen'", {
        duration: 8000
      });
    } else if (isAndroid) {
      // For Android without install prompt
      toast.info("To install: tap the menu button (⋮) and select 'Add to Home screen'", {
        duration: 8000
      });
    }
  };

  return (
    <Button
      onClick={handleInstallClick}
      className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity"
    >
      <Download className="mr-2 h-4 w-4" />
      {isIOS ? "Got it" : isAndroid ? "Install App" : "Install App"}
    </Button>
  );
};

export default InstallButton;
