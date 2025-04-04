
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle, ChevronLeft, X, Info, Eye, EyeOff } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

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

      const { error } = await signIn(email, password);
      
      if (error) {
        setErrorMessage(error.message || 'Invalid email or password');
      } else {
        // Success handled by AuthContext's toast notification
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMessage(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-charcoalPrimary min-h-screen flex flex-col">
      <div className="pt-4 px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-gray-400">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <Link to="/" className="flex items-center">
              <i className="fa-solid fa-chart-line text-cyan text-2xl"></i>
              <span className="text-white text-xl ml-2">BestAlgo.ai</span>
            </Link>
          </div>
          <Link to="/" className="text-gray-400">
            <X className="h-5 w-5" />
          </Link>
        </div>

        <section className="mb-6">
          <h1 className="text-xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Login to access your trading algorithms and portfolio management.</p>
        </section>

        <Alert className="bg-cyan/10 border-cyan/30 mb-6" variant="info">
          <Info className="h-4 w-4 text-cyan" />
          <AlertDescription className="text-gray-200 ml-2">
            Enter your email and password to login. New users can register from the sign up page.
          </AlertDescription>
        </Alert>

        {errorMessage && (
          <Alert className="bg-charcoalDanger/10 border-charcoalDanger/30 mb-6" variant="destructive">
            <AlertTriangle className="h-4 w-4 text-charcoalDanger" />
            <AlertDescription className="text-red-200 ml-2">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleLogin} className="space-y-6 premium-card p-6 border border-cyan/30">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-300 mb-2 block">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-charcoalSecondary/50 border-gray-700 text-white h-12"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Link to="/forgot-password" className="text-cyan text-sm hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-charcoalSecondary/50 border-gray-700 text-white h-12 pr-10"
                />
                <button 
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            variant="gradient"
            className="w-full py-6 rounded-xl shadow-lg"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>

          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Don't have an account? 
              <Link to="/registration" className="text-cyan ml-2 hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
