
const FeatureCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
  <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-lg">
    <div className="flex items-start gap-4">
      <div className="bg-[#FF00D4]/10 p-3 rounded-xl">
        <i className={`${icon} text-[#FF00D4] text-2xl`}></i>
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  </div>
);

export const Features = () => {
  const features = [
    {
      icon: "fa-solid fa-robot",
      title: "AI-Powered Trading",
      description: "Advanced algorithms that analyze market patterns and execute trades automatically"
    },
    {
      icon: "fa-solid fa-shield-halved",
      title: "Risk Management",
      description: "Built-in safeguards and real-time monitoring to protect your investments"
    }
  ];

  return (
    <section className="px-4 py-8">
      <div className="space-y-4">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  );
};
