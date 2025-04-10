
import { useState } from "react";
import { Link } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BellRing, Settings } from "lucide-react";

type AlertType = "all" | "trade" | "system";
type Notification = {
  id: number;
  type: "success" | "info" | "warning";
  icon: string;
  title: string;
  message: string;
  time: string;
  iconBgColor: string;
  iconColor: string;
};

const notifications: Notification[] = [
  {
    id: 1,
    type: "success",
    icon: "fa-chart-line",
    title: "Trade Executed Successfully",
    message: "Buy order for RELIANCE at ₹2,450 executed successfully",
    time: "2 minutes ago",
    iconBgColor: "bg-green-500/10",
    iconColor: "text-green-500",
  },
  {
    id: 2,
    type: "info",
    icon: "fa-robot",
    title: "AI Strategy Update",
    message: "Your momentum strategy has been optimized based on market conditions",
    time: "15 minutes ago",
    iconBgColor: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  {
    id: 3,
    type: "warning",
    icon: "fa-bell",
    title: "Price Alert",
    message: "HDFC Bank reached your target price of ₹1,680",
    time: "1 hour ago",
    iconBgColor: "bg-yellow-500/10",
    iconColor: "text-yellow-500",
  },
];

const Alerts = () => {
  const [activeTab, setActiveTab] = useState<AlertType>("all");

  return (
    <div className="bg-charcoalPrimary min-h-screen">
      <header className="fixed top-0 left-0 right-0 bg-charcoalPrimary/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="text-gray-300" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-white">Alerts & Notifications</h1>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="text-gray-300" />
          </Button>
        </div>
      </header>

      <div className="fixed top-16 left-0 right-0 bg-charcoalPrimary/95 backdrop-blur-lg border-b border-gray-800 z-40">
        <div className="flex space-x-2 p-2">
          <Button
            onClick={() => setActiveTab("all")}
            className={cn(
              "flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors",
              activeTab === "all"
                ? "bg-gradient-to-r from-cyan/20 to-cyan/10 border border-cyan/30 text-cyan"
                : "bg-gray-800/50 text-gray-400"
            )}
          >
            All
          </Button>
          <Button
            onClick={() => setActiveTab("trade")}
            className={cn(
              "flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors",
              activeTab === "trade"
                ? "bg-gradient-to-r from-cyan/20 to-cyan/10 border border-cyan/30 text-cyan"
                : "bg-gray-800/50 text-gray-400"
            )}
          >
            Trade Alerts
          </Button>
          <Button
            onClick={() => setActiveTab("system")}
            className={cn(
              "flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors",
              activeTab === "system"
                ? "bg-gradient-to-r from-cyan/20 to-cyan/10 border border-cyan/30 text-cyan"
                : "bg-gray-800/50 text-gray-400"
            )}
          >
            System
          </Button>
        </div>
      </div>

      <main className="pt-32 pb-20 px-4 space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="p-4 rounded-xl bg-charcoalSecondary/50 border border-gray-700 shadow-lg"
          >
            <div className="flex items-start gap-3">
              <div className={cn("p-2 rounded-lg", notification.iconBgColor, notification.iconColor)}>
                <BellRing className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium">{notification.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                <span className="text-xs text-gray-500 mt-2 block">{notification.time}</span>
              </div>
            </div>
          </div>
        ))}
      </main>
      <BottomNav />
    </div>
  );
};

export default Alerts;
