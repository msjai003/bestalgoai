
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
    <header className="sticky top-0 z-40 bg-gray-900/90 backdrop-blur-lg border-b border-gray-800">
      <div className="container flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center">
          <i className="fa-solid fa-chart-line text-primary text-2xl"></i>
          <span className="text-white text-xl font-semibold ml-2">BestAlgo.ai</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          <Link
            to="/"
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/70 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/70 transition-colors"
          >
            About
          </Link>
          <Link
            to="/pricing"
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/70 transition-colors"
          >
            Pricing
          </Link>
          <a
            href={EXTERNAL_BLOG_URL}
            onClick={handleBlogClick}
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/70 transition-colors flex items-center"
          >
            Blog
            <ExternalLink className="ml-1 w-3 h-3" />
          </a>
          <Link
            to="/contact"
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/70 transition-colors"
          >
            Contact
          </Link>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/70 transition-colors"
              >
                Dashboard
              </Link>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-gray-800/70" 
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
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-gray-800/70"
                onClick={handleSignIn}
              >
                Sign In
              </Button>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleSignUp}
              >
                Sign Up
              </Button>
            </>
          )}
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-gray-900 border-l border-gray-800">
            <SheetHeader className="space-y-2.5">
              <SheetTitle className="text-white">Menu</SheetTitle>
              <SheetDescription className="text-gray-400">
                Navigate through the application
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-1 py-4">
              <Link
                to="/"
                className="text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors rounded-md px-3 py-2 text-sm"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors rounded-md px-3 py-2 text-sm"
              >
                About
              </Link>
              <Link
                to="/pricing"
                className="text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors rounded-md px-3 py-2 text-sm"
              >
                Pricing
              </Link>
              <a
                href={EXTERNAL_BLOG_URL}
                onClick={handleBlogClick}
                className="text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors rounded-md px-3 py-2 text-sm flex items-center"
              >
                Blog
                <ExternalLink className="ml-1 w-3 h-3" />
              </a>
              <Link
                to="/contact"
                className="text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors rounded-md px-3 py-2 text-sm"
              >
                Contact
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors rounded-md px-3 py-2 text-sm"
                  >
                    Dashboard
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-300 hover:text-white justify-start px-3 py-2 h-auto rounded-md" 
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
                    size="sm"
                    className="text-gray-300 hover:text-white justify-start px-3 py-2 h-auto rounded-md"
                    onClick={handleSignIn}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
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
