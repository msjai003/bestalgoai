
import { useState } from 'react';
import { Button } from './ui/button';
import { Menu, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed w-full top-0 z-50 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800">
      <div className="flex items-center justify-between px-4 h-16">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="p-2"
        >
          <i className="fa-solid fa-bars text-gray-300"></i>
        </Button>

        <Link to="/" className="flex items-center space-x-2">
          <i className="fa-solid fa-robot text-[#FF00D4]"></i>
          <span className="text-white font-bold">BestAlgo.ai</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="p-2 relative">
            <i className="fa-regular fa-bell text-gray-300"></i>
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF00D4] rounded-full"></span>
          </Button>
          <img 
            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" 
            alt="Profile" 
            className="w-8 h-8 rounded-full"
          />
        </div>
      </div>
    </header>
  );
};
