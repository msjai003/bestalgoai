
import React, { useState, useEffect } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BrokerImageManager from '@/components/broker-integration/BrokerImageManager';
import { supabase } from "@/integrations/supabase/client";
import { ensureAllBrokerImagesInDatabase } from '@/utils/ensureBrokerImages';
import { toast } from 'sonner';

const BrokerManagement = () => {
  const [activeTab, setActiveTab] = useState('images');
  const [isLoading, setIsLoading] = useState(true);

  // Check if the storage bucket exists and create it if it doesn't
  const ensureStorageBucket = async () => {
    try {
      // Check if the bucket already exists
      const { data: bucketData, error: bucketError } = await supabase
        .storage
        .getBucket('broker-logos');
      
      // If the bucket doesn't exist, create it
      if (bucketError && bucketError.message.includes('does not exist')) {
        console.log('Creating broker-logos bucket...');
        const { data, error } = await supabase
          .storage
          .createBucket('broker-logos', {
            public: true,  // Make the bucket public
            fileSizeLimit: 5242880  // 5MB file size limit
          });
          
        if (error) {
          console.error('Error creating broker-logos bucket:', error);
          toast.error('Failed to set up storage for broker images');
        } else {
          console.log('Broker-logos bucket created successfully');
        }
      }
    } catch (error) {
      console.error('Error checking/creating broker-logos bucket:', error);
    }
  };

  useEffect(() => {
    const initializeBrokerData = async () => {
      setIsLoading(true);
      try {
        // Ensure storage bucket exists
        await ensureStorageBucket();
        
        // Ensure all broker images are in the database
        await ensureAllBrokerImagesInDatabase();
      } catch (error) {
        console.error('Error initializing broker data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeBrokerData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <h1 className="text-lg font-semibold">Broker Management</h1>
        </div>
      </header>

      <main className="pt-20 px-4 pb-24">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="images" className="mt-0">
            <BrokerImageManager />
          </TabsContent>
          
          <TabsContent value="config" className="mt-0">
            <div className="p-6 text-center text-gray-400">
              <p>Broker configuration management coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default BrokerManagement;
