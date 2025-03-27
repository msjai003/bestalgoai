
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Code, Brain } from 'lucide-react';

export const LevelsPreview = () => {
  const navigate = useNavigate();
  
  const goToEducation = () => {
    navigate('/education');
  };
  
  return (
    <section className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          <span className="text-cyan">Master Trading</span> Step by Step
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Journey through our structured learning paths from basic to advanced trading concepts
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Basics Level */}
        <div className="premium-card p-6 flex flex-col hover:scale-[1.01] transition-all duration-300">
          <div className="mb-6 flex items-center gap-3">
            <div className="w-12 h-12 bg-cyan/10 rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-cyan" />
            </div>
            <h3 className="text-xl font-bold">Basics</h3>
          </div>
          <p className="text-gray-400 mb-6 flex-grow">
            Perfect for beginners. Learn the fundamentals of trading, market concepts, and basic strategies.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan"></div>
              <span className="text-sm text-gray-300">Market structure</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan"></div>
              <span className="text-sm text-gray-300">Order types</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan"></div>
              <span className="text-sm text-gray-300">Risk management</span>
            </div>
          </div>
        </div>
        
        {/* Intermediate Level */}
        <div className="premium-card p-6 flex flex-col hover:scale-[1.01] transition-all duration-300">
          <div className="mb-6 flex items-center gap-3">
            <div className="w-12 h-12 bg-cyan/10 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-cyan" />
            </div>
            <h3 className="text-xl font-bold">Intermediate</h3>
          </div>
          <p className="text-gray-400 mb-6 flex-grow">
            Deepen your trading knowledge with advanced concepts, technical analysis, and strategy testing.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan"></div>
              <span className="text-sm text-gray-300">Technical analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan"></div>
              <span className="text-sm text-gray-300">Chart patterns</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan"></div>
              <span className="text-sm text-gray-300">Trading psychology</span>
            </div>
          </div>
        </div>
        
        {/* Pro Level */}
        <div className="premium-card p-6 flex flex-col hover:scale-[1.01] transition-all duration-300">
          <div className="mb-6 flex items-center gap-3">
            <div className="w-12 h-12 bg-cyan/10 rounded-full flex items-center justify-center">
              <Code className="w-6 h-6 text-cyan" />
            </div>
            <h3 className="text-xl font-bold">Pro</h3>
          </div>
          <p className="text-gray-400 mb-6 flex-grow">
            Master algorithmic trading concepts and build sophisticated strategies using our platform.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan"></div>
              <span className="text-sm text-gray-300">Algorithmic strategies</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan"></div>
              <span className="text-sm text-gray-300">Backtesting techniques</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan"></div>
              <span className="text-sm text-gray-300">Strategy optimization</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <Button 
          variant="gradient" 
          className="px-6 py-2 rounded-xl"
          onClick={goToEducation}
        >
          Start Learning Now
        </Button>
      </div>
    </section>
  );
};
