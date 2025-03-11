
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Send, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';

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

      // Submit to the new signup table
      const { data, error } = await supabase
        .from('signup')
        .insert({
          name,
          email,
          message
        });
      
      if (error) {
        console.error('Error submitting feedback:', error);
        setErrorMessage(error.message || "Failed to submit your information");
        toast({
          title: "Submission failed",
          description: error.message || "There was a problem submitting your information",
          variant: "destructive",
        });
      } else {
        // Success message
        toast({
          title: "Signup submitted",
          description: "Thank you for signing up!",
        });

        // Reset form
        setName('');
        setEmail('');
        setMessage('');
      }
    } catch (error: any) {
      console.error('Error in feedback submission:', error);
      setErrorMessage(error.message || "An unexpected error occurred");
      toast({
        title: "Submission failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700">
      <h2 className="text-xl font-semibold mb-4">Sign Up for Updates</h2>
      
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
          <Label htmlFor="message" className="text-sm text-gray-300">Your Message</Label>
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
          <span>{isSubmitting ? "Submitting..." : "Sign Up"}</span>
        </Button>
      </form>
    </div>
  );
};

export default FeedbackForm;
