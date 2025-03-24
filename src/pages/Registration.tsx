
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  ChevronLeft, 
  X, 
  User, 
  Mail, 
  Phone, 
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  Info 
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Registration = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    tradingExperience: 'beginner'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.mobile || !formData.password || !formData.confirmPassword) {
      setErrorMessage('Please fill in all required fields');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // First check if email already exists in user_profiles
      const { data: existingProfiles, error: profileCheckError } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('email', formData.email)
        .maybeSingle();
      
      if (profileCheckError) {
        console.error("Error checking for existing profile:", profileCheckError);
      } else if (existingProfiles) {
        setErrorMessage('This email address you entered is already registered');
        setIsLoading(false);
        return;
      }

      // Proceed with registration
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            mobile_number: formData.mobile,
            trading_experience: formData.tradingExperience
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        
        if (error.message.includes("already registered") || 
            error.message.includes("already exists") ||
            error.message.includes("already in use")) {
          setErrorMessage('This email address you entered is already registered');
        } else {
          setErrorMessage(error.message);
        }
        return;
      }
      
      if (data?.user) {
        toast.success('Account created successfully! Please check your email inbox.');
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/auth');
        }, 2000);
      } else {
        toast.info('Please check your email to confirm your account');
      }
    } catch (error: any) {
      console.error('Error during registration:', error);
      setErrorMessage(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoalPrimary text-white p-4">
      <div className="flex items-center justify-between mb-8">
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
        <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
        <p className="text-gray-400">Join thousands of traders using BestAlgo.ai</p>
      </section>

      <Alert className="bg-cyan/10 border-cyan/30 mb-6" variant="info">
        <Info className="h-4 w-4 text-cyan" />
        <AlertDescription className="text-gray-200 ml-2">
          Fill in all your details below to create your trading account.
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

      <form onSubmit={handleSubmit} className="space-y-6 premium-card p-6 border border-cyan/30">
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName" className="text-gray-300 mb-2 block">Full Name <span className="text-charcoalDanger">*</span></Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your name"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className="bg-charcoalSecondary/50 border-gray-700 text-white h-12 pl-10"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email" className="text-gray-300 mb-2 block">Email Address <span className="text-charcoalDanger">*</span></Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="bg-charcoalSecondary/50 border-gray-700 text-white h-12 pl-10"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="mobile" className="text-gray-300 mb-2 block">Mobile Number <span className="text-charcoalDanger">*</span></Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <Input
                id="mobile"
                type="tel"
                placeholder="Enter your 10 digit mobile number"
                value={formData.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
                className="bg-charcoalSecondary/50 border-gray-700 text-white h-12 pl-10"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="tradingExperience" className="text-gray-300 mb-2 block">Trading Experience Level <span className="text-charcoalDanger">*</span></Label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 z-10" />
              <Select 
                value={formData.tradingExperience} 
                onValueChange={(value) => handleChange('tradingExperience', value)}
              >
                <SelectTrigger className="bg-charcoalSecondary/50 border-gray-700 text-white h-12 pl-10">
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent className="bg-charcoalSecondary border-gray-700 text-white">
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="password" className="text-gray-300 mb-2 block">Password <span className="text-charcoalDanger">*</span></Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a secure password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="bg-charcoalSecondary/50 border-gray-700 text-white h-12 pl-10 pr-10"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-gray-300 mb-2 block">Confirm Password <span className="text-charcoalDanger">*</span></Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className="bg-charcoalSecondary/50 border-gray-700 text-white h-12 pl-10 pr-10"
                required
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
          className="w-full bg-gradient-to-r from-cyan to-purple-600 text-white py-6 rounded-xl shadow-lg"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Already have an account? 
            <Link to="/auth" className="text-cyan ml-2 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </form>

      <div className="mt-8 text-center text-gray-500 text-xs">
        <p>By creating an account, you agree to our</p>
        <div className="mt-1">
          <Link to="/terms" className="text-cyan hover:underline">Terms of Service</Link>
          <span className="mx-2">•</span>
          <Link to="/privacy" className="text-cyan hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default Registration;
