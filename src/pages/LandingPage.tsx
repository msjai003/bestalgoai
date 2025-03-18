
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            AI-Powered <span className="text-[#FF00D4]">Algorithmic Trading</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Leverage cutting-edge AI to automate your trading strategies and maximize returns.
          </p>
          <div className="mt-10">
            <Link to="/auth">
              <Button className="bg-[#FF00D4] hover:bg-[#FF00D4]/80 text-white px-8 py-3 rounded-md mr-4">
                Get Started
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" className="border-white text-white px-8 py-3 rounded-md">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
