
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Send, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { testTableAccess } from '@/lib/supabase/test-connection';

const FeedbackForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const validateForm = () => {
    // Validate inputs
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage("Please fill out all fields");
      toast({
        title: "Missing information",
        description: "Please fill out all fields",
        variant: "destructive",
      });
      return false;
    }

    // Simple email validation
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setErrorMessage("Please enter a valid email address");
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    setErrorMessage(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }

      // Test table access before attempting to insert
      const tableTest = await testTableAccess('feedback');
      if (!tableTest.success) {
        throw new Error(`Cannot access feedback table: ${tableTest.message}`);
      }

      console.log("Submitting feedback to Supabase...");
      
      // Insert data into Supabase
      const { data, error } = await supabase
        .from('feedback')
        .insert([
          { name, email, message }
        ]);

      if (error) {
        console.error('Error submitting feedback:', error);
        throw new Error(error.message);
      }

      console.log("Feedback submitted successfully:", data);
      
      // Success message
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });

      // Reset form
      setName('');
      setEmail('');
      setMessage('');
    } catch (error: any) {
      console.error('Error in feedback submission:', error);
      setErrorMessage(error.message || "There was a problem submitting your feedback");
      toast({
        title: "Submission failed",
        description: error.message || "There was a problem submitting your feedback",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700">
      <h2 className="text-xl font-semibold mb-4">Share Your Feedback</h2>
      
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg flex items-start">
          <AlertCircle className="text-red-400 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
          <p className="text-red-200 text-sm">{errorMessage}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-sm text-gray-300">Your Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 focus:border-[#FF00D4] focus:outline-none"
          />
        </div>
        
        <div>
          <Label htmlFor="email" className="text-sm text-gray-300">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 focus:border-[#FF00D4] focus:outline-none"
          />
        </div>
        
        <div>
          <Label htmlFor="message" className="text-sm text-gray-300">Your Feedback</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share your thoughts with us..."
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 focus:border-[#FF00D4] focus:outline-none"
            rows={5}
          />
        </div>
        
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-[#FF00D4] hover:bg-[#FF00D4]/90 text-white p-6 rounded-xl"
        >
          <Send className="w-5 h-5" />
          <span>{isSubmitting ? "Submitting..." : "Submit Feedback"}</span>
        </Button>
      </form>
    </div>
  );
};

export default FeedbackForm;
