
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { sendTestEmail } from '@/services/emailService';
import { toast } from 'sonner';

const EmailTester = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !name) {
      toast.error('Please fill in both email and name fields');
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await sendTestEmail(email, name);
      
      if (response.success) {
        setResult({
          success: true,
          message: 'Test email sent successfully! Please check your inbox (and spam folder).'
        });
        toast.success('Test email sent! Check your inbox and spam folder.');
      } else {
        const errorMessage = 
          response.error?.message || 
          (typeof response.error === 'string' ? response.error : 'Failed to send test email');
        
        setResult({
          success: false,
          message: `Error: ${errorMessage}`
        });
        toast.error(`Failed to send email: ${errorMessage}`);
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: `Exception: ${error.message || 'Unknown error'}`
      });
      toast.error(`Exception: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 shadow-md">
      <h2 className="text-xl font-semibold mb-4">Email Delivery Tester</h2>
      <p className="text-gray-500 mb-4">Use this tool to test if the email system is working correctly.</p>
      
      <form onSubmit={handleSendTestEmail} className="space-y-4">
        <div>
          <Label htmlFor="test-email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <Input
              id="test-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="pl-10"
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="test-name">Your Name</Label>
          <Input
            id="test-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>
        
        <Button 
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : 'Send Test Email'}
        </Button>
      </form>
      
      {result && (
        <Alert className={`mt-4 ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          {result.success ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={result.success ? 'text-green-700' : 'text-red-700'}>
            {result.message}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="mt-6 text-sm text-gray-500">
        <h3 className="font-medium mb-2">Troubleshooting Tips:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Check your spam/junk folder</li>
          <li>Verify the Resend API key is correct</li>
          <li>Ensure the domain is verified in Resend dashboard</li>
          <li>Check console logs for detailed error information</li>
        </ul>
      </div>
    </Card>
  );
};

export default EmailTester;
