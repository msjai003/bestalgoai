
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, ChevronLeft, LineChart, Building, Database } from "lucide-react";
import UsersManagement from "@/components/admin/UsersManagement";
import BrokersManagement from "@/components/admin/BrokersManagement";
import StrategiesManagement from "@/components/admin/StrategiesManagement";
import SystemOverview from "@/components/admin/SystemOverview";
import { useAuth } from '@/contexts/AuthContext';

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Check if user is admin - this should be replaced with a proper role check
  // For now, we'll just check if the user exists
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              <Shield className="h-5 w-5" /> Access Denied
            </CardTitle>
            <CardDescription>
              You don't have permission to access the admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="w-full"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mr-2 p-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold flex items-center">
          <Shield className="mr-2 h-6 w-6 text-primary" />
          Admin Panel
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700 overflow-x-auto">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">
            <LineChart className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-gray-700">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="brokers" className="data-[state=active]:bg-gray-700">
            <Building className="h-4 w-4 mr-2" />
            Brokers
          </TabsTrigger>
          <TabsTrigger value="strategies" className="data-[state=active]:bg-gray-700">
            <LineChart className="h-4 w-4 mr-2" />
            Strategies
          </TabsTrigger>
          <TabsTrigger value="database" className="data-[state=active]:bg-gray-700">
            <Database className="h-4 w-4 mr-2" />
            Database
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <SystemOverview />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UsersManagement />
        </TabsContent>

        <TabsContent value="brokers" className="space-y-4">
          <BrokersManagement />
        </TabsContent>

        <TabsContent value="strategies" className="space-y-4">
          <StrategiesManagement />
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Database Management</CardTitle>
              <CardDescription>
                View and manage database entries and schema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center text-gray-400">
                <Database className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Database management tools will be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
