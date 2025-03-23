
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone } from 'lucide-react';

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
    </div>
  );
};

export default RegistrationStepOne;
