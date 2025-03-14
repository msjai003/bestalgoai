
import React from 'react';
import Header from '@/components/Header';
import { BottomNav } from "@/components/BottomNav";
import { Heart } from 'lucide-react';

const Wishlist = () => {
  return (
    <div className="bg-gray-900 min-h-screen">
      <Header />
      <main className="pt-16 pb-20 px-4">
        <section className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Wishlist</h3>
          </div>
          
          <div className="flex flex-col items-center justify-center h-64 bg-gray-800/50 rounded-xl border border-gray-700 p-6">
            <Heart className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-300 text-center">
              Your wishlist is empty. Add items from the Strategies section.
            </p>
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
};

export default Wishlist;
