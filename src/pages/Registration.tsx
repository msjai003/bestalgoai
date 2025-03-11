import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase/client';
import { AlertTriangle, ChevronLeft, X, WifiOff } from 'lucide-react';
import { toast } from 'sonner';
import { testSupabaseConnection } from '@/lib/supabase/test-connection';

const Registration = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
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

  const validateForm = () => {
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMessage('Please fill out all fields');
      return false;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateForm()) {
      return;
    }

    if (!isConnected) {
      setErrorMessage('Cannot connect to the database. Please check your internet connection or try again later.');
      return;
    }

    setIsLoading(true);

    try {
      // Check connection before registration attempt
      const connectionTest = await testSupabaseConnection();
      if (!connectionTest.success) {
        throw new Error("Cannot connect to the database: " + connectionTest.message);
      }

      // Register with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toast.success('Please check your email to confirm your account.');
        
        // Navigate to login
        navigate('/auth');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle network errors specifically
      if (error.message?.includes('fetch') || error.message?.includes('network')) {
        setErrorMessage('Network error: Cannot connect to the database. Please check your internet connection.');
      } else if (error.message?.includes('User already registered')) {
        setErrorMessage('This email is already registered. Please try logging in instead.');
      } else {
        setErrorMessage(error.message || 'Failed to register');
      }
      
      toast.error(error.message || 'An error occurred during registration');
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
        <h1 className="text-2xl font-bold mb-4">Create Your Account</h1>
        <p className="text-gray-400">Join BestAlgo.ai to start building powerful trading strategies.</p>
      </section>

      {!isConnected && (
        <Alert className="bg-amber-900/30 border-amber-800 mb-6">
          <WifiOff className="h-4 w-4 text-amber-400" />
          <AlertDescription className="text-amber-200 ml-2">
            Database connection is currently unavailable. Registration may not work.
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

      <form onSubmit={handleRegister} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName" className="text-gray-300 mb-2 block">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your Name"
              className="bg-gray-800/50 border-gray-700 text-white h-12"
            />
          </div>
          
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
            <Label htmlFor="password" className="text-gray-300 mb-2 block">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              className="bg-gray-800/50 border-gray-700 text-white h-12"
            />
          </div>
          
          <div>
            <Label htmlFor="confirmPassword" className="text-gray-300 mb-2 block">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="bg-gray-800/50 border-gray-700 text-white h-12"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || !isConnected}
          className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-6 rounded-xl shadow-lg"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Already have an account? 
            <Link to="/auth" className="text-[#FF00D4] ml-2 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Registration;
