
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, ShieldAlert } from 'lucide-react';

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
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const checkPasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength(null);
      return;
    }
    
    // Check password strength
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const isLongEnough = password.length >= 8;
    
    const score = [hasLowerCase, hasUpperCase, hasNumber, hasSpecialChar, isLongEnough].filter(Boolean).length;
    
    if (score <= 2) setPasswordStrength('weak');
    else if (score <= 4) setPasswordStrength('medium');
    else setPasswordStrength('strong');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setNewPassword(newValue);
    checkPasswordStrength(newValue);
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
            onChange={handlePasswordChange}
            placeholder="••••••••"
            className="bg-gray-800/50 border-gray-700 text-white h-12 mb-1 pr-10"
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
        
        {passwordStrength && (
          <div className="mb-4">
            <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full ${
                  passwordStrength === 'weak' ? 'w-1/3 bg-red-500' : 
                  passwordStrength === 'medium' ? 'w-2/3 bg-yellow-500' : 
                  'w-full bg-green-500'
                }`}
              />
            </div>
            <p className={`text-xs mt-1 ${
              passwordStrength === 'weak' ? 'text-red-400' : 
              passwordStrength === 'medium' ? 'text-yellow-400' : 
              'text-green-400'
            }`}>
              {passwordStrength === 'weak' ? 'Weak password' : 
              passwordStrength === 'medium' ? 'Medium strength password' : 
              'Strong password'}
            </p>
          </div>
        )}
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
        
        {newPassword && confirmPassword && newPassword !== confirmPassword && (
          <p className="text-red-400 text-sm mt-1 flex items-center">
            <ShieldAlert className="h-3 w-3 mr-1" /> Passwords do not match
          </p>
        )}
      </div>
      
      <Button
        type="submit"
        disabled={isLoading || !newPassword || !confirmPassword || (newPassword !== confirmPassword)}
        className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-6 rounded-xl shadow-lg"
      >
        {isLoading ? 'Resetting Password...' : 'Reset Password'}
      </Button>
    </form>
  );
};

export default ResetPasswordStep;
