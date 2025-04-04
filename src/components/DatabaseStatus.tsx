
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { RefreshCw, Database, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TableInfo {
  name: string;
  rowCount: number;
  exists: boolean;
}

const DatabaseStatus: React.FC = () => {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'untested' | 'success' | 'error'>('untested');
  const { toast } = useToast();

  const expectedTables = ['users', 'feedback'];

  const checkConnection = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Test Supabase connection using get_all_tables function
      const { data, error } = await supabase
        .rpc('get_all_tables')
        .limit(1);
      
      if (error) {
        throw error;
      }
      
      setConnectionStatus('success');
      toast({
        title: "Connection successful",
        description: "Successfully connected to Supabase",
      });
      
      // Now check tables
      await checkTables();
    } catch (err: any) {
      console.error("Database connection error:", err);
      setConnectionStatus('error');
      setError(err.message || "Could not connect to database");
      toast({
        title: "Connection failed",
        description: err.message || "Could not connect to database",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkTables = async () => {
    const tableResults: TableInfo[] = [];
    
    for (const tableName of expectedTables) {
      try {
        // Use execute_sql instead of direct rpc
        const { data, error } = await supabase
          .rpc('execute_sql', { 
            query: `SELECT COUNT(*) FROM public.${tableName}` 
          });
        
        if (error) {
          console.error(`Error checking table ${tableName}:`, error);
          tableResults.push({
            name: tableName,
            rowCount: 0,
            exists: false
          });
          continue;
        }
        
        // Check if data is an array and has items before accessing data[0]
        const count = Array.isArray(data) && data.length > 0 ? parseInt(data[0].count) : 0;
        
        tableResults.push({
          name: tableName,
          rowCount: count,
          exists: true
        });
        
      } catch (err) {
        console.error(`Error checking table ${tableName}:`, err);
        tableResults.push({
          name: tableName,
          rowCount: 0,
          exists: false
        });
      }
    }
    
    setTables(tableResults);
  };

  const runSampleQuery = async (tableName: string) => {
    try {
      // Use execute_sql instead of sample_query
      const { data, error } = await supabase
        .rpc('execute_sql', { 
          query: `SELECT * FROM public.${tableName} LIMIT 10` 
        });
      
      if (error) {
        throw error;
      }
      
      console.log(`Data from ${tableName}:`, data);
      
      toast({
        title: `Query successful`,
        description: `Found records in ${tableName}. Check console for details.`,
      });
    } catch (err: any) {
      toast({
        title: "Query failed",
        description: err.message || `Error querying ${tableName}`,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-gray-800/50 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center">
          <Database className="mr-2 h-5 w-5 text-blue-400" />
          Database Status
        </h2>
        <Button
          onClick={checkConnection}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </>
          )}
        </Button>
      </div>

      {connectionStatus === 'success' && (
        <div className="flex items-start p-3 bg-green-900/30 border border-green-700 rounded-lg">
          <CheckCircle className="text-green-400 mr-2 h-5 w-5 mt-0.5" />
          <div>
            <p className="text-green-200 font-medium">Connection Successful</p>
            <p className="text-green-300/70 text-sm">Connected to Supabase project</p>
          </div>
        </div>
      )}

      {connectionStatus === 'error' && (
        <div className="flex items-start p-3 bg-red-900/30 border border-red-700 rounded-lg">
          <AlertCircle className="text-red-400 mr-2 h-5 w-5 mt-0.5" />
          <div>
            <p className="text-red-200 font-medium">Connection Failed</p>
            <p className="text-red-300/70 text-sm">{error || "Could not connect to database"}</p>
          </div>
        </div>
      )}

      <Separator />

      <div className="space-y-4">
        <h3 className="text-md font-medium">Tables Status</h3>
        
        {tables.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {tables.map((table) => (
              <Card key={table.name} className="p-4 bg-gray-800/80 border border-gray-700">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    {table.exists ? (
                      <CheckCircle className="text-green-400 mr-2 h-4 w-4" />
                    ) : (
                      <X className="text-red-400 mr-2 h-4 w-4" />
                    )}
                    <h4 className="font-medium">{table.name}</h4>
                  </div>
                  {table.exists && (
                    <Button 
                      onClick={() => runSampleQuery(table.name)} 
                      variant="ghost" 
                      size="sm"
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-950/30"
                    >
                      Query
                    </Button>
                  )}
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  {table.exists ? (
                    `Table exists with approximately ${table.rowCount} rows`
                  ) : (
                    "Table does not exist or is not accessible"
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-gray-800/40 border border-gray-700 rounded-lg text-center">
            {isLoading ? (
              <p className="text-gray-400">Checking tables...</p>
            ) : (
              <p className="text-gray-400">No tables checked yet</p>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800/50 rounded-lg">
        <p className="text-blue-200 text-sm">
          Note: Tables may exist but show 0 rows if they're empty or if your access permissions are limited.
        </p>
      </div>
    </div>
  );
};

export default DatabaseStatus;
