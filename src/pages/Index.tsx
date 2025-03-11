
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { CTA } from '@/components/CTA';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';

const Index = () => {
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSignupForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!signupForm.name || !signupForm.email || !signupForm.message) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Submit to the signup table
      const { error } = await supabase
        .from('signup')
        .insert({
          name: signupForm.name,
          email: signupForm.email,
          message: signupForm.message
        });
      
      if (error) {
        toast.error(error.message || 'Failed to submit your information');
        console.error('Signup submission error:', error);
      } else {
        toast.success('Thank you for signing up!');
        
        // Reset form
        setSignupForm({
          name: '',
          email: '',
          message: ''
        });
      }
    } catch (error: any) {
      console.error('Error submitting signup:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-16">
      <Header />
      <main className="pt-16">
        <Hero />
        <Features />
        <CTA />
        
        {/* Signup Section */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Sign Up for Updates</h2>
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Your Name
                  </label>
                  <Input 
                    id="name"
                    name="name"
                    value={signupForm.name}
                    onChange={handleSignupChange}
                    className="bg-gray-700/50 border-gray-600"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address
                  </label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    value={signupForm.email}
                    onChange={handleSignupChange}
                    className="bg-gray-700/50 border-gray-600"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                    Your Message
                  </label>
                  <Textarea 
                    id="message"
                    name="message"
                    value={signupForm.message}
                    onChange={handleSignupChange}
                    className="bg-gray-700/50 border-gray-600 min-h-[100px]"
                    placeholder="Tell us why you're interested in our platform"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Sign Up Now'}
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default Index;
