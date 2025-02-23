
export const Hero = () => {
  return (
    <section className="pt-16 px-4">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-pink-800 p-6 mt-4">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF00D4]/20 to-purple-900/20 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center py-12">
          <h1 className="text-3xl font-bold mb-3">AI-Powered Algo Trading</h1>
          <p className="text-gray-300 mb-6">Smart trading strategies for the modern Indian investor</p>
          <button className="bg-gradient-to-r from-[#FF00D4] to-purple-600 px-8 py-3 rounded-full font-semibold shadow-lg shadow-[#FF00D4]/25 hover:shadow-[#FF00D4]/40 transition-all">
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
};
