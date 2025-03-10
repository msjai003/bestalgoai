
import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Mail, ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from '@/components/ui/use-toast';
import FeedbackForm from '@/components/FeedbackForm';
import FeedbackList from '@/components/FeedbackList';

const faqItems = [
  {
    question: "How do I create my first algo strategy?",
    answer: "Our platform provides an intuitive strategy builder where you can create custom algorithms. Start by selecting 'Create Strategy' from your dashboard and follow our step-by-step guide."
  },
  {
    question: "What are the trading limits?",
    answer: "Trading limits vary based on your subscription plan. Basic plans start with standard limits while Pro plans offer higher limits. Check our pricing page for detailed information."
  },
  {
    question: "How secure is my trading data?",
    answer: "We employ bank-grade encryption and security measures to protect your data. All trading information is stored in secure servers with regular backups and monitoring."
  }
];

const SupportPage = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate sending email
    setTimeout(() => {
      toast({
        title: "Email sent",
        description: "We've received your message and will respond shortly.",
      });
      setEmail('');
      setSubject('');
      setMessage('');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="pt-16 pb-20">
        <section className="px-4 py-8 bg-gradient-to-br from-gray-900 to-gray-800">
          <h1 className="text-2xl font-bold mb-2">How can we help you?</h1>
          <p className="text-gray-400">Get instant support for your algo trading needs</p>
        </section>

        <section className="px-4 py-6">
          <Accordion type="single" collapsible className="space-y-3">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-gray-800/50 rounded-xl border border-gray-700"
              >
                <AccordionTrigger className="px-4 text-left font-medium hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 text-gray-400">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* New Feedback Form Section */}
        <section className="px-4 py-6">
          <h2 className="text-xl font-bold mb-4">Share Your Experience</h2>
          <FeedbackForm />
        </section>

        {/* New Feedback List Section */}
        <section className="px-4 py-6 bg-gray-800/30">
          <h2 className="text-xl font-bold mb-4">Recent Feedback</h2>
          <FeedbackList />
        </section>

        <section className="px-4 py-6 bg-gradient-to-br from-gray-900 via-gray-800 to-[#FF00D4]/20">
          <h2 className="text-xl font-bold mb-4">Email Support</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm mb-1">Your Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your.email@example.com"
                className="w-full bg-gray-800 border-gray-700"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm mb-1">Subject</label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                placeholder="How can we help you?"
                className="w-full bg-gray-800 border-gray-700"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm mb-1">Message</label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="Describe your issue or question in detail..."
                className="w-full bg-gray-800 border-gray-700"
                rows={5}
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-[#FF00D4] hover:bg-[#FF00D4]/90 text-white p-6 rounded-xl"
            >
              <Mail className="w-5 h-5" />
              <span>{isSubmitting ? "Sending..." : "Send Email"}</span>
            </Button>
            <div className="text-center text-sm text-gray-400 mt-2">
              Default support email: support@bestalgo.ai
            </div>
          </form>
        </section>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default SupportPage;
