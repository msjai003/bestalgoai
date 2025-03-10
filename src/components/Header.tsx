import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getSiteUrl } from '@/lib/supabase/client';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
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
          
          <Link
            to="/database"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Database
          </Link>
          
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Button variant="secondary" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <Link
              to="/auth"
              className="bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-2 px-4 rounded-md shadow-md hover:shadow-lg transition-shadow"
            >
              Get Started
            </Link>
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
              
              <Link
                to="/database"
                className="text-gray-300 hover:text-white transition-colors block py-2"
              >
                Database
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-300 hover:text-white transition-colors block py-2"
                  >
                    Dashboard
                  </Link>
                  <Button variant="secondary" size="sm" onClick={handleSignOut} className="w-full">
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-2 px-4 rounded-md shadow-md hover:shadow-lg transition-shadow block text-center"
                >
                  Get Started
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
