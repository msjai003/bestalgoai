
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle, ChevronLeft, X, GraduationCap, Eye, EyeOff } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

const Registration = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [tradingExperience, setTradingExperience] = useState('beginner');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (!email.trim() || !password.trim() || !confirmPassword.trim() || !fullName.trim() || !mobileNumber.trim()) {
        setErrorMessage('Please fill in all required fields');
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

      const { error, data } = await signUp(
        email, 
        password, 
        confirmPassword, 
        { 
          fullName, 
          mobileNumber, 
          tradingExperience
        }
      );
      
      if (error) {
        console.error('Registration error details:', error);
        setErrorMessage(error.message || 'Error creating account');
      } else if (data?.user) {
        navigate('/dashboard');
      } else {
        setErrorMessage('Registration submitted. Please check your email for verification.');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrorMessage(error.message || 'Error creating account');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
        <Alert className="bg-red-900/30 border-red-800 mb-6" variant="destructive">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-200 ml-2">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleRegistration} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName" className="text-gray-300 mb-2 block">Full Name <span className="text-red-400">*</span></Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="bg-gray-800/50 border-gray-700 text-white h-12"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email" className="text-gray-300 mb-2 block">Email Address <span className="text-red-400">*</span></Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-gray-800/50 border-gray-700 text-white h-12"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="mobileNumber" className="text-gray-300 mb-2 block">Mobile Number <span className="text-red-400">*</span></Label>
            <Input
              id="mobileNumber"
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="+1 (123) 456-7890"
              className="bg-gray-800/50 border-gray-700 text-white h-12"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="tradingExperience" className="text-gray-300 mb-2 block">Trading Experience Level <span className="text-red-400">*</span></Label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 z-10" />
              <Select value={tradingExperience} onValueChange={setTradingExperience} required>
                <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white h-12 pl-10">
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="password" className="text-gray-300 mb-2 block">Password <span className="text-red-400">*</span></Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-gray-800/50 border-gray-700 text-white h-12 pr-10"
                required
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

          <div>
            <Label htmlFor="confirmPassword" className="text-gray-300 mb-2 block">Confirm Password <span className="text-red-400">*</span></Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-gray-800/50 border-gray-700 text-white h-12 pr-10"
                required
              />
              <button 
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
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
