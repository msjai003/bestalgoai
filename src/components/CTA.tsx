
export const CTA = () => {
  return (
    <section className="px-4 py-12 bg-gradient-to-t from-black to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-5"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 to-purple-500/5"></div>
      
      <div className="glass-card p-8 relative z-10">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to <span className="gradient-text">Transform</span> Your Trading?</h2>
          <p className="text-gray-300 mb-6">Join thousands of successful traders using BestAlgo.ai</p>
          <button className="w-full py-3 px-6 gradient-button text-white rounded-xl font-semibold shadow-lg hover:opacity-90 transition-opacity active:scale-[0.98] hover:animate-micro-glow group relative overflow-hidden">
            <span className="relative z-10 group-hover:animate-micro-bounce inline-block">Get Started Free</span>
            <span className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </button>
        </div>
      </div>
    </section>
  );
};
