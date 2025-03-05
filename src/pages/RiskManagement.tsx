
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertTriangle,
  BarChart4,
  Bell,
  ChevronRight,
  HelpCircle,
  Shield,
  TrendingDown,
  Zap
} from "lucide-react";
import { toast } from "sonner";

const RiskManagement = () => {
  const navigate = useNavigate();
  const [maxExposure, setMaxExposure] = useState(25);
  const [dailyDrawdown, setDailyDrawdown] = useState(5);
  const [weeklyDrawdown, setWeeklyDrawdown] = useState(15);
  const [stopLossPercent, setStopLossPercent] = useState(2);
  const [takeProfitPercent, setTakeProfitPercent] = useState(5);
  const [enforceStopLoss, setEnforceStopLoss] = useState(true);
  const [volatilityFilter, setVolatilityFilter] = useState(false);
  const [autoClosePositions, setAutoClosePositions] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);
  const [notifySMS, setNotifySMS] = useState(false);
  
  // Calculate risk score based on settings (simplified for demo)
  const calculateRiskScore = () => {
    const exposureScore = maxExposure > 30 ? 3 : maxExposure > 20 ? 2 : 1;
    const drawdownScore = dailyDrawdown > 7 ? 3 : dailyDrawdown > 4 ? 2 : 1;
    const slScore = stopLossPercent > 3 ? 3 : stopLossPercent > 1.5 ? 2 : 1;
    
    const totalScore = (exposureScore + drawdownScore + slScore) / 3;
    
    if (totalScore > 2.5) return { level: "High", color: "text-red-500" };
    if (totalScore > 1.5) return { level: "Moderate", color: "text-yellow-500" };
    return { level: "Low", color: "text-emerald-500" };
  };
  
  const riskScore = calculateRiskScore();
  
  const handleSaveChanges = () => {
    toast.success("Risk management settings updated");
  };
  
  const getRiskLevelColor = (value: number, threshold1: number, threshold2: number) => {
    if (value <= threshold1) return "bg-emerald-500";
    if (value <= threshold2) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Link to="/settings" className="p-2">
            <i className="fa-solid fa-arrow-left text-gray-300"></i>
          </Link>
          <h1 className="text-lg font-semibold">Risk Management</h1>
          <button className="p-2">
            <HelpCircle className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </header>

      <main className="pt-16 pb-20 px-4 space-y-6">
        {/* Risk Overview & Indicators */}
        <section className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 shadow-lg">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <BarChart4 className="w-5 h-5 text-pink-500" />
            <span>Risk Overview</span>
          </h2>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-sm text-gray-400">Current Risk Level</span>
              <h3 className={`text-xl font-bold ${riskScore.color}`}>{riskScore.level}</h3>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-gray-700 flex items-center justify-center">
              <div className={`w-8 h-8 rounded-full ${riskScore.color === "text-red-500" ? "bg-red-500" : riskScore.color === "text-yellow-500" ? "bg-yellow-500" : "bg-emerald-500"}`}></div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-400">Daily Drawdown</span>
                <span className={dailyDrawdown > 7 ? "text-red-400" : dailyDrawdown > 4 ? "text-yellow-400" : "text-emerald-400"}>
                  {dailyDrawdown}% / 10%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full ${getRiskLevelColor(dailyDrawdown, 4, 7)}`} style={{ width: `${(dailyDrawdown/10)*100}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-400">Capital Exposure</span>
                <span className={maxExposure > 30 ? "text-red-400" : maxExposure > 20 ? "text-yellow-400" : "text-emerald-400"}>
                  {maxExposure}% / 50%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full ${getRiskLevelColor(maxExposure, 20, 30)}`} style={{ width: `${(maxExposure/50)*100}%` }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Risk Settings */}
        <section className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 shadow-lg">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-pink-500" />
            <span>Exposure Limits</span>
          </h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="max-exposure" className="text-sm text-gray-300">Maximum Capital Exposure</Label>
                <span className="text-sm font-medium">{maxExposure}%</span>
              </div>
              <Slider 
                id="max-exposure" 
                defaultValue={[maxExposure]} 
                max={50} 
                step={1}
                onValueChange={(value) => setMaxExposure(value[0])}
                className="py-2"
              />
              <p className="text-xs text-gray-400 mt-1">Maximum percentage of capital allocated to a single trade</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <Label htmlFor="leverage-toggle" className="text-sm text-gray-300">Enable Leverage</Label>
              </div>
              <Switch id="leverage-toggle" />
            </div>
          </div>
        </section>

        {/* Drawdown Controls */}
        <section className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 shadow-lg">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-pink-500" />
            <span>Drawdown Controls</span>
          </h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="daily-drawdown" className="text-sm text-gray-300">Daily Drawdown Limit</Label>
                <span className="text-sm font-medium">{dailyDrawdown}%</span>
              </div>
              <Slider 
                id="daily-drawdown" 
                defaultValue={[dailyDrawdown]} 
                max={10} 
                step={0.5}
                onValueChange={(value) => setDailyDrawdown(value[0])}
                className="py-2"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="weekly-drawdown" className="text-sm text-gray-300">Weekly Drawdown Limit</Label>
                <span className="text-sm font-medium">{weeklyDrawdown}%</span>
              </div>
              <Slider 
                id="weekly-drawdown" 
                defaultValue={[weeklyDrawdown]} 
                max={25} 
                step={1}
                onValueChange={(value) => setWeeklyDrawdown(value[0])}
                className="py-2"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="auto-close" 
                    checked={autoClosePositions}
                    onCheckedChange={(checked) => setAutoClosePositions(checked as boolean)}
                  />
                  <Label htmlFor="auto-close" className="text-sm text-gray-300">Auto-close positions on limit breach</Label>
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-4 h-4 text-gray-500" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-800 border-gray-700">
                    <p className="text-xs">Automatically closes all positions when drawdown limit is reached</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </section>

        {/* Stop-Loss / Take-Profit */}
        <section className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 shadow-lg">
          <h2 className="text-lg font-semibold mb-3">Stop-Loss / Take-Profit</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="stop-loss" className="text-sm text-gray-300">Default Stop-Loss</Label>
                <span className="text-sm font-medium">{stopLossPercent}%</span>
              </div>
              <Slider 
                id="stop-loss" 
                defaultValue={[stopLossPercent]} 
                max={10} 
                step={0.5}
                onValueChange={(value) => setStopLossPercent(value[0])}
                className="py-2"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="take-profit" className="text-sm text-gray-300">Default Take-Profit</Label>
                <span className="text-sm font-medium">{takeProfitPercent}%</span>
              </div>
              <Slider 
                id="take-profit" 
                defaultValue={[takeProfitPercent]} 
                max={20} 
                step={0.5}
                onValueChange={(value) => setTakeProfitPercent(value[0])}
                className="py-2"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="enforce-sl-tp" 
                  checked={enforceStopLoss}
                  onCheckedChange={(checked) => setEnforceStopLoss(checked as boolean)}
                />
                <Label htmlFor="enforce-sl-tp" className="text-sm text-gray-300">Enforce on every trade</Label>
              </div>
            </div>
          </div>
        </section>

        {/* Volatility Filters */}
        <section className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Volatility Filters</h2>
            <Switch 
              checked={volatilityFilter}
              onCheckedChange={setVolatilityFilter}
            />
          </div>
          
          <p className="text-sm text-gray-400 mt-2">
            Automatically adjust position sizes during high market volatility periods
          </p>
        </section>

        {/* Alert Preferences */}
        <section className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 shadow-lg">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Bell className="w-5 h-5 text-pink-500" />
            <span>Alert Preferences</span>
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="email-notify" 
                  checked={notifyEmail}
                  onCheckedChange={(checked) => setNotifyEmail(checked as boolean)}
                />
                <Label htmlFor="email-notify" className="text-sm text-gray-300">Email Notifications</Label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="push-notify" 
                  checked={notifyPush}
                  onCheckedChange={(checked) => setNotifyPush(checked as boolean)}
                />
                <Label htmlFor="push-notify" className="text-sm text-gray-300">Push Notifications</Label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sms-notify" 
                  checked={notifySMS}
                  onCheckedChange={(checked) => setNotifySMS(checked as boolean)}
                />
                <Label htmlFor="sms-notify" className="text-sm text-gray-300">SMS Alerts</Label>
              </div>
            </div>
            
            <div className="pt-2">
              <p className="text-sm text-gray-300 flex items-center gap-1">
                <span>Alert triggers</span>
                <ChevronRight className="w-4 h-4" />
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Configure when alerts are sent (drawdown reached, exposure limit, etc.)
              </p>
            </div>
          </div>
        </section>

        {/* Disclaimers */}
        <section className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-400">Risk Disclosure</h3>
              <p className="text-xs text-gray-400 mt-1">
                Trading involves substantial risk of loss. Past performance is not indicative of future results. 
                Risk management settings do not guarantee protection from losses.
              </p>
              <a href="#" className="text-xs text-pink-500 mt-2 inline-block">
                View full risk disclosure
              </a>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
        <Button 
          className="w-full py-6 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg font-medium shadow-lg hover:from-pink-700 hover:to-purple-700"
          onClick={handleSaveChanges}
        >
          Save Changes
        </Button>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default RiskManagement;
