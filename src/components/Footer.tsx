
export const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 px-4 py-8">
      <div className="flex justify-center space-x-6 mb-6">
        <a href="#" className="text-gray-400 hover:text-[#FF00D4] cursor-pointer transition-colors">
          <i className="fa-brands fa-twitter text-xl"></i>
        </a>
        <a href="#" className="text-gray-400 hover:text-[#FF00D4] cursor-pointer transition-colors">
          <i className="fa-brands fa-linkedin text-xl"></i>
        </a>
        <a href="#" className="text-gray-400 hover:text-[#FF00D4] cursor-pointer transition-colors">
          <i className="fa-brands fa-instagram text-xl"></i>
        </a>
      </div>
      <div className="text-center text-sm text-gray-400">
        <p>&copy; 2025 BestAlgo.ai. All rights reserved.</p>
      </div>
    </footer>
  );
};
