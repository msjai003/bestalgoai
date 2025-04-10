
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { LogOut, User, Shield, Bell, Key } from "lucide-react";

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-charcoalPrimary text-white">
      <Header />
      
      <main className="pt-16 pb-20 px-4">
        <div className="my-6 flex items-center">
          <Link to="/dashboard" className="text-gray-400 mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold gradient-text">Settings</h1>
        </div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-700 mb-3">
            <User className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-white">{user?.displayName || "User"}</h2>
          <p className="text-gray-400">{user?.email}</p>
          <div className="mt-2">
            <span className="bg-cyan/10 text-cyan px-3 py-1 rounded-full text-sm border border-cyan/20">Premium Trader</span>
          </div>
        </div>
        
        <div className="glass-card p-4 mb-6">
          <h3 className="text-cyan text-lg mb-4">Account Settings</h3>
          
          <Link to="/settings/personal" className="flex items-center justify-between p-3 border-b border-gray-800 hover:bg-gray-800/30 rounded-lg transition-colors">
            <div className="flex items-center">
              <div className="bg-gray-800 p-2 rounded-lg mr-3">
                <User className="h-5 w-5 text-cyan" />
              </div>
              <span>Personal Details</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
          
          <Link to="/settings/security" className="flex items-center justify-between p-3 border-b border-gray-800 hover:bg-gray-800/30 rounded-lg transition-colors">
            <div className="flex items-center">
              <div className="bg-gray-800 p-2 rounded-lg mr-3">
                <Shield className="h-5 w-5 text-cyan" />
              </div>
              <span>Security Settings</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
          
          <Link to="/notifications" className="flex items-center justify-between p-3 hover:bg-gray-800/30 rounded-lg transition-colors">
            <div className="flex items-center">
              <div className="bg-gray-800 p-2 rounded-lg mr-3">
                <Bell className="h-5 w-5 text-cyan" />
              </div>
              <span>Notifications</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        </div>
        
        <div className="glass-card p-4 mb-6">
          <h3 className="text-cyan text-lg mb-4">Integration Settings</h3>
          
          <Link to="/api-keys" className="flex items-center justify-between p-3 hover:bg-gray-800/30 rounded-lg transition-colors">
            <div className="flex items-center">
              <div className="bg-gray-800 p-2 rounded-lg mr-3">
                <Key className="h-5 w-5 text-cyan" />
              </div>
              <span>API Keys</span>
            </div>
            <div className="flex items-center">
              <span className="bg-cyan/10 text-cyan px-2 py-0.5 rounded-full text-xs border border-cyan/20 mr-2">New</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </Link>
        </div>
        
        <Link to="/logout">
          <Button 
            variant="destructive" 
            className="w-full py-6 rounded-full shadow-lg" 
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </Link>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Settings;
