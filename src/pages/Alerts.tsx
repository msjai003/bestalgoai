
import { useState } from "react";
import { Link } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell, FileText, Clock, Filter, Calendar } from "lucide-react";

type AlertType = "all" | "trade" | "system" | "summary";
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

const summaries = [
  {
    id: 1,
    date: "April 13, 2025",
    totalTrades: 12,
    successfulTrades: 9,
    profitLoss: "+₹15,280",
  },
  {
    id: 2,
    date: "April 12, 2025",
    totalTrades: 8,
    successfulTrades: 5,
    profitLoss: "+₹8,350",
  },
  {
    id: 3,
    date: "April 11, 2025",
    totalTrades: 10,
    successfulTrades: 6,
    profitLoss: "-₹2,470",
  },
];

const Alerts = () => {
  const [activeTab, setActiveTab] = useState<AlertType>("all");
  const [showFilters, setShowFilters] = useState(false);

  const handleExportSummary = (id: number) => {
    // Mock function - would implement actual export functionality
    console.log(`Exporting summary ${id}`);
  };

  const handleEmailSummary = (id: number) => {
    // Mock function - would implement actual email sending
    console.log(`Emailing summary ${id}`);
  };

  return (
    <div className="bg-charcoalPrimary min-h-screen">
      <header className="fixed top-0 left-0 right-0 bg-charcoalPrimary/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Link to="/dashboard" className="p-2">
            <i className="fa-solid fa-arrow-left text-gray-300"></i>
          </Link>
          <h1 className="text-lg font-semibold text-white">Alerts & Trading Logs</h1>
          <div className="flex items-center gap-2">
            <button className="p-2" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-5 w-5 text-gray-300" />
            </button>
            <button className="p-2">
              <Calendar className="h-5 w-5 text-gray-300" />
            </button>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-20 px-4">
        {showFilters && (
          <div className="mb-4 p-4 bg-charcoalSecondary rounded-lg border border-gray-700/50">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-white">Filter Alerts</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 p-0 px-2 text-gray-400"
                onClick={() => setShowFilters(false)}
              >
                <i className="fa-solid fa-times"></i>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start text-sm text-left"
              >
                <i className="fa-solid fa-calendar-days mr-2 text-cyan"></i>
                Date Range
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start text-sm text-left"
              >
                <i className="fa-solid fa-filter mr-2 text-cyan"></i>
                Alert Type
              </Button>
            </div>
          </div>
        )}
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-charcoalSecondary/50 mb-6">
            <TabsTrigger 
              value="all" 
              onClick={() => setActiveTab("all")}
              className="flex gap-2 items-center data-[state=active]:bg-cyan data-[state=active]:text-charcoalPrimary py-2"
            >
              <Bell className="h-4 w-4" />
              <span>All</span>
            </TabsTrigger>
            <TabsTrigger 
              value="trade"
              onClick={() => setActiveTab("trade")}
              className="flex gap-2 items-center data-[state=active]:bg-cyan data-[state=active]:text-charcoalPrimary py-2"
            >
              <FileText className="h-4 w-4" />
              <span>Trades</span>
            </TabsTrigger>
            <TabsTrigger 
              value="summary"
              onClick={() => setActiveTab("summary")}
              className="flex gap-2 items-center data-[state=active]:bg-cyan data-[state=active]:text-charcoalPrimary py-2"
            >
              <Clock className="h-4 w-4" />
              <span>Summary</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {notifications.map((notification, index) => (
              <div
                key={notification.id}
                className="p-4 rounded-xl bg-charcoalSecondary border border-gray-700/50 shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className={cn("p-3 rounded-lg", notification.iconBgColor, notification.iconColor)}>
                    <i className={`fa-solid ${notification.icon}`}></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{notification.title}</h3>
                    <p className="text-sm text-gray-400 mt-2">{notification.message}</p>
                    <span className="text-xs text-gray-500 mt-3 block">{notification.time}</span>
                  </div>
                </div>
                {index < notifications.length - 1 && (
                  <div className="border-t border-gray-700/30 mt-4 pt-1"></div>
                )}
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="trade" className="space-y-4">
            {notifications
              .filter(n => n.title.includes("Trade") || n.message.includes("order"))
              .map((notification, index, filteredArray) => (
                <div
                  key={notification.id}
                  className="p-4 rounded-xl bg-charcoalSecondary border border-gray-700/50 shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className={cn("p-3 rounded-lg", notification.iconBgColor, notification.iconColor)}>
                      <i className={`fa-solid ${notification.icon}`}></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{notification.title}</h3>
                      <p className="text-sm text-gray-400 mt-2">{notification.message}</p>
                      <span className="text-xs text-gray-500 mt-3 block">{notification.time}</span>
                    </div>
                  </div>
                  {index < filteredArray.length - 1 && (
                    <div className="border-t border-gray-700/30 mt-4 pt-1"></div>
                  )}
                </div>
            ))}
          </TabsContent>
          
          <TabsContent value="summary" className="space-y-4">
            {summaries.map((summary) => (
              <div
                key={summary.id}
                className="p-5 rounded-xl bg-charcoalSecondary border border-gray-700/50 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium">{summary.date}</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-400"
                      onClick={() => handleEmailSummary(summary.id)}
                    >
                      <i className="fa-solid fa-envelope"></i>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-400"
                      onClick={() => handleExportSummary(summary.id)}
                    >
                      <i className="fa-solid fa-download"></i>
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-charcoalPrimary/60 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-2">Total Trades</p>
                    <p className="text-lg font-semibold text-white">{summary.totalTrades}</p>
                  </div>
                  <div className="bg-charcoalPrimary/60 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-2">Success Rate</p>
                    <p className="text-lg font-semibold text-green-400">
                      {Math.round((summary.successfulTrades / summary.totalTrades) * 100)}%
                    </p>
                  </div>
                  <div className="bg-charcoalPrimary/60 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-2">P&L</p>
                    <p className={`text-lg font-semibold ${summary.profitLoss.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {summary.profitLoss}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </main>
      <BottomNav />
    </div>
  );
};

export default Alerts;
