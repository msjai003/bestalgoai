
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, RefreshCw } from "lucide-react";
import { BrokerList } from "@/components/broker-integration/BrokerList";
import { brokers as staticBrokers } from "@/components/broker-integration/BrokerData";
import { toast } from "sonner";
import { fetchBrokerDetails } from "@/services/brokerService";
import { Broker } from "@/types/broker";

const BrokerIntegration = () => {
  const navigate = useNavigate();
  const [selectedBrokerId, setSelectedBrokerId] = useState<number | null>(null);
  const [brokers, setBrokers] = useState<Broker[]>(staticBrokers);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Function to load brokers with improved error handling
  const loadBrokers = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Fetching fresh broker data from database...");
      const brokerData = await fetchBrokerDetails();
      console.log(`Loaded ${brokerData.length} brokers from database`);
      setBrokers(brokerData);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error("Error loading brokers:", error);
      toast.error("Failed to load broker list");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load brokers immediately when the component mounts
    loadBrokers();
    
    // Set up an interval to refresh data every 30 seconds
    const refreshInterval = setInterval(() => {
      loadBrokers();
    }, 30000);
    
    // Clean up the interval on component unmount
    return () => clearInterval(refreshInterval);
  }, [loadBrokers]);

  const handleSelectBroker = (brokerId: number) => {
    setSelectedBrokerId(brokerId);
    // Navigate to the credentials page with the selected broker ID
    navigate("/broker-credentials", { state: { brokerId } });
  };

  // Function to manually refresh broker list
  const handleRefresh = () => {
    loadBrokers();
    toast.success("Broker list refreshed");
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
            className="p-2 relative group"
            onClick={handleRefresh}
          >
            <RefreshCw 
              className={`w-5 h-5 text-charcoalTextSecondary ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-300'}`} 
            />
          </Button>
        </div>
      </header>

      <main className="pt-20 px-4 pb-24">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-charcoalTextSecondary">
            Last updated: {lastRefreshed.toLocaleTimeString()}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        <BrokerList 
          brokers={brokers} 
          onSelectBroker={handleSelectBroker}
          loading={loading}
          onRefresh={handleRefresh}
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
