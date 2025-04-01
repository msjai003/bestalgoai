
import React from 'react';
import { BottomNav } from '@/components/BottomNav';
import Header from '@/components/Header';

const Home = () => {
  return (
    <div className="min-h-screen bg-charcoalPrimary">
      <Header />
      <main className="pt-16 pb-20 px-4">
        <h1 className="text-2xl font-bold text-white mb-4">Welcome to BestAlgo.ai</h1>
        <p className="text-gray-300">Your algorithmic trading assistant</p>
      </main>
      <BottomNav />
    </div>
  );
};

export default Home;
