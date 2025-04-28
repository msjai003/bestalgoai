import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/auth/AuthContext';
import { AlertTriangle, ChevronLeft, X, Info, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const { signIn, user } = useAuth();
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (!email.trim()) {
        setErrorMessage('Please enter your email address.');
        setIsLoading(false);
        return;
      }

      const appUrl = window.location.origin;
      
      console.log('Sending password reset to:', email, 'with redirect URL:', `${appUrl}/auth/v1/verify?type=recovery`);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${appUrl}/auth/v1/verify?type=recovery`,
      });
      
      if (error) {
        console.error('Reset password error:', error);
        setErrorMessage(error.message);
      } else {
        toast.success('Password reset link sent to your email');
        setIsForgotPassword(false);
      }
    } catch (error: any) {
      console.error('Error in forgot password:', error);
      setErrorMessage(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async () => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (!email.trim()) {
        setErrorMessage('Please enter your email address.');
        setIsLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (error) {
        setErrorMessage(error.message || 'Failed to send magic link');
      } else {
        toast.success('Magic link sent to your email');
      }
    } catch (error: any) {
      console.error('Magic link error:', error);
      setErrorMessage(error.message || 'An unexpected error occurred');
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

        {!isForgotPassword ? (
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
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-sm text-cyan hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <div className="flex flex-col gap-4 mt-6">
              <Button
                type="submit"
                disabled={isLoading}
                variant="gradient"
                className="px-8 py-2.5 w-full rounded-xl shadow-lg text-base"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-700"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-charcoalPrimary px-2 text-gray-400">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleMagicLink}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Link...
                  </>
                ) : (
                  'Sign in with Magic Link'
                )}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-6 premium-card p-6 border border-cyan/30 max-w-md mx-auto">
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
            </div>

            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                disabled={isLoading}
                variant="gradient"
                className="w-full"
              >
                {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setIsForgotPassword(false)}
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          </form>
        )}
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
