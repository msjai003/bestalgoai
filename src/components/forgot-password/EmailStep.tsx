
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EmailStepProps {
  email: string;
  setEmail: (email: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const EmailStep: React.FC<EmailStepProps> = ({ email, setEmail, isLoading, onSubmit }) => {
  const [emailSent, setEmailSent] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    onSubmit(e);
    if (email) {
      setEmailSent(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {emailSent && (
        <Alert className="bg-green-900/30 border-green-800 mb-4">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-200 ml-2">
            Reset link sent to your mail ID ✅
          </AlertDescription>
        </Alert>
      )}
      
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
          autoComplete="email"
          aria-required="true"
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading || !email}
        className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-6 rounded-xl shadow-lg"
      >
        {isLoading ? 'Sending...' : emailSent ? 'Resend Reset Link' : 'Send Reset Link'}
      </Button>
    </form>
  );
};

export default EmailStep;

