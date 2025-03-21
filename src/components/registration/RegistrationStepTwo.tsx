
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

interface RegistrationStepTwoProps {
  formData: {
    password: string;
    confirmPassword: string;
  };
  handleChange: (field: string, value: string) => void;
}

const RegistrationStepTwo: React.FC<RegistrationStepTwoProps> = ({ formData, handleChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm text-gray-300">Password <span className="text-red-400">*</span></Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Create a secure password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            className="w-full bg-gray-800/50 border-gray-700 rounded-lg p-3 text-white h-12 pr-10"
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
      <div className="space-y-2">
        <Label className="text-sm text-gray-300">Confirm Password <span className="text-red-400">*</span></Label>
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            className="w-full bg-gray-800/50 border-gray-700 rounded-lg p-3 text-white h-12 pr-10"
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
  );
};

export default RegistrationStepTwo;
