
import { Card } from "@/components/ui/card";

export const Features = () => {
  const features = [
    {
      id: 'feature-1',
      icon: 'fa-solid fa-robot',
      title: 'AI-Powered Strategies',
      description: 'Advanced algorithms that adapt to market conditions in real-time'
    },
    {
      id: 'feature-2',
      icon: 'fa-solid fa-shield-halved',
      title: 'SEBI Compliant',
      description: 'Fully regulated and secure trading platform'
    },
    {
      id: 'feature-3',
      icon: 'fa-solid fa-gauge-high',
      title: 'Low Latency Execution',
      description: 'Lightning-fast order execution for optimal results'
    }
  ];

  return (
    <section className="px-4 py-12 bg-charcoalPrimary">
      <h2 className="text-2xl font-bold mb-6 text-cyan">Why Choose BestAlgo.ai?</h2>
      <div className="space-y-6">
        {features.map((feature) => (
          <div 
            key={feature.id} 
            id={feature.id} 
            className="p-5 rounded-xl bg-charcoalSecondary/30 border border-cyan/30 shadow-lg hover:shadow-cyan/20 transition-all duration-300"
          >
            <i className={`${feature.icon} text-cyan text-2xl mb-4`}></i>
            <h3 className="font-semibold mb-3 text-cyan text-lg">{feature.title}</h3>
            <p className="text-sm text-charcoalTextSecondary font-medium">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
