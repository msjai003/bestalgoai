
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

interface ResetPasswordStepProps {
  email?: string;
  setEmail?: (email: string) => void;
  newPassword: string;
  setNewPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const ResetPasswordStep: React.FC<ResetPasswordStepProps> = ({
  email,
  setEmail,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  isLoading,
  onSubmit
}) => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {email !== undefined && setEmail !== undefined && (
        <div>
          <Label htmlFor="email" className="text-gray-300 mb-2 block">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="bg-gray-800/50 border-gray-700 text-white h-12 mb-4"
            disabled={isLoading}
          />
        </div>
      )}
      
      <div>
        <Label htmlFor="newPassword" className="text-gray-300 mb-2 block">New Password</Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            className="bg-gray-800/50 border-gray-700 text-white h-12 mb-4 pr-10"
            disabled={isLoading}
          />
          <button 
            type="button"
            onClick={toggleNewPasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
            aria-label={showNewPassword ? "Hide password" : "Show password"}
          >
            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
            disabled={isLoading}
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
      
      <Button
        type="submit"
        disabled={isLoading || !newPassword || !confirmPassword}
        className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-6 rounded-xl shadow-lg"
      >
        {isLoading ? 'Resetting Password...' : 'Reset Password'}
      </Button>
    </form>
  );
};

export default ResetPasswordStep;
