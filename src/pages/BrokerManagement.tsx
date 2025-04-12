
import React, { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BrokerImageManager from '@/components/broker-integration/BrokerImageManager';

const BrokerManagement = () => {
  const [activeTab, setActiveTab] = useState('images');

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
