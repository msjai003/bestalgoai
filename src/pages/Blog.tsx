
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Loader2 } from 'lucide-react';

const EXTERNAL_BLOG_URL = 'https://infocapinfo.blogspot.com/';

const BlogPage = () => {
  const [isRedirecting, setIsRedirecting] = useState(true);
  
  useEffect(() => {
    // Start a timer to track redirection
    const redirectTimer = setTimeout(() => {
      window.location.href = EXTERNAL_BLOG_URL;
    }, 2000);
    
    // Cleanup the timer if component unmounts
    return () => clearTimeout(redirectTimer);
  }, []);

  return (
    <div className="min-h-screen bg-charcoalPrimary text-white flex items-center justify-center p-4">
      <div className="text-center max-w-md bg-charcoalSecondary p-8 rounded-xl border border-gray-700/50 shadow-xl">
        <Loader2 className="h-12 w-12 animate-spin text-cyan mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Redirecting to Blog</h1>
        <p className="text-gray-400 mb-6">
          You're being redirected to our official blog. Please wait...
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href={EXTERNAL_BLOG_URL} 
            className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-cyan to-cyan/80 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4" />
            Go to Blog Now
          </a>
          
          <Link 
            to="/"
            className="flex items-center justify-center gap-2 px-5 py-3 bg-charcoalPrimary border border-gray-700 rounded-lg text-gray-300 font-medium hover:bg-charcoalPrimary/80 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
