
export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 w-full bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
      <div className="flex justify-around px-6 py-2">
        <button className="flex flex-col items-center p-2">
          <i className="fa-solid fa-house text-[#FF00D4]"></i>
          <span className="text-xs text-gray-400 mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center p-2">
          <i className="fa-solid fa-chart-simple text-gray-500"></i>
          <span className="text-xs text-gray-400 mt-1">Trade</span>
        </button>
        <button className="flex flex-col items-center p-2">
          <i className="fa-solid fa-bell text-gray-500"></i>
          <span className="text-xs text-gray-400 mt-1">Alerts</span>
        </button>
        <button className="flex flex-col items-center p-2">
          <i className="fa-solid fa-gear text-gray-500"></i>
          <span className="text-xs text-gray-400 mt-1">Settings</span>
        </button>
      </div>
    </nav>
  );
};
