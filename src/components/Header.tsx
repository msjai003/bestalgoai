
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
import { Menu, LogOut, User, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const EXTERNAL_BLOG_URL = 'https://infocapinfo.blogspot.com/';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const handleLogout = () => {
    navigate('/logout');
  };

  const handleSignIn = () => {
    navigate('/auth');
  };

  const handleSignUp = () => {
    navigate('/registration');
  };
  
  const handleBlogClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(EXTERNAL_BLOG_URL, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-lg border-b border-white/5">
      <div className="container flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center">
          <i className="fa-solid fa-chart-line text-[#FF00D4] text-2xl"></i>
          <span className="text-white text-xl ml-2 font-bold">BestAlgo<span className="gradient-text">.ai</span></span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="text-gray-300 hover:text-white transition-colors hover:animate-micro-scale"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-gray-300 hover:text-white transition-colors hover:animate-micro-scale"
          >
            About
          </Link>
          <Link
            to="/pricing"
            className="text-gray-300 hover:text-white transition-colors hover:animate-micro-scale"
          >
            Pricing
          </Link>
          <a
            href={EXTERNAL_BLOG_URL}
            onClick={handleBlogClick}
            className="text-gray-300 hover:text-white transition-colors flex items-center hover:animate-micro-scale"
          >
            Blog
            <ExternalLink className="ml-1 w-3 h-3" />
          </a>
          <Link
            to="/contact"
            className="text-gray-300 hover:text-white transition-colors hover:animate-micro-scale"
          >
            Contact
          </Link>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-gray-300 hover:text-white transition-colors hover:animate-micro-scale"
              >
                Dashboard
              </Link>
              <Button 
                variant="ghost" 
                className="text-gray-300 hover:text-white glass-button" 
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white glass-button"
                onClick={handleSignIn}
              >
                Sign In
              </Button>
              <Button
                className="gradient-button rounded-lg hover:animate-micro-scale shadow-glow"
                onClick={handleSignUp}
              >
                Sign Up
              </Button>
            </>
          )}
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden glass-button p-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="neo-blur border-l border-white/10">
            <SheetHeader className="space-y-2.5">
              <SheetTitle className="gradient-text text-xl">Menu</SheetTitle>
              <SheetDescription>
                Navigate through the application
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <Link
                to="/"
                className="text-gray-300 hover:text-white transition-colors block py-2 hover:translate-x-1 duration-200"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-gray-300 hover:text-white transition-colors block py-2 hover:translate-x-1 duration-200"
              >
                About
              </Link>
              <Link
                to="/pricing"
                className="text-gray-300 hover:text-white transition-colors block py-2 hover:translate-x-1 duration-200"
              >
                Pricing
              </Link>
              <a
                href={EXTERNAL_BLOG_URL}
                onClick={handleBlogClick}
                className="text-gray-300 hover:text-white transition-colors flex items-center py-2 hover:translate-x-1 duration-200"
              >
                Blog
                <ExternalLink className="ml-1 w-3 h-3" />
              </a>
              <Link
                to="/contact"
                className="text-gray-300 hover:text-white transition-colors block py-2 hover:translate-x-1 duration-200"
              >
                Contact
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-300 hover:text-white transition-colors block py-2 hover:translate-x-1 duration-200"
                  >
                    Dashboard
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="text-gray-300 hover:text-white justify-start p-2 glass-button" 
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-white justify-start p-2 glass-button"
                    onClick={handleSignIn}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                  <Button
                    className="gradient-button text-white px-4 py-2 rounded-lg block w-full text-center mt-2 shadow-glow"
                    onClick={handleSignUp}
                  >
                    Sign Up
                  </Button>
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
