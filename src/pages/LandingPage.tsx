
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-[#FF00D4]">Trading Platform</div>
          <div>
            <Link to="/auth">
              <Button variant="outline" className="mr-2">Login</Button>
            </Link>
            <Link to="/auth?tab=register">
              <Button className="bg-[#FF00D4] hover:bg-[#FF00D4]/80">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">Advanced Trading Strategies</h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Take control of your investments with our professional trading platform featuring
            algorithmic strategies, real-time market data, and advanced risk management.
          </p>
          <Link to="/auth?tab=register">
            <Button size="lg" className="bg-[#FF00D4] hover:bg-[#FF00D4]/80 text-lg px-8">
              Get Started
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
