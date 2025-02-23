
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, ChevronLeft } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-gray-400">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <Link to="/" className="flex items-center">
            <i className="fa-solid fa-chart-line text-[#FF00D4] text-2xl"></i>
            <span className="text-white text-xl ml-2">BestAlgo.ai</span>
          </Link>
        </div>
        <Link to="/" className="text-gray-400">
          <X className="h-5 w-5" />
        </Link>
      </div>

      <div className="flex flex-col items-center mt-12">
        <h1 className="text-2xl font-bold text-white mb-8">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>

        <div className="bg-gray-800/50 p-1 rounded-xl mb-8">
          <div className="flex">
            <Button
              variant="ghost"
              className={`px-8 py-2 rounded-lg ${
                isLogin ? 'bg-[#FF00D4] text-white' : 'text-gray-400'
              }`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </Button>
            <Button
              variant="ghost"
              className={`px-8 py-2 rounded-lg ${
                !isLogin ? 'bg-[#FF00D4] text-white' : 'text-gray-400'
              }`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </Button>
          </div>
        </div>

        <div className="w-full space-y-4">
          {!isLogin && (
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
              <Input
                type="text"
                placeholder="Full Name"
                className="w-full bg-transparent text-white outline-none border-none"
              />
            </div>
          )}
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
            <Input
              type="email"
              placeholder="Email Address"
              className="w-full bg-transparent text-white outline-none border-none"
            />
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
            <Input
              type="password"
              placeholder="Password"
              className="w-full bg-transparent text-white outline-none border-none"
            />
          </div>
          {!isLogin && (
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
              <Input
                type="password"
                placeholder="Confirm Password"
                className="w-full bg-transparent text-white outline-none border-none"
              />
            </div>
          )}
          {isLogin && (
            <div className="text-right">
              <Button
                variant="link"
                className="text-[#FF00D4] text-sm p-0 h-auto"
              >
                Forgot Password?
              </Button>
            </div>
          )}
          <Button className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-8 rounded-xl shadow-lg">
            {isLogin ? 'Login' : 'Sign Up'}
          </Button>

          <div className="flex items-center gap-4 justify-center mt-6">
            <Button
              variant="outline"
              className="bg-gray-800/30 p-4 rounded-xl border border-gray-700 h-auto"
            >
              <i className="fa-brands fa-google text-white"></i>
            </Button>
            <Button
              variant="outline"
              className="bg-gray-800/30 p-4 rounded-xl border border-gray-700 h-auto"
            >
              <i className="fa-brands fa-apple text-white"></i>
            </Button>
            <Button
              variant="outline"
              className="bg-gray-800/30 p-4 rounded-xl border border-gray-700 h-auto"
            >
              <i className="fa-brands fa-facebook text-white"></i>
            </Button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 text-center">
        <p className="text-gray-500 text-sm">
          By continuing, you agree to our{' '}
          <Button variant="link" className="text-[#FF00D4] p-0 h-auto">
            Terms of Service
          </Button>{' '}
          &{' '}
          <Button variant="link" className="text-[#FF00D4] p-0 h-auto">
            Privacy Policy
          </Button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
