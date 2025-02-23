
import { useState } from 'react';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed w-full top-0 z-50 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800">
      <div className="flex justify-between items-center px-4 h-16">
        <div className="flex items-center">
          <i className="fa-solid fa-chart-line text-[#FF00D4] text-2xl mr-2"></i>
          <span className="text-xl font-bold text-white">BestAlgo.ai</span>
        </div>
        <Button 
          variant="ghost" 
          className="p-2 rounded-full hover:bg-gray-800"
          onClick={() => setIsOpen(!isOpen)}
        >
          <i className="fa-solid fa-bars text-xl"></i>
        </Button>
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800">
          <nav className="flex flex-col p-4 space-y-4">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Home</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Market</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Strategy</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Profile</a>
          </nav>
        </div>
      )}
    </header>
  );
};
