
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
    <section className="px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">Why Choose BestAlgo.ai?</h2>
      <div className="space-y-6">
        {features.map((feature) => (
          <div key={feature.id} id={feature.id} className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
            <i className={`${feature.icon} text-[#FF00D4] text-2xl mb-3`}></i>
            <h3 className="font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-300">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
