
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
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

  // Function to load brokers
  const loadBrokers = async () => {
    setLoading(true);
    try {
      const brokerData = await fetchBrokerDetails();
      setBrokers(brokerData);
    } catch (error) {
      console.error("Error loading brokers:", error);
      toast.error("Failed to load broker list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load brokers immediately when the component mounts
    loadBrokers();
  }, []);

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
            className="p-2"
            onClick={handleRefresh}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-5 h-5 text-charcoalTextSecondary" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M21 2v6h-6"></path>
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
              <path d="M3 22v-6h6"></path>
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
            </svg>
          </Button>
        </div>
      </header>

      <main className="pt-20 px-4 pb-24">
        <BrokerList 
          brokers={brokers} 
          onSelectBroker={handleSelectBroker}
          loading={loading}
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
