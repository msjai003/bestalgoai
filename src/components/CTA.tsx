
import { Button } from "@/components/ui/button";

export const CTA = () => {
  return (
    <section className="px-4 py-12 bg-gradient-to-t from-charcoalPrimary to-charcoalSecondary relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-5"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-cyan/5 to-cyan/5"></div>
      
      <div className="glass-card p-8 relative z-10">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to <span className="gradient-text">Transform</span> Your Trading?</h2>
          <p className="text-gray-300 mb-6">Join thousands of successful traders using BestAlgo.ai</p>
          <Button 
            variant="gradient" 
            className="w-full py-3 px-6 rounded-xl font-semibold shadow-lg group relative overflow-hidden"
          >
            <span className="relative z-10 group-hover:animate-micro-bounce inline-block">Get Started Free</span>
            <span className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </Button>
        </div>
      </div>
    </section>
  );
};
