
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, ChevronLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase, getCurrentUser } from '@/lib/supabase';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    const checkAuthStatus = async () => {
      const user = await getCurrentUser();
      if (user) {
        navigate('/dashboard');
      }
    };
    
    checkAuthStatus();
  }, [navigate]);

  const handleSignUpClick = () => {
    navigate('/registration');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    try {
      if (isLogin) {
        // Handle login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      // Handle specific error messages
      if (error.message?.includes('Invalid login credentials')) {
        setAuthError('Invalid email or password. Please try again.');
      } else if (error.message?.includes('Email not confirmed')) {
        setAuthError('Please confirm your email before logging in.');
      } else if (error.message?.includes('Failed to fetch')) {
        setAuthError('Connection error. Please check your internet connection or try a different browser.');
      } else {
        setAuthError(error.message || 'Authentication failed');
      }
      
      toast.error(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="px-4 py-8 pb-32">
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
                onClick={() => {
                  setIsLogin(false);
                  handleSignUpClick();
                }}
              >
                Sign Up
              </Button>
            </div>
          </div>

          {authError && (
            <div className="w-full mb-4 p-4 bg-red-900/30 border border-red-700 rounded-lg flex items-start">
              <AlertCircle className="text-red-400 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="text-red-200 text-sm">{authError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-white outline-none border-none"
                required
              />
            </div>
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-white outline-none border-none"
                required
              />
            </div>
            <div className="text-right">
              <Button variant="link" className="text-[#FF00D4] text-sm p-0 h-auto">
                Forgot Password?
              </Button>
            </div>
            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-8 rounded-xl shadow-lg"
            >
              {isLoading ? "Processing..." : "Login"}
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
          </form>
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
