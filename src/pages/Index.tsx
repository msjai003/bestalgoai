
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { CTA } from '@/components/CTA';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { BeforeInstallPromptEvent } from '@/types/installation';

const Index = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
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
      setIsInstallable(false);
      return;
    }
    
    // Handle the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Store the event for later use
      window.deferredInstallPrompt = e as BeforeInstallPromptEvent;
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, we'll show different instructions
    if (isIOSDevice && !isStandalone) {
      setIsInstallable(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!isInstallable) return;
    
    if (deferredPrompt) {
      try {
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const choiceResult = await deferredPrompt.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
          toast.success("Installation started! You'll find the app on your home screen soon.");
          setIsInstallable(false);
        } else {
          console.log('User dismissed the install prompt');
          toast.info("Installation declined. You can install later from the menu.");
        }
        
        // Clear the saved prompt since it can't be used again
        window.deferredInstallPrompt = null;
        setDeferredPrompt(null);
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
      const menuButton = document.getElementById('android-menu-button');
      if (menuButton) menuButton.classList.add('animate-pulse');
      
      toast.info("To install: tap the menu button and select 'Add to Home screen'", {
        duration: 8000
      });
    }
  };

  return (
    <div className="min-h-screen bg-charcoalPrimary text-charcoalTextPrimary">
      <Header />
      <div className="fixed top-16 right-4 z-50">
        {isInstallable && (
          <Button
            variant="outline"
            size="icon"
            className="bg-charcoalSecondary border-cyan/30 text-cyan rounded-full shadow-glow hover:bg-charcoalSecondary/80 hover:border-cyan/60"
            onClick={handleInstallClick}
            title="Install App"
          >
            <Download className="h-4 w-4" />
          </Button>
        )}
      </div>
      <main>
        <Hero />
        <div className="max-w-7xl mx-auto px-4">
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
