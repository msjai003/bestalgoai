
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
import InstallButton from '@/components/install/InstallButton';

const Index = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

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

    // Check for iOS and Android
    const userAgent = navigator.userAgent || '';
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    const isAndroidDevice = /Android/.test(userAgent);
    
    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);
    
    if (isIOSDevice && !isStandalone) {
      setIsInstallable(true);
    }

    if (isAndroidDevice && !isStandalone) {
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

  return (
    <div className="min-h-screen bg-charcoalPrimary text-charcoalTextPrimary">
      <Header />
      <main>
        <Hero />
        <div className="max-w-7xl mx-auto px-4">
          {isInstallable && (
            <div className="fixed z-50 bottom-24 right-6">
              <Button
                onClick={() => {
                  if (window.showInstallPrompt) {
                    window.showInstallPrompt();
                  }
                }}
                className="bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white rounded-2xl shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity w-16 h-16"
                aria-label="Download App"
              >
                <InstallButton 
                  isIOS={isIOS} 
                  isAndroid={isAndroid} 
                  deferredPrompt={deferredPrompt}
                  className="w-full h-full flex items-center justify-center"
                >
                  <Download className="h-8 w-8" />
                </InstallButton>
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
