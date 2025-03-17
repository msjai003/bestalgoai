
import React from 'react';
import { Bell, Settings } from 'lucide-react';

export const UserProfileHeader = () => {
  return (
    <header className="sticky top-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 p-4 z-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img 
            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" 
            className="w-8 h-8 rounded-full" 
            alt="Profile" 
          />
          <div>
            <div className="text-sm font-semibold">Alex Turner</div>
            <div className="text-xs text-purple-400">Level 42 Trader</div>
          </div>
        </div>
        <div className="flex gap-4">
          <Bell className="text-gray-400 h-5 w-5" />
          <Settings className="text-gray-400 h-5 w-5" />
        </div>
      </div>
    </header>
  );
};
