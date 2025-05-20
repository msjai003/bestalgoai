import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, PlayCircle, StopCircle, LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useStrategy } from "@/hooks/useStrategy";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Strategy } from "@/hooks/strategy/types";
import { useToast } from "@/hooks/use-toast";
import { checkStrategyAccess } from "@/lib/supabase/subscription";

interface PredefinedStrategy extends Strategy {
  package?: string;
  isPremium?: boolean;
  performance: {
    winRate: string;
    avgProfit: string;
    drawdown: string;
  };
}

const StrategyDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [strategy, setStrategy] = useState<PredefinedStrategy | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPremium, setHasPremium] = useState(false);
  const [hasStrategyAccess, setHasStrategyAccess] = useState(false);
  const { toggleWishlist } = useStrategy();

  const handleBack = () => {
    navigate(-1);
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add strategies to your wishlist",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (strategy) {
      try {
        await toggleWishlist(strategy.id, !isWishlisted);
        setIsWishlisted(!isWishlisted);
        toast({
          title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
          description: isWishlisted
            ? `${strategy.name} was removed from your wishlist`
            : `${strategy.name} was added to your wishlist`,
        });
      } catch (error) {
        console.error("Error toggling wishlist:", error);
        toast({
          title: "Error",
          description: "Failed to update wishlist",
          variant: "destructive",
        });
      }
    }
  };

  const handleEnableLiveTrading = () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    // Check if premium strategy and user doesn't have access
    if ((strategy?.isPremium || strategy?.package === 'premium') && !hasStrategyAccess) {
      console.log("Strategy requires premium access, redirecting to pricing", {
        strategyId: strategy?.id,
        strategyName: strategy?.name,
        isPremium: strategy?.isPremium,
        package: strategy?.package,
      });

      if (id) {
        sessionStorage.setItem("selectedStrategyId", id);
        sessionStorage.setItem("redirectAfterPayment", `/strategy-details/${id}`);
      }
      navigate("/pricing");
      return;
    }

    // Show broker selection dialog for strategies user has access to
    if (strategy) {
      navigate(`/broker-selection/${strategy.id}`);
    }
  };

  useEffect(() => {
    const loadStrategy = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        // Check if user has premium subscription
        if (user) {
          const { data: planData } = await supabase
            .from("plan_details")
            .select("*")
            .eq("user_id", user.id)
            .eq("is_paid", true)
            .order("selected_at", { ascending: false })
            .limit(1);

          const userHasPremium =
            planData &&
            planData.length > 0 &&
            (planData[0].plan_name === "Premium" ||
             planData[0].plan_name === "Pro" ||
             planData[0].plan_name === "Elite");

          setHasPremium(!!userHasPremium);
          console.log("User premium status:", userHasPremium);

          // Check if this strategy has been specifically purchased
          const strategyId = typeof id === 'string' ? parseInt(id, 10) : Number(id);
          const hasAccess = await checkStrategyAccess(user.id, strategyId);
          setHasStrategyAccess(hasAccess);
          console.log(`User has access to strategy ${id}: ${hasAccess}`);
        }

        // Fetch strategy details
        const { data, error } = await supabase
          .from("predefined_strategies")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        if (data) {
          // Process strategy data
          const strategyData: PredefinedStrategy = {
            id: data.id,
            name: data.name,
            description: data.description,
            isWishlisted: false,
            isLive: false,
            performance: data.performance || {
              winRate: "N/A",
              avgProfit: "N/A",
              drawdown: "N/A",
            },
            quantity: 1,
            package: data.package,
            isPremium: data.package === "premium", // Set isPremium based on package field
          };

          console.log("Strategy details loaded:", strategyData);
          setStrategy(strategyData);

          // Check if strategy is wishlisted
          if (user) {
            const { data: wishlistData, error: wishlistError } = await supabase
              .from("wishlist_maintain")
              .select("*")
              .eq("user_id", user.id)
              .eq("strategy_id", id);

            if (!wishlistError && wishlistData && wishlistData.length > 0) {
              setIsWishlisted(true);
            }
          }
        }
      } catch (error) {
        console.error("Error loading strategy details:", error);
        toast({
          title: "Error Loading Strategy",
          description: "Failed to load strategy details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadStrategy();
  }, [id, user, toast]);

  // Function to render leg information based on access level
  const renderLegs = () => {
    // Only show legs if user has access to this strategy
    if (!strategy) return <p>No data available</p>;
    
    // Check if strategy is premium and if user can access it
    const canViewLegs = !strategy.isPremium || hasPremium || hasStrategyAccess;
    
    if (!canViewLegs) {
      return (
        <div className="flex flex-col items-center justify-center py-10">
          <LockIcon size={48} className="text-yellow-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Premium Content Locked</h3>
          <p className="text-gray-300 text-center mb-4">
            Upgrade to premium to view the complete strategy details
          </p>
          <Button
            onClick={() => {
              if (id) {
                sessionStorage.setItem("selectedStrategyId", id);
                sessionStorage.setItem(
                  "redirectAfterPayment",
                  `/strategy-details/${id}`
                );
              }
              navigate("/pricing");
            }}
            className="bg-gradient-to-r from-cyan to-cyan/80 text-charcoalPrimary"
          >
            Upgrade Now
          </Button>
        </div>
      );
    }

    // If user has access, show the strategy legs
    return (
      <div className="space-y-4">
        <div className="bg-charcoalSecondary rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-medium text-white mb-2">Entry Conditions</h3>
          <ul className="list-disc pl-5 text-gray-300">
            <li>Price breaks above the 20-period moving average</li>
            <li>RSI indicator crosses above 50</li>
            <li>Volume increases by at least 20% compared to the previous period</li>
          </ul>
        </div>
        
        <div className="bg-charcoalSecondary rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-medium text-white mb-2">Exit Conditions</h3>
          <ul className="list-disc pl-5 text-gray-300">
            <li>Price breaks below the 20-period moving average</li>
            <li>RSI indicator crosses below 50</li>
            <li>Take profit at 3% gain</li>
            <li>Stop loss at 1.5% loss</li>
          </ul>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-charcoalPrimary flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-cyan border-solid mx-auto mb-4"></div>
          <p className="text-gray-300">Loading strategy details...</p>
        </div>
      </div>
    );
  }

  if (!strategy) {
    return (
      <div className="min-h-screen bg-charcoalPrimary flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300">Strategy not found</p>
          <Button variant="outline" onClick={handleBack} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoalPrimary">
      <Header />
      
      <div className="pt-16 pb-20 px-4">
        <div className="mb-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="text-gray-400"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-semibold text-white ml-2">Strategy Details</h1>
        </div>
        
        <div className="bg-gradient-to-br from-charcoalSecondary to-charcoalPrimary rounded-xl border border-gray-700/50 p-5 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan/10 to-transparent rounded-full -mr-20 -mt-20 blur-3xl"></div>
          
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-2xl font-bold text-white">{strategy.name}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleWishlist}
              className={`${isWishlisted ? "text-red-400" : "text-gray-400"}`}
            >
              <Heart
                size={22}
                className={isWishlisted ? "fill-red-400" : ""}
              />
            </Button>
          </div>
          
          {(strategy.isPremium || strategy.package === 'premium') && !hasStrategyAccess && !hasPremium ? (
            <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 mb-3">
              Premium Strategy
            </Badge>
          ) : (
            <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 mb-3">
              {hasStrategyAccess ? "Purchased" : hasPremium ? "Premium Access" : "Available"}
            </Badge>
          )}
          
          <p className="text-gray-300 mb-4">{strategy.description}</p>
          
          <div className="grid grid-cols-3 gap-2 mb-4">
            <Card className="bg-charcoalPrimary/50 border-gray-700/30">
              <CardContent className="p-3">
                <p className="text-xs text-gray-400">Win Rate</p>
                <p className="text-cyan text-lg font-medium">
                  {strategy.performance?.winRate || "N/A"}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-charcoalPrimary/50 border-gray-700/30">
              <CardContent className="p-3">
                <p className="text-xs text-gray-400">Avg. Profit</p>
                <p className="text-emerald-400 text-lg font-medium">
                  {strategy.performance?.avgProfit || "N/A"}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-charcoalPrimary/50 border-gray-700/30">
              <CardContent className="p-3">
                <p className="text-xs text-gray-400">Drawdown</p>
                <p className="text-red-400 text-lg font-medium">
                  {strategy.performance?.drawdown || "N/A"}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Button
            onClick={handleEnableLiveTrading}
            className={`w-full ${
              (strategy.isPremium || strategy.package === 'premium') && !hasStrategyAccess && !hasPremium
                ? "bg-yellow-500 hover:bg-yellow-600 text-charcoalPrimary"
                : "bg-gradient-to-r from-cyan to-cyan/80 hover:from-cyan hover:to-blue-400 text-charcoalPrimary"
            }`}
          >
            {(strategy.isPremium || strategy.package === 'premium') && !hasStrategyAccess && !hasPremium ? (
              <>
                <LockIcon size={18} className="mr-2" />
                Unlock Premium Strategy
              </>
            ) : (
              <>
                <PlayCircle size={18} className="mr-2" />
                Enable Live Trading
              </>
            )}
          </Button>
        </div>
        
        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-6"
        >
          <TabsList className="bg-charcoalSecondary border border-gray-700 mb-4 w-full">
            <TabsTrigger
              value="overview"
              className="flex-1 data-[state=active]:text-cyan"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="legs"
              className="flex-1 data-[state=active]:text-cyan"
            >
              Strategy Legs
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="flex-1 data-[state=active]:text-cyan"
            >
              Performance
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="bg-charcoalSecondary rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-medium text-white mb-2">Strategy Overview</h3>
              <p className="text-gray-300">
                {strategy.description}
              </p>
              <p className="text-gray-300 mt-2">
                This strategy is designed to capture market momentum by combining price action analysis with 
                technical indicators for optimal entry and exit points.
              </p>
            </div>
            
            <div className="bg-charcoalSecondary rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-medium text-white mb-2">Key Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Historical Win Rate</p>
                  <p className="text-white font-medium">68%</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Avg. Holding Period</p>
                  <p className="text-white font-medium">4.2 days</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Risk/Reward Ratio</p>
                  <p className="text-white font-medium">1:2.5</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Annual Return</p>
                  <p className="text-white font-medium">24%</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="legs" className="space-y-4">
            {renderLegs()}
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-4">
            <div className="bg-charcoalSecondary rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-medium text-white mb-2">Performance History</h3>
              {/* Performance data would go here - placeholder for now */}
              <div className="h-40 w-full bg-gray-700/30 rounded flex items-center justify-center">
                <p className="text-gray-400">Performance chart placeholder</p>
              </div>
            </div>
            
            <div className="bg-charcoalSecondary rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-medium text-white mb-2">Monthly Returns</h3>
              <div className="grid grid-cols-4 gap-2">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => (
                  <div key={month} className="bg-gray-700/30 rounded p-2">
                    <p className="text-xs text-gray-400">{month}</p>
                    <p className={`text-sm ${Math.random() > 0.3 ? "text-green-400" : "text-red-400"}`}>
                      {(Math.random() * 10 - 3).toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default StrategyDetails;
