
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="bg-gray-900 min-h-screen">
      <Header />
      <main className="pt-16 pb-20">
        <section id="portfolio-overview" className="p-4">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 shadow-xl border border-gray-800">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-gray-400 text-sm">Portfolio Value</h2>
                <p className="text-2xl font-bold text-white">₹12,45,678</p>
              </div>
              <Link 
                to="/subscription" 
                className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg text-sm hover:bg-emerald-400/20"
              >
                Upgrade
              </Link>
            </div>
            <div className="flex justify-between text-sm mt-4">
              <div>
                <p className="text-gray-400">Today's P&L</p>
                <p className="text-emerald-400 font-medium">+₹24,500</p>
              </div>
              <div>
                <p className="text-gray-400">Overall P&L</p>
                <p className="text-emerald-400 font-medium">+₹1,45,500</p>
              </div>
            </div>
          </div>
        </section>

        <section id="quick-actions" className="px-4 mt-6">
          <div className="grid grid-cols-4 gap-4">
            <QuickActionButton icon="fa-chart-line" label="Strategies" />
            <QuickActionButton icon="fa-magnifying-glass-chart" label="Analysis" />
            <Link to="/subscription" className="block">
              <QuickActionButton icon="fa-star" label="Premium" />
            </Link>
            <Link to="/community" className="block">
              <QuickActionButton icon="fa-users" label="Community" />
            </Link>
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
};

const QuickActionButton = ({ icon, label }: { icon: string; label: string }) => (
  <div className="flex flex-col items-center bg-gray-800/30 rounded-xl p-3">
    <i className={`fa-solid ${icon} text-[#FF00D4] text-xl mb-2`}></i>
    <span className="text-gray-300 text-xs">{label}</span>
  </div>
);

export default Dashboard;
