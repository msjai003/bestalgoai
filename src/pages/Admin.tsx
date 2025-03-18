
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersManagement from '@/components/admin/UsersManagement';
import BrokersManagement from '@/components/admin/BrokersManagement';
import StrategiesManagement from '@/components/admin/StrategiesManagement';
import DatabaseManagement from '@/components/admin/DatabaseManagement';
import SystemOverview from '@/components/admin/SystemOverview';
import Header from '@/components/Header';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#FF00D4] to-purple-600">
          Admin Dashboard
        </h1>
        
        <Tabs 
          defaultValue="overview" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="brokers">Brokers</TabsTrigger>
            <TabsTrigger value="strategies">Strategies</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <SystemOverview />
          </TabsContent>
          
          <TabsContent value="users" className="mt-6">
            <UsersManagement />
          </TabsContent>
          
          <TabsContent value="brokers" className="mt-6">
            <BrokersManagement />
          </TabsContent>
          
          <TabsContent value="strategies" className="mt-6">
            <StrategiesManagement />
          </TabsContent>
          
          <TabsContent value="database" className="mt-6">
            <DatabaseManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
