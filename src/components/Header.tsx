
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
    // Navigate to the logout page instead of calling signOut directly
    navigate('/logout');
  };

  const handleSignIn = () => {
    navigate('/auth');
  };

  const handleSignUp = () => {
    navigate('/registration');
  };
  
  // External blog link handler
  const handleBlogClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(EXTERNAL_BLOG_URL, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-lg border-b border-gray-800/50">
      <div className="container flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center">
          <i className="fa-solid fa-chart-line text-cyan text-2xl"></i>
          <span className="text-white text-xl ml-2 font-medium">BestAlgo.ai</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="text-gray-300 hover:text-cyan transition-colors"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-gray-300 hover:text-cyan transition-colors"
          >
            About
          </Link>
          <Link
            to="/pricing"
            className="text-gray-300 hover:text-cyan transition-colors"
          >
            Pricing
          </Link>
          <a
            href={EXTERNAL_BLOG_URL}
            onClick={handleBlogClick}
            className="text-gray-300 hover:text-cyan transition-colors flex items-center"
          >
            Blog
            <ExternalLink className="ml-1 w-3 h-3" />
          </a>
          <Link
            to="/contact"
            className="text-gray-300 hover:text-cyan transition-colors"
          >
            Contact
          </Link>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-gray-300 hover:text-cyan transition-colors"
              >
                Dashboard
              </Link>
              <Button 
                variant="ghost" 
                className="text-gray-300 hover:text-cyan" 
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
                className="text-gray-300 hover:text-cyan"
                onClick={handleSignIn}
              >
                Sign In
              </Button>
              <Button
                className="bg-cyan hover:bg-cyan/80 text-charcoalPrimary font-medium px-4 py-2 rounded-lg transition-colors"
                onClick={handleSignUp}
              >
                Sign Up
              </Button>
            </>
          )}
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-charcoalPrimary border-l border-gray-700">
            <SheetHeader className="space-y-2.5">
              <SheetTitle className="text-charcoalTextPrimary">Menu</SheetTitle>
              <SheetDescription className="text-charcoalTextSecondary">
                Navigate through the application
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <Link
                to="/"
                className="text-gray-300 hover:text-cyan transition-colors block py-2"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-gray-300 hover:text-cyan transition-colors block py-2"
              >
                About
              </Link>
              <Link
                to="/pricing"
                className="text-gray-300 hover:text-cyan transition-colors block py-2"
              >
                Pricing
              </Link>
              <a
                href={EXTERNAL_BLOG_URL}
                onClick={handleBlogClick}
                className="text-gray-300 hover:text-cyan transition-colors flex items-center py-2"
              >
                Blog
                <ExternalLink className="ml-1 w-3 h-3" />
              </a>
              <Link
                to="/contact"
                className="text-gray-300 hover:text-cyan transition-colors block py-2"
              >
                Contact
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-300 hover:text-cyan transition-colors block py-2"
                  >
                    Dashboard
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="text-gray-300 hover:text-cyan justify-start p-2" 
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
                    className="text-gray-300 hover:text-cyan justify-start p-2"
                    onClick={handleSignIn}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="bg-cyan hover:bg-cyan/80 text-charcoalPrimary px-4 py-2 rounded-lg block w-full text-center mt-2 transition-colors font-medium"
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
