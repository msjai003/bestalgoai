
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, HelpCircle } from "lucide-react";
import { BrokerList } from "@/components/broker-integration/BrokerList";
import { brokers } from "@/components/broker-integration/BrokerData";

const BrokerIntegration = () => {
  const navigate = useNavigate();
  const [selectedBrokerId, setSelectedBrokerId] = useState<number | null>(null);

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
          <Button variant="ghost" className="p-2">
            <HelpCircle className="w-5 h-5 text-charcoalTextSecondary" />
          </Button>
        </div>
      </header>

      <main className="pt-20 px-4 pb-24">
        <BrokerList brokers={brokers} onSelectBroker={handleSelectBroker} />
      </main>

      <section className="fixed bottom-0 left-0 right-0 p-4 bg-charcoalPrimary/95 backdrop-blur-lg border-t border-charcoalSecondary">
        <div className="flex flex-col gap-3">
          <Button
            className="w-full h-12 bg-gradient-to-r from-cyan to-cyan/80 text-charcoalPrimary rounded-xl font-semibold"
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
