
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
    <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-lg border-b border-cyan/20">
      <div className="container flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center group">
          <i className="fa-solid fa-chart-line text-cyan text-2xl group-hover:text-cyan/80 transition-colors"></i>
          <span className="text-cyan text-xl ml-2 font-bold tracking-tight hover:text-cyan/90 transition-colors">BestAlgo.ai</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="text-cyan hover:text-cyan/80 transition-colors font-medium"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-cyan/90 hover:text-cyan transition-colors font-medium"
          >
            About
          </Link>
          <Link
            to="/pricing"
            className="text-cyan/90 hover:text-cyan transition-colors font-medium"
          >
            Pricing
          </Link>
          <a
            href={EXTERNAL_BLOG_URL}
            onClick={handleBlogClick}
            className="text-cyan/90 hover:text-cyan transition-colors font-medium flex items-center"
          >
            Blog
            <ExternalLink className="ml-1 w-3 h-3 text-cyan/90" />
          </a>
          <Link
            to="/contact"
            className="text-cyan/90 hover:text-cyan transition-colors font-medium"
          >
            Contact
          </Link>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-cyan/90 hover:text-cyan transition-colors font-medium"
              >
                Dashboard
              </Link>
              <Button 
                variant="ghost" 
                className="text-cyan/90 hover:text-cyan font-medium" 
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2 text-cyan/90" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-cyan/90 hover:text-cyan font-medium"
                onClick={handleSignIn}
              >
                Sign In
              </Button>
              <Button
                className="bg-cyan hover:bg-cyan/80 text-charcoalPrimary font-semibold px-4 py-2 rounded-lg transition-colors border border-cyan/30"
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
              <Menu className="h-5 w-5 text-cyan" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-charcoalPrimary border-l border-cyan/20">
            <SheetHeader className="space-y-2.5">
              <SheetTitle className="text-cyan font-bold">Menu</SheetTitle>
              <SheetDescription className="text-cyan/70">
                Navigate through the application
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <Link
                to="/"
                className="text-cyan hover:text-cyan/80 transition-colors block py-2 font-medium"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-cyan/90 hover:text-cyan transition-colors block py-2 font-medium"
              >
                About
              </Link>
              <Link
                to="/pricing"
                className="text-cyan/90 hover:text-cyan transition-colors block py-2 font-medium"
              >
                Pricing
              </Link>
              <a
                href={EXTERNAL_BLOG_URL}
                onClick={handleBlogClick}
                className="text-cyan/90 hover:text-cyan transition-colors flex items-center py-2 font-medium"
              >
                Blog
                <ExternalLink className="ml-1 w-3 h-3 text-cyan/90" />
              </a>
              <Link
                to="/contact"
                className="text-cyan/90 hover:text-cyan transition-colors block py-2 font-medium"
              >
                Contact
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-cyan/90 hover:text-cyan transition-colors block py-2 font-medium"
                  >
                    Dashboard
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="text-cyan/90 hover:text-cyan justify-start p-2 font-medium" 
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2 text-cyan/90" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="text-cyan/90 hover:text-cyan justify-start p-2 font-medium"
                    onClick={handleSignIn}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="bg-cyan hover:bg-cyan/80 text-charcoalPrimary px-4 py-2 rounded-lg block w-full text-center mt-2 transition-colors font-semibold border border-cyan/30"
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
