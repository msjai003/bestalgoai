
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Lock, Shield, ServerCrash } from 'lucide-react';

const DatabaseManagement: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Database Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Database Operations</CardTitle>
            <Database className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Perform administrative operations on the database. Use these functions with caution.
            </p>
            <div className="flex flex-col space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Lock className="mr-2 h-4 w-4" />
                View Database Schema
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ServerCrash className="mr-2 h-4 w-4" />
                Backup Database
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Security Settings</CardTitle>
            <Shield className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Configure security settings and permissions for the database.
            </p>
            <div className="flex flex-col space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Manage Access Policies
              </Button>
              <Button variant="outline" className="w-full justify-start">
                View Audit Logs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-muted/20 p-4 rounded-md">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-background rounded-md">
            <Shield className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h3 className="font-medium mb-1">Database Administration</h3>
            <p className="text-sm text-muted-foreground">
              This section provides access to advanced database management functions. 
              For full database administration capabilities, please use the Supabase dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseManagement;
