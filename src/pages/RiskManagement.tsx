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
    <div className="bg-charcoalPrimary min-h-screen text-white">
      <header className="fixed top-0 left-0 right-0 bg-charcoalSecondary/95 backdrop-blur-lg border-b border-cyan/20 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Link to="/settings" className="p-2 hover:text-cyan transition-colors">
            <i className="fa-solid fa-arrow-left"></i>
          </Link>
          <h1 className="text-lg font-semibold text-white">Risk Management</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-2 hover:text-cyan transition-colors">
                  <HelpCircle className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-charcoalSecondary border-cyan/20">
                <p className="text-xs max-w-[200px]">Configure how much risk you're willing to take in your trading activities</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      <main className="pt-20 pb-24 px-4 space-y-6 max-w-3xl mx-auto">
        <section className="premium-card p-5 rounded-xl">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart4 className="w-5 h-5 text-cyan" />
            <span>Risk Overview</span>
          </h2>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-sm text-gray-400">Current Risk Level</span>
              <h3 className={`text-xl font-bold ${riskScore.color}`}>{riskScore.level}</h3>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-charcoalSecondary flex items-center justify-center animate-pulse-slow">
              <div className={`w-10 h-10 rounded-full ${riskScore.color === "text-red-500" ? "bg-red-500" : riskScore.color === "text-yellow-500" ? "bg-yellow-500" : "bg-emerald-500"}`}></div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400">Daily Drawdown</span>
                <span className={dailyDrawdown > 7 ? "text-red-400" : dailyDrawdown > 4 ? "text-yellow-400" : "text-emerald-400"}>
                  {dailyDrawdown}% / 10%
                </span>
              </div>
              <div className="w-full h-2 bg-charcoalPrimary rounded-full overflow-hidden">
                <div className={`h-full ${getRiskLevelColor(dailyDrawdown, 4, 7)}`} style={{ width: `${(dailyDrawdown/10)*100}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400">Capital Exposure</span>
                <span className={maxExposure > 30 ? "text-red-400" : maxExposure > 20 ? "text-yellow-400" : "text-emerald-400"}>
                  {maxExposure}% / 50%
                </span>
              </div>
              <div className="w-full h-2 bg-charcoalPrimary rounded-full overflow-hidden">
                <div className={`h-full ${getRiskLevelColor(maxExposure, 20, 30)}`} style={{ width: `${(maxExposure/50)*100}%` }}></div>
              </div>
            </div>
          </div>
        </section>

        <section className="premium-card p-5 rounded-xl">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan" />
            <span>Exposure Limits</span>
          </h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="max-exposure" className="text-sm">Maximum Capital Exposure</Label>
                <span className="text-sm font-medium text-cyan">{maxExposure}%</span>
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
            
            <div className="flex items-center justify-between p-3 bg-charcoalPrimary/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan" />
                <Label htmlFor="leverage-toggle" className="text-sm">Enable Leverage</Label>
              </div>
              <Switch id="leverage-toggle" className="data-[state=checked]:bg-cyan" />
            </div>
          </div>
        </section>

        <section className="premium-card p-5 rounded-xl">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-cyan" />
            <span>Drawdown Controls</span>
          </h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="daily-drawdown" className="text-sm">Daily Drawdown Limit</Label>
                <span className="text-sm font-medium text-cyan">{dailyDrawdown}%</span>
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
                <Label htmlFor="weekly-drawdown" className="text-sm">Weekly Drawdown Limit</Label>
                <span className="text-sm font-medium text-cyan">{weeklyDrawdown}%</span>
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
            
            <div className="flex items-center justify-between p-3 bg-charcoalPrimary/50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="auto-close" 
                    checked={autoClosePositions}
                    onCheckedChange={(checked) => setAutoClosePositions(checked as boolean)}
                    className="data-[state=checked]:bg-cyan border-gray-500"
                  />
                  <Label htmlFor="auto-close" className="text-sm">Auto-close positions on limit breach</Label>
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-4 h-4 text-gray-500 hover:text-cyan transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-charcoalSecondary border-cyan/20">
                    <p className="text-xs max-w-[200px]">Automatically closes all positions when drawdown limit is reached</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </section>

        <section className="premium-card p-5 rounded-xl">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <i className="fa-solid fa-shield-alt text-cyan mr-1"></i>
            <span>Stop-Loss / Take-Profit</span>
          </h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="stop-loss" className="text-sm">Default Stop-Loss</Label>
                <span className="text-sm font-medium text-cyan">{stopLossPercent}%</span>
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
                <Label htmlFor="take-profit" className="text-sm">Default Take-Profit</Label>
                <span className="text-sm font-medium text-cyan">{takeProfitPercent}%</span>
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
            
            <div className="flex items-center justify-between p-3 bg-charcoalPrimary/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="enforce-sl-tp" 
                  checked={enforceStopLoss}
                  onCheckedChange={(checked) => setEnforceStopLoss(checked as boolean)}
                  className="data-[state=checked]:bg-cyan border-gray-500"
                />
                <Label htmlFor="enforce-sl-tp" className="text-sm">Enforce on every trade</Label>
              </div>
            </div>
          </div>
        </section>

        <section className="premium-card p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-wind text-cyan"></i>
              <h2 className="text-lg font-semibold">Volatility Filters</h2>
            </div>
            <div className="relative">
              <div className="absolute -inset-1 bg-cyan/20 rounded-full blur-sm"></div>
              <Switch 
                checked={volatilityFilter}
                onCheckedChange={setVolatilityFilter}
                className="relative data-[state=checked]:bg-cyan"
              />
            </div>
          </div>
          
          <p className="text-sm text-gray-400 mt-2">
            Automatically adjust position sizes during high market volatility periods
          </p>
          
          {volatilityFilter && (
            <div className="mt-4 p-3 bg-charcoalPrimary/50 rounded-lg border border-cyan/20">
              <p className="text-xs text-white/80">
                When enabled, your position sizes will be automatically reduced during periods of high market volatility to protect your capital.
              </p>
            </div>
          )}
        </section>

        <section className="premium-card p-5 rounded-xl">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan" />
            <span>Alert Preferences</span>
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-charcoalPrimary/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="email-notify" 
                  checked={notifyEmail}
                  onCheckedChange={(checked) => setNotifyEmail(checked as boolean)}
                  className="data-[state=checked]:bg-cyan border-gray-500"
                />
                <Label htmlFor="email-notify" className="text-sm">Email Notifications</Label>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-charcoalPrimary/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="push-notify" 
                  checked={notifyPush}
                  onCheckedChange={(checked) => setNotifyPush(checked as boolean)}
                  className="data-[state=checked]:bg-cyan border-gray-500"
                />
                <Label htmlFor="push-notify" className="text-sm">Push Notifications</Label>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-charcoalPrimary/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sms-notify" 
                  checked={notifySMS}
                  onCheckedChange={(checked) => setNotifySMS(checked as boolean)}
                  className="data-[state=checked]:bg-cyan border-gray-500"
                />
                <Label htmlFor="sms-notify" className="text-sm">SMS Alerts</Label>
              </div>
            </div>
            
            <div className="p-3 mt-2 bg-charcoalPrimary/50 rounded-lg flex items-center justify-between cursor-pointer hover:bg-charcoalPrimary transition-colors">
              <p className="text-sm">Alert triggers</p>
              <ChevronRight className="w-4 h-4 text-cyan" />
            </div>
          </div>
        </section>

        <section className="bg-charcoalSecondary/30 rounded-xl p-4 border border-cyan/10">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-400">Risk Disclosure</h3>
              <p className="text-xs text-gray-400 mt-1">
                Trading involves substantial risk of loss. Past performance is not indicative of future results. 
                Risk management settings do not guarantee protection from losses.
              </p>
              <a href="#" className="text-xs text-cyan mt-2 inline-block hover:underline">
                View full risk disclosure
              </a>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-16 left-0 right-0 p-4 bg-charcoalSecondary/95 backdrop-blur-lg border-t border-cyan/20">
        <Button 
          className="w-full py-6 bg-gradient-to-r from-cyan to-cyan/80 text-charcoalPrimary rounded-lg font-medium shadow-lg hover:from-cyan/90 hover:to-cyan/70 transition-all duration-300"
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
