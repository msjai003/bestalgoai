
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EXTERNAL_BLOG_URL = 'https://infocapinfo.blogspot.com/';

const BlogPage = () => {
  useEffect(() => {
    // Redirect to the external blog URL as soon as the component mounts
    window.location.href = EXTERNAL_BLOG_URL;
  }, []);

  // Return a loading indicator while redirecting
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl">Redirecting to our blog...</p>
        <p className="mt-4 text-gray-400">
          If you are not redirected automatically, please{' '}
          <a 
            href={EXTERNAL_BLOG_URL} 
            className="text-[#FF00D4] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            click here
          </a>
        </p>
      </div>
    </div>
  );
};

export default BlogPage;
