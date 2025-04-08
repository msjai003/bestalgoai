
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { CTA } from '@/components/CTA';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { BeforeInstallPromptEvent } from '@/types/installation';

const Index = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone || 
                          document.referrer.includes('android-app://');
    
    if (isStandalone) {
      setIsInstallable(false);
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

    // Check for iOS
    const userAgent = navigator.userAgent || '';
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    
    if (isIOSDevice && !isStandalone) {
      setIsInstallable(true);
    }

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      // Clear the prompt
      window.deferredInstallPrompt = null;
      setDeferredPrompt(null);
      setIsInstallable(false);
      // Show success message
      toast.success("App installed successfully!");
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        // Show the install prompt
        await deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const choiceResult = await deferredPrompt.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
          toast.success("Installation started! You'll find the app on your home screen soon.");
        } else {
          console.log('User dismissed the install prompt');
          toast.info("Installation declined. You can install later if needed.");
        }
        
        // Clear the saved prompt since it can't be used again
        window.deferredInstallPrompt = null;
        setDeferredPrompt(null);
        setIsInstallable(false);
      } catch (error) {
        console.error('Error during installation:', error);
        toast.error("Installation failed. Please try again.");
      }
    } else {
      // For iOS or other platforms where the deferredPrompt is not available
      const userAgent = navigator.userAgent || '';
      const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
      const isAndroidDevice = /Android/.test(userAgent);
      
      if (isIOSDevice) {
        toast.info("To install: tap the share button and select 'Add to Home Screen'", {
          duration: 5000
        });
      } else if (isAndroidDevice) {
        toast.info("To install: tap the menu button and select 'Add to Home screen'", {
          duration: 5000
        });
      } else {
        toast.info("To install, use your browser's menu options to add this site to your home screen", {
          duration: 5000
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-charcoalPrimary text-charcoalTextPrimary">
      <Header />
      <main>
        <Hero />
        <div className="max-w-7xl mx-auto px-4">
          {isInstallable && (
            <div className="flex justify-center my-6">
              <Button
                onClick={handleInstallClick}
                className="bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <Download className="mr-2 h-5 w-5" />
                Install BestAlgo.ai App
              </Button>
            </div>
          )}
          <Features />
          <div className="max-w-4xl mx-auto">
            <CTA />
          </div>
        </div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default Index;
