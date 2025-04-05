
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RegistrationStepOneProps {
  formData: {
    fullName: string;
    email: string;
    mobile: string;
    [key: string]: string;
  };
  handleChange: (field: string, value: string) => void;
  googleData?: {
    fullName?: string;
    email?: string;
  }
}

const RegistrationStepOne: React.FC<RegistrationStepOneProps> = ({ 
  formData, 
  handleChange,
  googleData
}) => {
  const [countryCode, setCountryCode] = useState('91'); // Default to India

  // If we have Google data, use it to pre-fill the form
  React.useEffect(() => {
    if (googleData) {
      if (googleData.fullName && !formData.fullName) {
        handleChange('fullName', googleData.fullName);
      }
      if (googleData.email && !formData.email) {
        handleChange('email', googleData.email);
      }
    }
  }, [googleData, formData.fullName, formData.email, handleChange]);

  // Handle mobile number change and format with country code
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits
    const digits = value.replace(/\D/g, '');
    // Update the mobile number in the form data
    handleChange('mobile', `${countryCode}${digits}`);
  };

  // Handle country code change
  const handleCountryCodeChange = (value: string) => {
    setCountryCode(value);
    // Update the mobile number with the new country code
    if (formData.mobile) {
      const mobileWithoutCode = formData.mobile.replace(/^\d+/, '');
      handleChange('mobile', `${value}${mobileWithoutCode}`);
    }
  };

  // Display the mobile number without country code in the input
  const displayMobile = formData.mobile?.replace(new RegExp(`^${countryCode}`), '') || '';

  return (
    <>
      <div>
        <Label htmlFor="fullName" className="text-gray-300 mb-2 block">Full Name <span className="text-charcoalDanger">*</span></Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
          <Input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="Enter your full name"
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
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Enter your email address"
            className="bg-charcoalSecondary/50 border-gray-700 text-white h-12 pl-10"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="mobile" className="text-gray-300 mb-2 block">Mobile Number <span className="text-charcoalDanger">*</span></Label>
        <div className="flex">
          <div className="relative w-24 mr-2">
            <Select
              value={countryCode}
              onValueChange={handleCountryCodeChange}
            >
              <SelectTrigger className="bg-charcoalSecondary/50 border-gray-700 text-white h-12">
                <SelectValue placeholder="+91" />
              </SelectTrigger>
              <SelectContent className="bg-charcoalSecondary border-gray-700 text-white">
                <SelectItem value="91">+91</SelectItem>
                <SelectItem value="1">+1</SelectItem>
                <SelectItem value="44">+44</SelectItem>
                <SelectItem value="61">+61</SelectItem>
                <SelectItem value="65">+65</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="relative flex-1">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <Input
              id="mobile"
              type="tel"
              value={displayMobile}
              onChange={handleMobileChange}
              placeholder="Enter your 10 digit mobile number"
              className="bg-charcoalSecondary/50 border-gray-700 text-white h-12 pl-10"
              required
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RegistrationStepOne;
