
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Info, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth/AuthContext";
import ForgotPassword from "@/components/auth/ForgotPassword";
import { toast } from "sonner";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const { toast: toastUI } = useToast();
  const { signIn, user } = useAuth();

  // Check if user is already logged in and redirect if true
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Successfully logged in - updated message here
      toastUI({
        title: "Login successful!",
        description: "Welcome back to BestAlgo.ai.",
        variant: "default",
      });

      signIn(data.session?.user);
      navigate("/dashboard");
    } catch (error: any) {
      toastUI({
        title: "Login failed!",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-charcoalPrimary p-4">
        <div className="w-full max-w-md">
          <div className="bg-charcoalSecondary/20 border border-gray-700 rounded-xl p-6">
            <ForgotPassword onBack={() => setShowForgotPassword(false)} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-charcoalPrimary p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Back button header */}
        <div className="flex items-center mb-6">
          <Link to="/" className="flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="text-sm">Back to Home</span>
          </Link>
        </div>

        <div className="text-left mb-6 px-1">
          <h1 className="text-2xl font-semibold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Login to access your trading algorithms and portfolio management.</p>
        </div>
        
        <div className="bg-charcoalSecondary/30 rounded-xl border border-gray-700 p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="text-cyan h-5 w-5 mt-0.5 flex-shrink-0" />
            <p className="text-gray-300 text-sm">
              Enter your email and password to login. New users can register from the sign up page.
            </p>
          </div>
        </div>

        <div className="bg-charcoalSecondary/20 border border-gray-700 rounded-xl p-5 sm:p-6">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-500 focus:ring-cyan focus:border-cyan"
                placeholder="Enter your email address"
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-800/80 border-gray-700 text-white pr-10 placeholder:text-gray-500 focus:ring-cyan focus:border-cyan"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="text-right">
                <button 
                  type="button" 
                  onClick={() => setShowForgotPassword(true)}
                  className="text-cyan text-xs hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-cyan text-charcoalPrimary py-5 hover:bg-cyan/90"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full border-gray-700 text-white py-5 flex items-center justify-center gap-2"
              onClick={() => navigate('/signup')}
            >
              <span className="text-white">Create Account</span>
            </Button>
          </form>
          
          <div className="mt-6 text-center text-xs text-gray-400">
            By signing in, you agree to our <a href="/terms" className="text-cyan hover:underline">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
