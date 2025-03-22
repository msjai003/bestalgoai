
import React from 'react';
import { BottomNav } from '@/components/BottomNav';
import PriceAdminPanel from '@/components/admin/PriceAdminPanel';

const PriceAdminPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <h1 className="text-lg font-semibold">Price Admin Panel</h1>
        </div>
      </header>

      <main className="pt-20 px-4 pb-24">
        <PriceAdminPanel />
      </main>
      
      <BottomNav />
    </div>
  );
};

export default PriceAdminPage;
