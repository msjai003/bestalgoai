
import { Button } from "@/components/ui/button";

export const CTA = () => {
  return (
    <section className="px-4 py-12 bg-gradient-to-t from-charcoalPrimary to-charcoalSecondary relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-5"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-cyan/5 to-cyan/5"></div>
      
      <div className="glass-card p-8 relative z-10 border-cyan/20">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to <span className="text-cyan">Transform</span> Your Trading?</h2>
          <p className="text-charcoalTextSecondary mb-6 font-medium">Join thousands of successful traders using BestAlgo.ai</p>
          <Button 
            variant="gradient" 
            size="xl"
            className="w-full py-7 rounded-lg font-semibold shadow-lg"
          >
            Get Started Free
          </Button>
        </div>
      </div>
    </section>
  );
};
