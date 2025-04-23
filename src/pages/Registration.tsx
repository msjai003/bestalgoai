
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
import RegistrationHeader from '@/components/registration/RegistrationHeader';
import ProgressIndicator from '@/components/registration/ProgressIndicator';
import RegistrationStepOne from '@/components/registration/RegistrationStepOne';

const Registration = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    tradingExperience: 'beginner'
  });
  const [step, setStep] = useState(1);
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
    // Clear error when user makes changes
    if (errorMessage) {
      setErrorMessage(null);
    }
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

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/');
    }
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
        setErrorMessage('This email address is already registered');
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
          setErrorMessage('This email address is already registered');
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
      <RegistrationHeader handleBack={handleBack} />

      <section className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
        <p className="text-gray-400">Join thousands of traders using BestAlgo.ai</p>
      </section>

      <ProgressIndicator step={step} totalSteps={1} />

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
        {/* Step 1: Basic Information */}
        <RegistrationStepOne 
          formData={formData} 
          handleChange={handleChange} 
        />
        
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
