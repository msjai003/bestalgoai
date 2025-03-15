
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ResetPasswordStepProps {
  newPassword: string;
  setNewPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const ResetPasswordStep: React.FC<ResetPasswordStepProps> = ({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  isLoading,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <Label htmlFor="newPassword" className="text-gray-300 mb-2 block">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="••••••••"
          className="bg-gray-800/50 border-gray-700 text-white h-12"
        />
      </div>
      <div>
        <Label htmlFor="confirmPassword" className="text-gray-300 mb-2 block">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          className="bg-gray-800/50 border-gray-700 text-white h-12"
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-6 rounded-xl shadow-lg"
      >
        {isLoading ? 'Resetting Password...' : 'Reset Password'}
      </Button>
    </form>
  );
};

export default ResetPasswordStep;
