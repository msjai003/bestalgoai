
import { Card } from "@/components/ui/card";
import { Sparkles, Shield, Zap } from "lucide-react";

export const Features = () => {
  const features = [
    {
      id: 'feature-1',
      icon: <Sparkles className="text-cyan text-2xl mb-4" />,
      title: 'AI-Powered Strategies',
      description: 'Advanced algorithms that adapt to market conditions in real-time'
    },
    {
      id: 'feature-2',
      icon: <Shield className="text-cyan text-2xl mb-4" />,
      title: 'SEBI Compliant',
      description: 'Fully regulated and secure trading platform'
    },
    {
      id: 'feature-3',
      icon: <Zap className="text-cyan text-2xl mb-4" />,
      title: 'Low Latency Execution',
      description: 'Lightning-fast order execution for optimal results'
    }
  ];

  return (
    <section className="px-4 py-12 bg-charcoalPrimary">
      <h2 className="text-2xl font-bold mb-6 text-cyan tracking-tight">Why Choose BestAlgo.ai?</h2>
      <div className="space-y-6">
        {features.map((feature) => (
          <div 
            key={feature.id} 
            id={feature.id} 
            className="p-5 rounded-xl bg-charcoalSecondary/30 border border-cyan/30 shadow-lg hover:shadow-cyan/20 transition-all duration-300"
          >
            {feature.icon}
            <h3 className="font-bold mb-3 text-cyan text-lg tracking-tight">{feature.title}</h3>
            <p className="text-sm text-cyan/70 font-medium">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
