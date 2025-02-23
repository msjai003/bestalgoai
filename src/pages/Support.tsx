
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { MessageSquare, Phone, Mail, ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

        <section className="px-4 py-6 bg-gradient-to-br from-gray-900 via-gray-800 to-[#FF00D4]/20">
          <h2 className="text-xl font-bold mb-4">Get in touch</h2>
          <div className="grid gap-3">
            <Button
              className="w-full flex items-center justify-center gap-2 bg-[#FF00D4] hover:bg-[#FF00D4]/90 text-white p-6 rounded-xl"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Chat with Us</span>
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 p-6 rounded-xl border border-gray-700"
            >
              <Phone className="w-5 h-5" />
              <span>Call Support</span>
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 p-6 rounded-xl border border-gray-700"
            >
              <Mail className="w-5 h-5" />
              <span>Email Support</span>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default SupportPage;
