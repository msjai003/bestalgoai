
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { GraduationCap } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

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
      <div>
        <Label htmlFor="tradingExperience" className="text-gray-300 mb-2 block">Trading Experience Level <span className="text-charcoalDanger">*</span></Label>
        <div className="relative">
          <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 z-10" />
          <Select 
            value={formData.tradingExperience} 
            onValueChange={(value) => handleChange('tradingExperience', value)}
          >
            <SelectTrigger id="tradingExperience" className="bg-charcoalSecondary/50 border-gray-700 text-white h-12 pl-10">
              <SelectValue placeholder="Select your experience level" />
            </SelectTrigger>
            <SelectContent className="bg-charcoalSecondary border-gray-700 text-white">
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3">
        <Label htmlFor="research-analyst" className="text-gray-300 cursor-pointer">
          Are you a Research Analyst?
        </Label>
        <Switch
          id="research-analyst"
          checked={formData.isResearchAnalyst}
          onCheckedChange={(checked) => handleChange('isResearchAnalyst', checked)}
          className="bg-gray-700 data-[state=checked]:bg-cyan"
        />
      </div>
      
      {formData.isResearchAnalyst && (
        <div className="pt-2">
          <Label htmlFor="certificationNumber" className="text-gray-300 mb-2 block">RA Certification Number <span className="text-charcoalDanger">*</span></Label>
          <Input
            id="certificationNumber"
            placeholder="Enter your certification number"
            value={formData.certificationNumber}
            onChange={(e) => handleChange('certificationNumber', e.target.value)}
            className="bg-charcoalSecondary/50 border-gray-700 text-white h-12"
            required
          />
        </div>
      )}
    </div>
  );
};

export default RegistrationStepThree;
