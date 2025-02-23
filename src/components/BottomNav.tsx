
export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 w-full bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 md:hidden">
      <div className="flex justify-around items-center h-16">
        <a href="#" className="flex flex-col items-center text-[#FF00D4]">
          <i className="fa-solid fa-house text-xl"></i>
          <span className="text-xs mt-1">Home</span>
        </a>
        <a href="#" className="flex flex-col items-center text-gray-500 hover:text-[#FF00D4] transition-colors">
          <i className="fa-solid fa-chart-line text-xl"></i>
          <span className="text-xs mt-1">Market</span>
        </a>
        <a href="#" className="flex flex-col items-center text-gray-500 hover:text-[#FF00D4] transition-colors">
          <i className="fa-solid fa-gear text-xl"></i>
          <span className="text-xs mt-1">Strategy</span>
        </a>
        <a href="#" className="flex flex-col items-center text-gray-500 hover:text-[#FF00D4] transition-colors">
          <i className="fa-solid fa-user text-xl"></i>
          <span className="text-xs mt-1">Profile</span>
        </a>
      </div>
    </nav>
  );
};
