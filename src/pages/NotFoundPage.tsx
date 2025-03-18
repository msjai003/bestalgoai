
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-5xl font-bold mb-6">404</h1>
      <h2 className="text-2xl mb-6">Page Not Found</h2>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/">
        <Button className="bg-[#FF00D4] hover:bg-[#FF00D4]/80 text-white">
          Return to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
