
export const Hero = () => {
  return (
    <section className="relative px-4 py-24 bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
      <div className="absolute inset-0 bg-[#FF00D4]/10 animate-pulse"></div>
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            AI-Powered Algo Trading for Everyone
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join 10,000+ traders using advanced algorithms to maximize their returns in the Indian stock market
          </p>
          <button className="w-full md:w-auto py-4 px-8 bg-gradient-to-r from-[#FF00D4] to-purple-600 rounded-xl font-semibold shadow-lg shadow-[#FF00D4]/20 hover:shadow-xl hover:shadow-[#FF00D4]/30 transition-all duration-300 transform hover:-translate-y-1">
            Start Trading Now
          </button>
        </div>
        <div className="mt-12">
          <div className="relative w-full max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>
            <img 
              className="w-full rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              src="https://storage.googleapis.com/uxpilot-auth.appspot.com/493f062fc3-bc315fc272ae97137e07.png" 
              alt="Trading Dashboard"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
