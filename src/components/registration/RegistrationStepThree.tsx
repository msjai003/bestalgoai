
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

interface RegistrationStepThreeProps {
  formData: {
    tradingExperience: string;
    isResearchAnalyst: boolean;
    certificationNumber: string;
  };
  handleChange: (field: string, value: string | boolean) => void;
}

const RegistrationStepThree: React.FC<RegistrationStepThreeProps> = ({ formData, handleChange }) => {
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
};

export default RegistrationStepThree;
