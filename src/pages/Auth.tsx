
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle, ChevronLeft, X, WifiOff } from 'lucide-react';
import { testSupabaseConnection } from '@/lib/supabase/test-connection';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  // Check connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      const result = await testSupabaseConnection();
      setIsConnected(result.success);
      if (!result.success) {
        setErrorMessage('Database connection issue. Please try again later or contact support.');
        console.error('Connection test result:', result);
      }
    };
    
    checkConnection();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (!email.trim() || !password.trim()) {
        setErrorMessage('Please enter both email and password.');
        setIsLoading(false);
        return;
      }

      if (!isConnected) {
        setErrorMessage('Cannot connect to the database. Please check your internet connection or try again later.');
        setIsLoading(false);
        return;
      }

      // Check connection before login attempt
      const connectionTest = await testSupabaseConnection();
      if (!connectionTest.success) {
        throw new Error("Cannot connect to the database: " + connectionTest.message);
      }

      const { error } = await signIn(email, password);

      if (error) {
        setErrorMessage(error.message || 'Failed to sign in. Please check your credentials.');
      } else {
        // Redirect to dashboard on successful login
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle network errors specifically
      if (error.message?.includes('fetch') || error.message?.includes('network')) {
        setErrorMessage('Network error: Cannot connect to the database. Please check your internet connection.');
      } else {
        setErrorMessage(error.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
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

      <section className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Welcome Back</h1>
        <p className="text-gray-400">Login to access your trading algorithms and portfolio management.</p>
      </section>

      {!isConnected && (
        <Alert className="bg-amber-900/30 border-amber-800 mb-6">
          <WifiOff className="h-4 w-4 text-amber-400" />
          <AlertDescription className="text-amber-200 ml-2">
            Database connection is currently unavailable. Login may not work.
          </AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert className="bg-red-900/30 border-red-800 mb-6" variant="destructive">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-200 ml-2">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-gray-300 mb-2 block">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-gray-800/50 border-gray-700 text-white h-12"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Link to="/forgot-password" className="text-[#FF00D4] text-sm">
                Forgot Password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-gray-800/50 border-gray-700 text-white h-12"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || !isConnected}
          className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-6 rounded-xl shadow-lg"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Don't have an account? 
            <Link to="/registration" className="text-[#FF00D4] ml-2 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Auth;
