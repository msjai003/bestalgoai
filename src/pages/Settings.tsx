
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Button 
            variant="ghost" 
            className="p-2"
            onClick={() => navigate('/subscription')}
          >
            <i className="fa-solid fa-arrow-left text-lg"></i>
          </Button>
          <h1 className="text-lg font-semibold">Settings</h1>
          <Button variant="ghost" className="p-2">
            <i className="fa-solid fa-circle-question text-lg"></i>
          </Button>
        </div>
      </header>

      <main className="pt-16 pb-24">
        <section className="px-4 py-6">
          <div className="flex items-center space-x-4">
            <img 
              src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" 
              alt="Profile" 
              className="w-16 h-16 rounded-full border-2 border-pink-600"
            />
            <div>
              <h2 className="text-lg font-semibold">Rahul Sharma</h2>
              <p className="text-sm text-gray-400">rahul.s@gmail.com</p>
              <span className="inline-flex items-center px-2.5 py-0.5 mt-2 rounded-full text-xs font-medium bg-gradient-to-r from-pink-600 to-purple-600">
                Premium Trader
              </span>
            </div>
          </div>
        </section>

        <section className="px-4">
          <div className="space-y-4">
            <div className="bg-gray-800/50 rounded-xl p-4 shadow-lg backdrop-blur-sm">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Account Settings</h3>
              <div className="space-y-3">
                <SettingsLink icon="fa-regular fa-user" label="Personal Details" />
                <SettingsLink icon="fa-solid fa-lock" label="Security Settings" />
                <SettingsLink icon="fa-solid fa-bell" label="Notifications" />
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4 shadow-lg backdrop-blur-sm">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Trading Settings</h3>
              <div className="space-y-3">
                <SettingsLink icon="fa-solid fa-building-columns" label="Broker Integration" />
                <SettingsLink icon="fa-solid fa-chart-line" label="Risk Management" />
              </div>
            </div>
          </div>
        </section>

        <section className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
          <Button 
            className="w-full py-6 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg font-medium shadow-lg hover:from-pink-700 hover:to-purple-700"
            onClick={() => navigate('/logout')}
          >
            Logout
          </Button>
        </section>
      </main>
    </div>
  );
};

const SettingsLink = ({ icon, label }: { icon: string; label: string }) => (
  <Link to="#" className="flex items-center justify-between py-2">
    <div className="flex items-center space-x-3">
      <i className={`${icon} text-pink-500`}></i>
      <span>{label}</span>
    </div>
    <i className="fa-solid fa-chevron-right text-gray-500"></i>
  </Link>
);

export default Settings;
