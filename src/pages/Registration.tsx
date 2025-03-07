
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, ChevronLeft } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface RegistrationData {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  tradingExperience: string;
  preferredMarkets: string[];
  isResearchAnalyst: boolean;
  certificationNumber: string;
}

const Registration = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RegistrationData>({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    tradingExperience: '',
    preferredMarkets: [],
    isResearchAnalyst: false,
    certificationNumber: '',
  });

  const handleChange = (field: keyof RegistrationData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // Validate current step
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.mobile) {
        toast.error("Please fill all required fields");
        return;
      }
      if (!validateEmail(formData.email)) {
        toast.error("Please enter a valid email address");
        return;
      }
    } else if (step === 2) {
      if (!formData.password || !formData.confirmPassword) {
        toast.error("Please enter and confirm your password");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        return;
      }
    }
    
    setStep(prev => Math.min(prev + 1, 3));
  };

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    } else {
      navigate('/auth');
    }
  };

  const handleCompleteRegistration = async () => {
    // Validate certification number if research analyst is selected
    if (formData.isResearchAnalyst && !formData.certificationNumber.trim()) {
      toast.error("Please enter your Research Analyst certification number");
      return;
    }
    
    if (!formData.tradingExperience) {
      toast.error("Please select your trading experience");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Starting registration process...");
      // Using config() to access the URL safely
      console.log("Connecting to Supabase...");
      
      // Register the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            mobile: formData.mobile,
            trading_experience: formData.tradingExperience,
            is_research_analyst: formData.isResearchAnalyst,
            certification_number: formData.certificationNumber || null,
          }
        }
      });
      
      if (authError) {
        console.error("Auth error details:", authError);
        throw authError;
      }
      
      console.log("User created successfully:", authData?.user?.id);
      
      // Only attempt to insert profile data if a user was created
      if (authData?.user?.id) {
        // Store additional user profile data in a custom table if needed
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: authData.user.id,
            full_name: formData.fullName,
            email: formData.email,
            mobile: formData.mobile,
            trading_experience: formData.tradingExperience,
            is_research_analyst: formData.isResearchAnalyst,
            certification_number: formData.certificationNumber || null,
          });
        
        if (profileError) {
          console.error("Error saving profile data:", profileError);
          // We continue anyway since the auth record was created
        }
      }
      
      toast.success("Registration completed successfully! Please check your email to verify your account.");
      navigate('/auth');
      
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.message === "Failed to fetch") {
        toast.error("Network error: Could not connect to Supabase. Please check your internet connection or contact support.");
      } else {
        toast.error(error.message || "Registration failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderRegistrationStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Full Name</Label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 focus:border-[#FF00D4] focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Email Address</Label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 focus:border-[#FF00D4] focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Mobile Number</Label>
              <Input
                type="tel"
                placeholder="+91 "
                value={formData.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 focus:border-[#FF00D4] focus:outline-none"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Password</Label>
              <Input
                type="password"
                placeholder="Create a secure password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 focus:border-[#FF00D4] focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Confirm Password</Label>
              <Input
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 focus:border-[#FF00D4] focus:outline-none"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Trading Experience</Label>
              <select
                value={formData.tradingExperience}
                onChange={(e) => handleChange('tradingExperience', e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 focus:border-[#FF00D4] focus:outline-none text-white"
              >
                <option value="">Select your experience level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            {/* Research Analyst toggle */}
            <div className="flex items-center justify-between pt-3">
              <Label htmlFor="research-analyst" className="text-sm text-gray-300 cursor-pointer">
                Are you a Research Analyst?
              </Label>
              <Switch
                id="research-analyst"
                checked={formData.isResearchAnalyst}
                onCheckedChange={(checked) => handleChange('isResearchAnalyst', checked)}
                className="bg-gray-700 data-[state=checked]:bg-[#FF00D4]"
              />
            </div>
            
            {/* Conditionally render certification number input */}
            {formData.isResearchAnalyst && (
              <div className="space-y-2 pt-2">
                <Label className="text-sm text-gray-300">RA Certification Number</Label>
                <Input
                  placeholder="Enter your certification number"
                  value={formData.certificationNumber}
                  onChange={(e) => handleChange('certificationNumber', e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 focus:border-[#FF00D4] focus:outline-none"
                />
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <header className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="p-2 text-gray-400"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="flex items-center">
          <i className="fa-solid fa-chart-line text-[#FF00D4] text-2xl mr-2"></i>
          <span className="text-xl font-bold bg-gradient-to-r from-[#FF00D4] to-purple-600 bg-clip-text text-transparent">
            BestAlgo.ai
          </span>
        </div>
        <Link to="/auth" className="p-2 text-gray-400">
          <X className="h-6 w-6" />
        </Link>
      </header>

      <section className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Create Your Account</h1>
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-1/3 h-1 rounded-full ${
                s <= step ? 'bg-[#FF00D4]' : 'bg-gray-700'
              } ${s !== 3 ? 'mr-1' : ''}`}
            />
          ))}
        </div>
        <p className="text-gray-400 text-sm">Step {step} of 3</p>
      </section>

      <section className="space-y-6">
        <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700">
          {renderRegistrationStep()}
        </div>

        <Button
          onClick={step === 3 ? handleCompleteRegistration : handleNext}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-8 rounded-xl shadow-lg"
        >
          {isLoading ? "Processing..." : (step === 3 ? 'Complete Registration' : 'Next Step')}
        </Button>

        <footer className="mt-8 text-center text-sm text-gray-400">
          <p className="mb-2">
            By continuing, you agree to our{' '}
            <Button variant="link" className="text-[#FF00D4] p-0 h-auto">
              Terms
            </Button>{' '}
            &{' '}
            <Button variant="link" className="text-[#FF00D4] p-0 h-auto">
              Privacy Policy
            </Button>
          </p>
          <p>
            Need help?{' '}
            <Button variant="link" className="text-[#FF00D4] p-0 h-auto">
              Contact Support
            </Button>
          </p>
        </footer>
      </section>
    </div>
  );
};

export default Registration;
