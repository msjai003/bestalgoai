
import { useState } from 'react';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed w-full top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
      <div className="px-4 py-3 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center">
          <i className="fa-solid fa-chart-line text-[#FF00D4] text-2xl mr-2"></i>
          <span className="text-xl font-bold text-white">BestAlgo.ai</span>
        </div>
        <nav className="hidden md:flex space-x-8">
          <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
          <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
        </nav>
        <Button 
          variant="ghost" 
          className="md:hidden p-2 hover:bg-gray-800"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      {isOpen && (
        <div className="md:hidden bg-gray-800 border-b border-gray-700">
          <nav className="flex flex-col p-4 space-y-4">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
          </nav>
        </div>
      )}
    </header>
  );
};
