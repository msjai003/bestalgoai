
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell, Mail, Moon, ArrowLeft, Settings } from "lucide-react";
import { toast } from "sonner";

const Notifications = () => {
  const navigate = useNavigate();
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [tradingAlerts, setTradingAlerts] = useState(true);
  const [marketUpdates, setMarketUpdates] = useState(true);
  const [accountActivity, setAccountActivity] = useState(true);
  
  const [pushEnabled, setPushEnabled] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [strategyUpdates, setStrategyUpdates] = useState(true);
  
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [quietHoursFrom, setQuietHoursFrom] = useState("22:00");
  const [quietHoursTo, setQuietHoursTo] = useState("06:00");

  const handleSaveChanges = () => {
    toast.success("Notification preferences saved successfully");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              className="p-2 text-gray-400"
              onClick={() => navigate('/settings')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center">
              <span className="bg-gradient-to-r from-[#FF00D4] to-purple-600 bg-clip-text text-transparent text-xl font-bold">BestAlgo</span>
              <span className="text-xl font-bold">.ai</span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="p-2 text-gray-400"
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>
      
      <main className="pt-16 px-4 pb-24">
        <section className="py-6">
          <h1 className="text-2xl font-bold mb-2">Notifications</h1>
          <p className="text-gray-400">Manage your notification preferences</p>
        </section>
        
        <section className="space-y-6">
          {/* Email Notifications */}
          <div className="bg-gray-800/50 rounded-xl p-4 shadow-lg border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-pink-500" />
                <span className="font-semibold">Email Notifications</span>
              </div>
              <Switch 
                checked={emailEnabled} 
                onCheckedChange={setEmailEnabled}
                className="data-[state=checked]:bg-pink-600"
              />
            </div>
            
            <div className="space-y-3 pl-8">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Trading Alerts</span>
                <Checkbox 
                  checked={tradingAlerts}
                  onCheckedChange={(checked) => setTradingAlerts(checked as boolean)}
                  disabled={!emailEnabled}
                  className="data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600 border-gray-600"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Market Updates</span>
                <Checkbox 
                  checked={marketUpdates}
                  onCheckedChange={(checked) => setMarketUpdates(checked as boolean)}
                  disabled={!emailEnabled}
                  className="data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600 border-gray-600"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Account Activity</span>
                <Checkbox 
                  checked={accountActivity}
                  onCheckedChange={(checked) => setAccountActivity(checked as boolean)}
                  disabled={!emailEnabled}
                  className="data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600 border-gray-600"
                />
              </div>
            </div>
          </div>
          
          {/* Push Notifications */}
          <div className="bg-gray-800/50 rounded-xl p-4 shadow-lg border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-pink-500" />
                <span className="font-semibold">Push Notifications</span>
              </div>
              <Switch 
                checked={pushEnabled} 
                onCheckedChange={setPushEnabled}
                className="data-[state=checked]:bg-pink-600"
              />
            </div>
            
            <div className="space-y-3 pl-8">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Price Alerts</span>
                <Checkbox 
                  checked={priceAlerts}
                  onCheckedChange={(checked) => setPriceAlerts(checked as boolean)}
                  disabled={!pushEnabled}
                  className="data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600 border-gray-600"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Strategy Updates</span>
                <Checkbox 
                  checked={strategyUpdates}
                  onCheckedChange={(checked) => setStrategyUpdates(checked as boolean)}
                  disabled={!pushEnabled}
                  className="data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600 border-gray-600"
                />
              </div>
            </div>
          </div>
          
          {/* Quiet Hours */}
          <div className="bg-gray-800/50 rounded-xl p-4 shadow-lg border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-pink-500" />
                <span className="font-semibold">Quiet Hours</span>
              </div>
              <Switch 
                checked={quietHoursEnabled} 
                onCheckedChange={setQuietHoursEnabled}
                className="data-[state=checked]:bg-pink-600"
              />
            </div>
            
            <div className="flex gap-4 pl-8">
              <div className="flex-1">
                <label className="text-sm text-gray-400 block mb-2">From</label>
                <Select 
                  value={quietHoursFrom} 
                  onValueChange={setQuietHoursFrom}
                  disabled={!quietHoursEnabled}
                >
                  <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="20:00">8:00 PM</SelectItem>
                    <SelectItem value="21:00">9:00 PM</SelectItem>
                    <SelectItem value="22:00">10:00 PM</SelectItem>
                    <SelectItem value="23:00">11:00 PM</SelectItem>
                    <SelectItem value="00:00">12:00 AM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm text-gray-400 block mb-2">To</label>
                <Select 
                  value={quietHoursTo} 
                  onValueChange={setQuietHoursTo}
                  disabled={!quietHoursEnabled}
                >
                  <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="05:00">5:00 AM</SelectItem>
                    <SelectItem value="06:00">6:00 AM</SelectItem>
                    <SelectItem value="07:00">7:00 AM</SelectItem>
                    <SelectItem value="08:00">8:00 AM</SelectItem>
                    <SelectItem value="09:00">9:00 AM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>
        
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/95 border-t border-gray-800 backdrop-blur-lg">
          <Button 
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 py-6 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition-all"
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Notifications;
