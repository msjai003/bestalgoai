
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle, ChevronLeft, X, Info, GraduationCap, Eye, EyeOff, Upload, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!file.type.match('image/(jpeg|jpg|png|gif|webp)')) {
        toast.error("Please select an image file (JPEG, PNG, GIF, WEBP)");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image is too large. Maximum size is 5MB.");
        return;
      }
      
      setProfilePicture(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicturePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfilePicture = async (): Promise<string | null> => {
    if (!profilePicture) return null;
    
    try {
      const fileExt = profilePicture.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('profile_pictures')
        .upload(filePath, profilePicture);
      
      if (error) {
        console.error('Error uploading profile picture:', error);
        toast.error('Failed to upload profile picture, continuing without it');
        return null;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('profile_pictures')
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to upload profile picture, continuing without it');
      return null;
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (!email.trim() || !password.trim() || !confirmPassword.trim() || !fullName.trim() || !mobileNumber.trim()) {
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
      
      let profilePictureUrl = null;
      if (profilePicture) {
        try {
          profilePictureUrl = await uploadProfilePicture();
          // No need for additional error handling here as uploadProfilePicture already shows a toast
        } catch (uploadError) {
          console.error('Profile picture upload error:', uploadError);
          // Don't set error message, just continue with registration
          // The toast is already shown in uploadProfilePicture
        }
      }

      const { error, data } = await signUp(
        email, 
        password, 
        confirmPassword, 
        { 
          fullName, 
          mobileNumber, 
          tradingExperience,
          profilePictureUrl 
        }
      );
      
      if (error) {
        console.error('Registration error details:', error);
        setErrorMessage(error.message || 'Failed to create account');
      } else if (data?.user) {
        toast.success('Signup was successful!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrorMessage(error.message || 'An unexpected error occurred. Please try again.');
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

  const removeProfilePicture = () => {
    setProfilePicture(null);
    setProfilePicturePreview(null);
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

      <Alert className="bg-blue-900/30 border-blue-800 mb-6">
        <Info className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-blue-200 ml-2">
          Database connection has been removed. For demo, use email containing "demo" (e.g., demo@example.com).
        </AlertDescription>
      </Alert>

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
          <div className="flex flex-col items-center mb-6">
            <Label className="text-gray-300 mb-2 block text-center">Profile Picture (Optional)</Label>
            <div className="relative group">
              {profilePicturePreview ? (
                <div className="relative">
                  <Avatar className="w-24 h-24 border-2 border-pink-600">
                    <AvatarImage 
                      src={profilePicturePreview} 
                      alt="Profile" 
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gray-800 text-white text-lg">
                      {fullName ? fullName.charAt(0).toUpperCase() : <UserIcon className="h-10 w-10" />}
                    </AvatarFallback>
                  </Avatar>
                  <button 
                    type="button" 
                    onClick={removeProfilePicture} 
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                    aria-label="Remove profile picture"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-750 transition-colors">
                  <label htmlFor="profile-picture" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-xs text-gray-400 mt-1">Upload</span>
                  </label>
                </div>
              )}
              <input 
                id="profile-picture" 
                type="file" 
                accept="image/jpeg, image/png, image/gif, image/webp" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">Max size: 5MB</p>
          </div>

          <div>
            <Label htmlFor="fullName" className="text-gray-300 mb-2 block">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="bg-gray-800/50 border-gray-700 text-white h-12"
            />
          </div>
          
          <div>
            <Label htmlFor="email" className="text-gray-300 mb-2 block">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-gray-800/50 border-gray-700 text-white h-12"
            />
          </div>
          
          <div>
            <Label htmlFor="mobileNumber" className="text-gray-300 mb-2 block">Mobile Number</Label>
            <Input
              id="mobileNumber"
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="+1 (123) 456-7890"
              className="bg-gray-800/50 border-gray-700 text-white h-12"
            />
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
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-gray-800/50 border-gray-700 text-white h-12 pr-10"
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
            <Label htmlFor="confirmPassword" className="text-gray-300 mb-2 block">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-gray-800/50 border-gray-700 text-white h-12 pr-10"
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
