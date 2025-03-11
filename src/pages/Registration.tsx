
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle, ChevronLeft, X, WifiOff } from 'lucide-react';
import { toast } from 'sonner';

const Registration = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isNetworkIssue, setIsNetworkIssue] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsNetworkIssue(false);
    setIsLoading(true);

    try {
      // Basic validation
      if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
        setErrorMessage('Please fill in all fields');
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match');
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters');
        setIsLoading(false);
        return;
      }

      // Call signUp from AuthContext
      const { error } = await signUp(email, password);
      
      if (error) {
        if (error.message?.includes('fetch') || error.message?.includes('network') || 
            error.message?.includes('Failed to connect')) {
          setIsNetworkIssue(true);
          setErrorMessage('Network connection issue. Please check your internet connection and try again.');
        } else {
          setErrorMessage(error.message || 'Failed to create account');
        }
      } else {
        toast.success('Signup was successful!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.message?.includes('fetch') || error.message?.includes('network')) {
        setIsNetworkIssue(true);
        setErrorMessage('Network connection issue. Please check your internet connection and try again.');
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
        <h1 className="text-2xl font-bold mb-4">Create Your Account</h1>
        <p className="text-gray-400">Join thousands of traders using BestAlgo.ai</p>
      </section>

      {errorMessage && (
        <Alert className={`${isNetworkIssue ? 'bg-yellow-900/30 border-yellow-800' : 'bg-red-900/30 border-red-800'} mb-6`} variant="destructive">
          {isNetworkIssue ? (
            <WifiOff className="h-4 w-4 text-yellow-400" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-400" />
          )}
          <AlertDescription className={`${isNetworkIssue ? 'text-yellow-200' : 'text-red-200'} ml-2`}>
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleRegistration} className="space-y-6">
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
            <Label htmlFor="password" className="text-gray-300 mb-2 block">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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
              placeholder="••••••••"
              className="bg-gray-800/50 border-gray-700 text-white h-12"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-6 rounded-xl shadow-lg"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Already have an account? 
            <Link to="/auth" className="text-[#FF00D4] ml-2 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Registration;
