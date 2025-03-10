
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { CTA } from '@/components/CTA';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const Index = () => {
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFeedbackForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!feedbackForm.name || !feedbackForm.email || !feedbackForm.message) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Insert feedback into the database
      const { error } = await supabase
        .from('feedback')
        .insert([feedbackForm]);
        
      if (error) throw error;
      
      toast.success('Thank you for your feedback!');
      
      // Reset form
      setFeedbackForm({
        name: '',
        email: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Could not submit feedback. Please try again later.');
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
        
        {/* Feedback Section */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Share Your Feedback</h2>
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Your Name
                  </label>
                  <Input 
                    id="name"
                    name="name"
                    value={feedbackForm.name}
                    onChange={handleFeedbackChange}
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
                    value={feedbackForm.email}
                    onChange={handleFeedbackChange}
                    className="bg-gray-700/50 border-gray-600"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                    Your Feedback
                  </label>
                  <Textarea 
                    id="message"
                    name="message"
                    value={feedbackForm.message}
                    onChange={handleFeedbackChange}
                    className="bg-gray-700/50 border-gray-600 min-h-[100px]"
                    placeholder="What do you think about our platform?"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
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
