import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleLogout = async () => {
    // Use the Logout page for consistent logout experience
    // This prevents duplicate toast notifications
    navigate('/logout');
  };
  
  return (
    <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-lg">
      <div className="container flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center">
          <i className="fa-solid fa-chart-line text-[#FF00D4] text-2xl"></i>
          <span className="text-white text-xl ml-2">BestAlgo.ai</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-gray-300 hover:text-white transition-colors"
          >
            About
          </Link>
          <Link
            to="/pricing"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Pricing
          </Link>
          <Link
            to="/contact"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Contact
          </Link>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Button 
                variant="ghost" 
                className="text-gray-300 hover:text-white" 
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/registration"
                className="bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white px-4 py-2 rounded-lg"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-gray-900 border-l border-gray-700">
            <SheetHeader className="space-y-2.5">
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>
                Navigate through the application
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <Link
                to="/"
                className="text-gray-300 hover:text-white transition-colors block py-2"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-gray-300 hover:text-white transition-colors block py-2"
              >
                About
              </Link>
              <Link
                to="/pricing"
                className="text-gray-300 hover:text-white transition-colors block py-2"
              >
                Pricing
              </Link>
              <Link
                to="/contact"
                className="text-gray-300 hover:text-white transition-colors block py-2"
              >
                Contact
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-300 hover:text-white transition-colors block py-2"
                  >
                    Dashboard
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="text-gray-300 hover:text-white justify-start p-2" 
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="text-gray-300 hover:text-white transition-colors block py-2"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/registration"
                    className="bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white px-4 py-2 rounded-lg block w-full text-center mt-2"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
