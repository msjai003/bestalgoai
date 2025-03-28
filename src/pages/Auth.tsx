import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle, ChevronLeft, X, Info, Eye, EyeOff } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Loader2 } from '@/components/ui/loader';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signInWithGoogle, user, googleUserDetails } = useAuth();
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
        if (error.message.includes("Invalid login")) {
          setErrorMessage('Invalid email or password. Please try again.');
        } else if (error.message.includes("Email not confirmed")) {
          setErrorMessage('Please confirm your email address before logging in.');
        } else {
          setErrorMessage(error.message || 'An error occurred during login');
        }
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMessage(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    setIsGoogleLoading(true);
    
    try {
      toast.info("Initiating Google login...");
      console.log("Starting Google login process");
      
      const { error } = await signInWithGoogle();
      
      if (error) {
        console.error('Google login error:', error);
        setErrorMessage(error.message || 'Error signing in with Google');
        toast.error(error.message || 'Error signing in with Google');
      } else {
        toast.success('Google login initiated');
        // Note: The redirect is handled by Supabase - we may not reach this point
        console.log('Google login successful, awaiting redirect');
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      setErrorMessage(error.message || 'An unexpected error occurred. Please try again.');
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setIsGoogleLoading(false);
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
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
            size="lg"
            className="w-full rounded-xl shadow-lg"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>

          <div className="flex items-center justify-center my-4">
            <div className="flex-grow flex-shrink-0 max-w-[35%]">
              <Separator className="w-full bg-gray-700" />
            </div>
            <span className="px-3 text-gray-400 text-sm flex-shrink-0">OR</span>
            <div className="flex-grow flex-shrink-0 max-w-[35%]">
              <Separator className="w-full bg-gray-700" />
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={isGoogleLoading}
            onClick={handleGoogleLogin}
            size="lg"
            className="w-full rounded-xl bg-transparent border border-gray-600 hover:bg-gray-800 text-white"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
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

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-charcoalPrimary/70 z-50">
          <div className="bg-charcoalSecondary p-6 rounded-xl border border-gray-700/50 shadow-xl">
            <Loader2 className="h-10 w-10 animate-spin text-cyan mb-4 mx-auto" />
            <p className="text-white text-center">Signing you in...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
