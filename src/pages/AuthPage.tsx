
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AuthPage: React.FC = () => {
  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back</h1>
        
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-[#FF00D4] focus:ring-1 focus:ring-[#FF00D4] outline-none"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-[#FF00D4] focus:ring-1 focus:ring-[#FF00D4] outline-none"
              placeholder="Enter your password"
            />
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-[#FF00D4] hover:underline">
              Forgot password?
            </Link>
          </div>
          
          <Button className="w-full bg-[#FF00D4] hover:bg-[#FF00D4]/80">
            Sign In
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-400">Don't have an account?</span>{' '}
          <Link to="/auth?tab=register" className="text-[#FF00D4] hover:underline font-medium">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
