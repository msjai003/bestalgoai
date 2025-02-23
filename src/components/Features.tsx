
const FeatureCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
  <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700 hover:bg-gray-800/70 transition-all duration-300 transform hover:-translate-y-1">
    <i className={`${icon} text-[#FF00D4] text-3xl mb-4`}></i>
    <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

export const Features = () => {
  const features = [
    {
      icon: "fa-solid fa-robot",
      title: "AI-Powered Strategies",
      description: "Advanced algorithms that adapt to market conditions in real-time"
    },
    {
      icon: "fa-solid fa-shield-halved",
      title: "SEBI Compliant",
      description: "Fully regulated and secure trading platform"
    },
    {
      icon: "fa-solid fa-gauge-high",
      title: "Low Latency Execution",
      description: "Lightning-fast order execution for optimal results"
    }
  ];

  return (
    <section className="px-4 py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">
          Why Choose BestAlgo.ai?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};
