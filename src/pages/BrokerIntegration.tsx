
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, HelpCircle, RefreshCw } from "lucide-react";
import { BrokerList } from "@/components/broker-integration/BrokerList";
import { brokers } from "@/components/broker-integration/BrokerData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const BrokerIntegration = () => {
  const navigate = useNavigate();
  const [selectedBrokerId, setSelectedBrokerId] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check for broker functions and initialize if needed
  useEffect(() => {
    checkBrokerFunctions();
  }, []);

  const checkBrokerFunctions = async () => {
    setIsRefreshing(true);
    try {
      // Check if 5 Paisa and Bigil have any functions
      const { data, error } = await supabase
        .from('brokers_functions')
        .select('broker_id')
        .in('broker_id', [7, 8]);
      
      if (error) {
        console.error('Error checking broker functions:', error);
        toast.error("Failed to check broker functions");
        return;
      }

      // If no functions found for these brokers, add default ones
      if (!data || data.length === 0) {
        // Define default functions for brokers
        const defaultFunctions = [
          { slug: 'order_placement', name: 'Order Placement', description: 'Place new orders with the broker' },
          { slug: 'order_modification', name: 'Order Modification', description: 'Modify existing orders' },
          { slug: 'order_cancellation', name: 'Order Cancellation', description: 'Cancel pending orders' },
          { slug: 'portfolio_view', name: 'Portfolio View', description: 'View current holdings and positions' },
          { slug: 'market_data', name: 'Market Data', description: 'Access real-time market data' },
          { slug: 'trade_history', name: 'Trade History', description: 'View past trades and executions' }
        ];
        
        const newBrokers = [
          { id: 7, name: "5 Paisa" },
          { id: 8, name: "Bigil" }
        ];
        
        for (const broker of newBrokers) {
          // Add default functions for this broker
          const functionsToAdd = defaultFunctions.map(func => ({
            broker_id: broker.id,
            broker_name: broker.name,
            function_name: func.name,
            function_description: func.description,
            function_slug: func.slug,
            function_enabled: true,
            is_premium: func.slug === 'market_data', // Make market data premium as an example
            broker_image: `https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-${broker.id}.jpg`
          }));
          
          const { error: insertError } = await supabase
            .from('brokers_functions')
            .insert(functionsToAdd);
            
          if (insertError) {
            console.error(`Error adding functions for ${broker.name}:`, insertError);
            toast.error(`Failed to add functions for ${broker.name}`);
          } else {
            console.log(`Added default functions for ${broker.name}`);
            toast.success(`Added default functions for ${broker.name}`);
          }
        }
      } else {
        console.log('Broker functions already exist:', data.length);
      }
    } catch (err) {
      console.error('Error initializing broker functions:', err);
      toast.error("Failed to initialize broker functions");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSelectBroker = (brokerId: number) => {
    setSelectedBrokerId(brokerId);
    // Navigate to the credentials page with the selected broker ID
    navigate("/broker-credentials", { state: { brokerId } });
  };

  return (
    <div className="min-h-screen bg-charcoalPrimary text-charcoalTextPrimary">
      <header className="fixed top-0 left-0 right-0 bg-charcoalPrimary/95 backdrop-blur-lg border-b border-charcoalSecondary z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Button 
            variant="ghost" 
            className="p-2"
            onClick={() => navigate('/settings')}
          >
            <ChevronLeft className="w-5 h-5 text-charcoalTextSecondary" />
          </Button>
          <h1 className="text-lg font-semibold">Select Your Broker</h1>
          <Button 
            variant="ghost" 
            className="p-2"
            onClick={() => checkBrokerFunctions()}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-5 h-5 text-charcoalTextSecondary ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </header>

      <main className="pt-20 px-4 pb-24">
        <BrokerList 
          brokers={brokers} 
          onSelectBroker={handleSelectBroker} 
          key={isRefreshing ? 'refreshing' : 'loaded'} // Force re-render on refresh
        />
      </main>

      <section className="fixed bottom-0 left-0 right-0 p-4 bg-charcoalPrimary/95 backdrop-blur-lg border-t border-charcoalSecondary">
        <div className="flex flex-col gap-3">
          <Button
            className="w-full h-12 bg-gradient-to-r from-cyan to-cyan/80 text-charcoalPrimary rounded-xl font-semibold"
            onClick={() => selectedBrokerId && handleSelectBroker(selectedBrokerId)}
            disabled={!selectedBrokerId}
          >
            Continue
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 border border-charcoalSecondary bg-transparent text-charcoalTextPrimary rounded-xl font-semibold"
            onClick={() => navigate("/settings")}
          >
            Cancel
          </Button>
        </div>
      </section>
    </div>
  );
};

export default BrokerIntegration;
