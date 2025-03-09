
export const Hero = () => {
  return (
    <section className="relative px-4 py-12 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="absolute inset-0 bg-pink-500/5"></div>
      <div className="relative">
        <h1 className="text-3xl font-bold mb-3">AI-Powered Algo Trading for Everyone</h1>
        <p className="text-gray-300 mb-6">Join 10,000+ traders using advanced algorithms to maximize their returns in the Indian stock market</p>
        <button className="w-full py-3 px-6 bg-gradient-to-r from-pink-500/80 to-purple-500/80 rounded-xl text-white font-semibold shadow-lg hover:opacity-90 transition-opacity">
          Start Trading Now
        </button>
      </div>
      <div className="mt-8">
        <img 
          className="w-full h-48 object-cover rounded-xl shadow-lg" 
          src="https://storage.googleapis.com/uxpilot-auth.appspot.com/493f062fc3-bc315fc272ae97137e07.png" 
          alt="3D illustration of trading dashboard with charts and graphs, dark theme with purple accents, modern UI"
        />
      </div>
    </section>
  );
};
