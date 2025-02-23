
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, ChevronLeft } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface RegistrationData {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  tradingExperience: string;
  preferredMarkets: string[];
}

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationData>({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    tradingExperience: '',
    preferredMarkets: [],
  });

  const handleChange = (field: keyof RegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
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
          onClick={step > 1 ? handleBack : () => {}}
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
        <Link to="/" className="p-2 text-gray-400">
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
          onClick={step === 3 ? () => {} : handleNext}
          className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-8 rounded-xl shadow-lg"
        >
          {step === 3 ? 'Complete Registration' : 'Next Step'}
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

export default Auth;
