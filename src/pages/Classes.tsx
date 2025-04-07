
import React from 'react';
import Header from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';

const Classes = () => {
  return (
    <div className="min-h-screen bg-charcoalPrimary text-white">
      <Header />
      
      <main className="pt-16 pb-20 px-4">
        <section className="py-8">
          <h1 className="text-2xl font-bold mb-4">
            <span className="text-cyan">Classes</span> Coming Soon
          </h1>
          <p className="text-gray-300">
            Our trading masterclasses will be available here shortly. Check back later for updates.
          </p>
        </section>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Classes;
