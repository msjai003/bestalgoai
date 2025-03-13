
import React, { useState } from 'react';
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
  GraduationCap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tradingExperience, setTradingExperience] = useState('beginner');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (!name.trim() || !email.trim() || !mobileNumber.trim() || !password.trim() || !confirmPassword.trim()) {
        setErrorMessage('Please fill in all fields');
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

      const userData = {
        fullName: name,
        mobileNumber: mobileNumber,
        tradingExperience: tradingExperience
      };
      
      const { error } = await signUp(email, password, confirmPassword, userData);
      
      if (error) {
        setErrorMessage(error.message || 'Error creating account');
        return;
      }
      
      // AuthContext will show success toast
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Signup error:', error);
      setErrorMessage(error.message || 'Error creating account');
    } finally {
      setIsLoading(false);
    }
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

      <form onSubmit={handleSignup} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-gray-300 mb-2 block">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="bg-gray-800/50 border-gray-700 text-white h-12 pl-10"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email" className="text-gray-300 mb-2 block">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-gray-800/50 border-gray-700 text-white h-12 pl-10"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="mobileNumber" className="text-gray-300 mb-2 block">Mobile Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <Input
                id="mobileNumber"
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter your mobile number"
                className="bg-gray-800/50 border-gray-700 text-white h-12 pl-10"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="tradingExperience" className="text-gray-300 mb-2 block">Trading Experience Level</Label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 z-10" />
              <Select value={tradingExperience} onValueChange={setTradingExperience}>
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
            <Label htmlFor="password" className="text-gray-300 mb-2 block">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-gray-800/50 border-gray-700 text-white h-12 pl-10"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-gray-300 mb-2 block">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-gray-800/50 border-gray-700 text-white h-12 pl-10"
                required
              />
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

export default Signup;
