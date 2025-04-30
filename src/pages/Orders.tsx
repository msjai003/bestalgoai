
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import OrdersView from "@/components/dashboard/OrdersView";
import { Loader } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Orders = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          console.log('No active session found on orders page, redirecting to auth');
          toast({
            title: "Authentication Required",
            description: "Please log in to access your orders.",
            variant: "destructive",
          });
          navigate('/auth');
        } else {
          setIsVerifyingAuth(false);
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
        setIsVerifyingAuth(false);
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  if (isVerifyingAuth || user === null) {
    return (
      <div className="min-h-screen bg-charcoalPrimary flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-cyan mx-auto mb-4" />
          <p className="text-gray-300">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-charcoalPrimary min-h-screen">
      <Header />
      <main className="pt-16 pb-20 px-4">
        <h1 className="text-2xl font-bold text-white mb-6">Your Orders</h1>
        <OrdersView useRealData={true} />
      </main>
      <BottomNav />
    </div>
  );
};

export default Orders;
