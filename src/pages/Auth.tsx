
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, ChevronLeft } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate('/registration');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="px-4 py-8 pb-32"> {/* Added padding bottom to prevent overlap */}
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
          <h1 className="text-2xl font-bold text-white mb-8">Welcome Back</h1>

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
                onClick={() => {
                  setIsLogin(false);
                  handleSignUpClick();
                }}
              >
                Sign Up
              </Button>
            </div>
          </div>

          <div className="w-full space-y-4">
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
            <div className="text-right">
              <Button variant="link" className="text-[#FF00D4] text-sm p-0 h-auto">
                Forgot Password?
              </Button>
            </div>
            <Button className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-8 rounded-xl shadow-lg">
              Login
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
      </div>

      {/* Fixed footer with terms and privacy policy */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm p-6">
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
