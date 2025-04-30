
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, ChevronLeft, X, Info, Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import ForgotPassword from '@/components/auth/ForgotPassword';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { signIn, user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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
        toast.success('Login successful!');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMessage(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        console.error('Google sign-in error:', error);
        setErrorMessage(error.message || 'An error occurred during Google sign-in');
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      setErrorMessage(error.message || 'An unexpected error occurred with Google sign-in.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (showForgotPassword) {
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

          <div className="premium-card p-6 border border-cyan/30 max-w-md mx-auto">
            <ForgotPassword onBack={() => setShowForgotPassword(false)} />
          </div>
        </div>
      </div>
    );
  }

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

        <form onSubmit={handleLogin} className="space-y-6 premium-card p-6 border border-cyan/30 max-w-md mx-auto">
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
                className="bg-charcoalSecondary/50 border-gray-700 text-white h-11 rounded-xl"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-gray-300">Password</Label>
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
                  className="bg-charcoalSecondary/50 border-gray-700 text-white h-11 pr-10 rounded-xl"
                />
                <button 
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-cyan hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <Button
              type="submit"
              disabled={isLoading}
              variant="gradient"
              className="px-8 py-2.5 w-full rounded-xl shadow-lg text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            {/* Google Sign In Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2 bg-white text-gray-800 hover:bg-gray-100 border-gray-300"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              </svg>
              <span>Continue with Google</span>
            </Button>

            {/* Create Account Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2 bg-charcoalSecondary/50 border-cyan hover:bg-charcoalSecondary text-white"
              onClick={() => navigate('/registration')}
            >
              <UserPlus className="h-4 w-4" />
              Create Account
            </Button>

            <div className="text-center text-sm text-gray-400 mt-2">
              By signing in, you agree to our 
              <Link to="/terms" className="text-cyan ml-1 hover:underline">Terms of Service</Link>
            </div>
          </div>
        </form>
      </div>

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-charcoalPrimary/70 z-50">
          <div className="bg-charcoalSecondary p-6 rounded-xl border border-gray-700/50 shadow-xl">
            <Loader2 className="h-10 w-10 animate-spin text-cyan mb-4 mx-auto" />
            <p className="text-white text-center">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
