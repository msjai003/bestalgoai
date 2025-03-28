
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Send, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const FeedbackForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!name.trim() || !email.trim() || !mobileNumber.trim() || !message.trim()) {
      setErrorMessage("Please fill out all fields");
      toast({
        title: "Missing information",
        description: "Please fill out all fields",
        variant: "destructive",
      });
      return false;
    }

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
    navigate('/signup');
  };

  return (
    <div className="premium-card p-6 backdrop-blur-lg shadow-2xl border border-gray-700/50">
      <h2 className="text-xl font-semibold mb-4">
        <span className="gradient-text">Sign Up</span> for Updates
      </h2>
      
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg flex items-start animate-pulse">
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
            className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg p-3 focus:border-[#FF00D4] focus:ring-1 focus:ring-[#FF00D4]/30 focus:outline-none transition-all duration-300"
          />
        </div>
        
        <div>
          <Label htmlFor="mobileNumber" className="text-sm text-gray-300">Mobile Number</Label>
          <Input
            id="mobileNumber"
            type="tel"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="Enter your 10 digit mobile number"
            className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg p-3 focus:border-[#FF00D4] focus:ring-1 focus:ring-[#FF00D4]/30 focus:outline-none transition-all duration-300"
          />
        </div>
        
        <div>
          <Label htmlFor="email" className="text-sm text-gray-300">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg p-3 focus:border-[#FF00D4] focus:ring-1 focus:ring-[#FF00D4]/30 focus:outline-none transition-all duration-300"
          />
        </div>
        
        <div>
          <Label htmlFor="message" className="text-sm text-gray-300">Your Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share your thoughts with us..."
            className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg p-3 focus:border-[#FF00D4] focus:ring-1 focus:ring-[#FF00D4]/30 focus:outline-none transition-all duration-300"
            rows={5}
          />
        </div>
        
        <Button
          type="submit"
          className="w-full flex items-center justify-center gap-2 gradient-button p-6 rounded-xl group hover:animate-micro-glow"
        >
          <Send className="w-5 h-5 group-hover:animate-micro-bounce" />
          <span className="relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white after:scale-x-0 after:origin-right after:transition-transform group-hover:after:scale-x-100 group-hover:after:origin-left">Sign Up</span>
        </Button>
      </form>
    </div>
  );
};

export default FeedbackForm;
