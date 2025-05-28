
import React, { useState, useEffect } from "react";
import Header from '@/components/Header';
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import PortfolioOverview from "@/components/dashboard/PortfolioOverview";
import QuickAccessSection from "@/components/dashboard/QuickAccessSection";
import OrdersView from "@/components/dashboard/OrdersView";
import { useAuth } from "@/contexts/AuthContext";
import { usePredefinedStrategies } from "@/hooks/strategy/usePredefinedStrategies";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BottomNav } from "@/components/BottomNav";

const Dashboard = () => {
  const [showBalance, setShowBalance] = useState(false);
  const [hasPremium, setHasPremium] = useState(false);
  const { user } = useAuth();
  const { data: strategies } = usePredefinedStrategies();
  const navigate = useNavigate();

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('plan_details')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_paid', true)
          .order('selected_at', { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (data && (data.plan_name === 'Premium' || data.plan_name === 'Pro' || data.plan_name === 'Elite')) {
          setHasPremium(true);
        }
      } catch (error) {
        console.error('Error checking premium status:', error);
      }
    };
    
    checkPremiumStatus();
  }, [user]);

  const handlePremiumClick = () => {
    navigate('/pricing');
  };

  return (
    <div className="min-h-screen bg-charcoalPrimary text-charcoalTextPrimary">
      <Header />
      <main className="container mx-auto px-4 py-8 pb-20">
        {/* Portfolio Overview */}
        <Card className="bg-gradient-to-br from-charcoalSecondary to-charcoalSecondary/80 border border-cyan/20 shadow-lg rounded-xl mb-8 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan to-cyan/80 bg-clip-text text-transparent">
                Portfolio Overview
              </h2>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                {showBalance ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            <PortfolioOverview showBalance={showBalance} />
          </CardContent>
        </Card>

        {/* Quick Access */}
        <QuickAccessSection />

        {/* Orders View */}
        <OrdersView />
      </main>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
