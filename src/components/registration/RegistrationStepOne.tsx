
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RegistrationStepOneProps {
  formData: {
    fullName: string;
    email: string;
    mobile: string;
  };
  handleChange: (field: string, value: string) => void;
}

const RegistrationStepOne: React.FC<RegistrationStepOneProps> = ({ formData, handleChange }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm text-gray-300">Full Name <span className="text-red-400">*</span></Label>
        <Input
          type="text"
          placeholder="Enter your name"
          value={formData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          className="w-full bg-gray-800/50 border-gray-700 rounded-lg p-3 text-white h-12"
          required
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm text-gray-300">Email Address <span className="text-red-400">*</span></Label>
        <Input
          type="email"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className="w-full bg-gray-800/50 border-gray-700 rounded-lg p-3 text-white h-12"
          required
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm text-gray-300">Mobile Number <span className="text-red-400">*</span></Label>
        <Input
          type="tel"
          placeholder="Enter your 10 digit mobile number"
          value={formData.mobile}
          onChange={(e) => handleChange('mobile', e.target.value)}
          className="w-full bg-gray-800/50 border-gray-700 rounded-lg p-3 text-white h-12"
          required
        />
      </div>
    </div>
  );
};

export default RegistrationStepOne;
