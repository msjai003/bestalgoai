
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

  useEffect(() => {
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

    loadBrokers();
  }, []);

  const handleSelectBroker = (brokerId: number) => {
    setSelectedBrokerId(brokerId);
  };

  const handleContinue = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (selectedBrokerId) {
      // Navigate to the credentials page with the selected broker ID
      navigate("/broker-credentials", { state: { brokerId: selectedBrokerId } });
    } else {
      toast.error("Please select a broker to continue");
    }
  };

  return (
    <div className="min-h-screen bg-charcoalPrimary text-charcoalTextPrimary">
      <header className="fixed top-0 left-0 right-0 bg-charcoalPrimary/95 backdrop-blur-lg border-b border-charcoalSecondary z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Button 
            variant="ghost" 
            className="p-2"
            onClick={() => navigate('/settings')}
            type="button"
          >
            <ChevronLeft className="w-5 h-5 text-charcoalTextSecondary" />
          </Button>
          <h1 className="text-lg font-semibold">Select Your Broker</h1>
          <div className="w-10"></div> {/* Spacer for balance */}
        </div>
      </header>

      <main className="pt-20 px-4 pb-24">
        <BrokerList 
          brokers={brokers} 
          onSelectBroker={handleSelectBroker}
          selectedBrokerId={selectedBrokerId}
          loading={loading}
        />
      </main>

      <section className="fixed bottom-0 left-0 right-0 p-4 bg-charcoalPrimary/95 backdrop-blur-lg border-t border-charcoalSecondary">
        <div className="flex flex-col gap-3">
          <Button
            className="w-full h-12 bg-gradient-to-r from-cyan to-cyan/80 text-charcoalPrimary rounded-xl font-semibold"
            onClick={handleContinue}
            disabled={!selectedBrokerId}
            type="button"
          >
            Continue
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 border border-charcoalSecondary bg-transparent text-charcoalTextPrimary rounded-xl font-semibold"
            onClick={() => navigate("/settings")}
            type="button"
          >
            Cancel
          </Button>
        </div>
      </section>
    </div>
  );
};

export default BrokerIntegration;
