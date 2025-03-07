
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RegistrationStepTwoProps {
  formData: {
    password: string;
    confirmPassword: string;
  };
  handleChange: (field: string, value: string) => void;
}

const RegistrationStepTwo: React.FC<RegistrationStepTwoProps> = ({ formData, handleChange }) => {
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
};

export default RegistrationStepTwo;
