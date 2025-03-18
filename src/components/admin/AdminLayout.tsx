
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  BarChart3, 
  Settings, 
  Database, 
  CreditCard, 
  AlertTriangle,
  Home,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();

  const navigationItems = [
    { 
      name: 'Dashboard', 
      href: '/admin', 
      icon: Home 
    },
    { 
      name: 'Users', 
      href: '/admin/users', 
      icon: Users 
    },
    { 
      name: 'User Strategies', 
      href: '/admin/strategies', 
      icon: BarChart3 
    },
    { 
      name: 'Predefined Strategies', 
      href: '/admin/strategies-editor', 
      icon: BookOpen 
    },
    { 
      name: 'Subscriptions', 
      href: '/admin/subscriptions', 
      icon: CreditCard 
    },
    { 
      name: 'System Logs', 
      href: '/admin/logs', 
      icon: Database 
    },
    { 
      name: 'Settings', 
      href: '/admin/settings', 
      icon: Settings 
    },
    { 
      name: 'Alerts', 
      href: '/admin/alerts', 
      icon: AlertTriangle 
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0">
        <div className="flex flex-col flex-grow border-r border-gray-800 pt-5 bg-gray-900 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-5">
            <Link to="/" className="flex items-center">
              <i className="fa-solid fa-chart-line text-[#FF00D4] text-2xl mr-2"></i>
              <span className="text-xl font-semibold">Admin Panel</span>
            </Link>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive 
                        ? "bg-gray-800 text-white" 
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    )}
                  >
                    <item.icon 
                      className={cn(
                        "mr-3 h-5 w-5",
                        isActive ? "text-[#FF00D4]" : "text-gray-400 group-hover:text-gray-300"
                      )} 
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="p-4">
            <Button
              variant="outline"
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
              asChild
            >
              <Link to="/dashboard">
                Exit Admin Panel
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-800 w-full">
        <Link to="/admin" className="flex items-center">
          <i className="fa-solid fa-chart-line text-[#FF00D4] text-xl mr-2"></i>
          <span className="text-lg font-semibold">Admin Panel</span>
        </Link>
        
        <div className="relative">
          {/* Simple dropdown for mobile navigation */}
          <select
            className="bg-gray-800 border border-gray-700 rounded-md text-white py-2 pl-3 pr-8 appearance-none cursor-pointer"
            onChange={(e) => {
              if (e.target.value) window.location.href = e.target.value;
            }}
            value={location.pathname}
          >
            {navigationItems.map((item) => (
              <option key={item.name} value={item.href}>
                {item.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col md:ml-64 flex-1">
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
