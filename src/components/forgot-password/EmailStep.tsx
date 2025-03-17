
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EmailStepProps {
  email: string;
  setEmail: (email: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const EmailStep: React.FC<EmailStepProps> = ({ email, setEmail, isLoading, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <Label htmlFor="email" className="text-gray-300 mb-2 block">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="bg-gray-800/50 border-gray-700 text-white h-12"
          disabled={isLoading}
          required
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading || !email.trim()}
        className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-6 rounded-xl shadow-lg"
      >
        {isLoading ? 'Sending...' : 'Send Verification Code'}
      </Button>
    </form>
  );
};

export default EmailStep;
