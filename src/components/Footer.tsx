
export const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center space-x-8 mb-8">
          <a href="#" className="text-gray-400 hover:text-[#FF00D4] transition-colors">
            <i className="fa-brands fa-twitter text-2xl"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-[#FF00D4] transition-colors">
            <i className="fa-brands fa-linkedin text-2xl"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-[#FF00D4] transition-colors">
            <i className="fa-brands fa-instagram text-2xl"></i>
          </a>
        </div>
        <div className="text-center text-gray-400">
          <p>&copy; 2025 BestAlgo.ai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
