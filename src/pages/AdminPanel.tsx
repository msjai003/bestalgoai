
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  BarChart, 
  Settings, 
  Database, 
  Users,
  FileSpreadsheet,
  BookOpen,
  CreditCard,
  ChevronLeft
} from 'lucide-react';

const AdminPanel = () => {
  const adminMenuItems = [
    {
      title: 'Import Backtest Data',
      description: 'Import CSV files with backtest data to the database',
      icon: <FileSpreadsheet className="h-6 w-6" />,
      link: '/backtest-import',
      color: 'bg-green-900/20 text-green-400 border-green-800'
    },
    {
      title: 'Strategy Config Admin',
      description: 'Manage strategy configuration options',
      icon: <Settings className="h-6 w-6" />,
      link: '/strategy-config-admin',
      color: 'bg-blue-900/20 text-blue-400 border-blue-800'
    },
    {
      title: 'Custom Strategy Admin',
      description: 'Manage user custom strategies',
      icon: <BarChart className="h-6 w-6" />,
      link: '/custom-strategy-admin',
      color: 'bg-purple-900/20 text-purple-400 border-purple-800'
    },
    {
      title: 'Pricing Plans Admin',
      description: 'Manage subscription pricing plans',
      icon: <CreditCard className="h-6 w-6" />,
      link: '/price-admin',
      color: 'bg-yellow-900/20 text-yellow-400 border-yellow-800'
    },
    {
      title: 'Broker Functions Admin',
      description: 'Manage broker integration functions',
      icon: <BookOpen className="h-6 w-6" />,
      link: '/broker-functions-admin',
      color: 'bg-pink-900/20 text-pink-400 border-pink-800'
    },
    {
      title: 'Database Information',
      description: 'View database tables and connection status',
      icon: <Database className="h-6 w-6" />,
      link: '/database-info',
      color: 'bg-cyan-900/20 text-cyan-400 border-cyan-800'
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 z-50">
          <div className="flex items-center justify-between px-4 h-16">
            <Link to="/dashboard" className="p-2">
              <ChevronLeft className="h-5 w-5 text-gray-400" />
            </Link>
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
            <div className="w-8"></div>
          </div>
        </header>

        <main className="pt-20 px-4 pb-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminMenuItems.map((item, index) => (
              <Card key={index} className={`${item.color} hover:shadow-lg transition-shadow`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="p-2 rounded-lg bg-black/20 backdrop-blur">
                      {item.icon}
                    </div>
                  </div>
                  <CardTitle className="text-lg mt-4">{item.title}</CardTitle>
                  <CardDescription className="text-gray-300">{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-black/30 hover:bg-black/40">
                    <Link to={item.link}>Access</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default AdminPanel;
