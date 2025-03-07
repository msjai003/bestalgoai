
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

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
};

export default RegistrationStepOne;
