
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, HelpCircle, Search, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const BrokerIntegration = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const brokers = [
    {
      id: 1,
      name: "Zerodha",
      description: "Most popular in India",
      logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg",
    },
    {
      id: 2,
      name: "Angel One",
      description: "Recommended",
      logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
    },
    {
      id: 3,
      name: "ICICI Direct",
      description: "Bank-backed broker",
      logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg",
    },
    {
      id: 4,
      name: "Upstox",
      description: "Low brokerage fees",
      logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg",
    }
  ];

  const filteredBrokers = brokers.filter(broker => 
    broker.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectBroker = (brokerId: number) => {
    // In a real implementation, this would navigate to a broker-specific configuration page
    toast.info(`Selected broker ID: ${brokerId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Button 
            variant="ghost" 
            className="p-2"
            onClick={() => navigate('/settings')}
          >
            <ChevronLeft className="w-5 h-5 text-gray-300" />
          </Button>
          <h1 className="text-lg font-semibold">Connect Your Broker</h1>
          <Button variant="ghost" className="p-2">
            <HelpCircle className="w-5 h-5 text-gray-300" />
          </Button>
        </div>
      </header>

      <main className="pt-20 px-4 pb-24">
        <section className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Connect Your Broker</h1>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search brokers" 
              className="w-full h-12 bg-gray-800/50 rounded-xl pl-10 pr-4 border border-gray-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-gray-100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
          </div>
          
          <div className="mt-4 space-y-3">
            {filteredBrokers.length > 0 ? (
              filteredBrokers.map(broker => (
                <div 
                  key={broker.id}
                  className="flex items-center p-4 bg-gray-800/30 rounded-xl border border-gray-700 cursor-pointer hover:border-pink-500 transition-colors"
                  onClick={() => handleSelectBroker(broker.id)}
                >
                  <img 
                    src={broker.logo} 
                    className="w-10 h-10 rounded-lg" 
                    alt={broker.name} 
                  />
                  <div className="ml-3">
                    <h3 className="font-semibold">{broker.name}</h3>
                    <p className="text-sm text-gray-400">{broker.description}</p>
                  </div>
                  <ChevronRight className="ml-auto w-5 h-5 text-gray-500" />
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No brokers found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </section>
        
        <section className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
          <div className="flex flex-col gap-3">
            <Button 
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl font-semibold"
              onClick={() => {
                toast.info("Broker connection in progress");
                // In a real implementation, this would handle authentication
              }}
            >
              Continue
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-12 border border-gray-700 bg-transparent text-white rounded-xl font-semibold"
              onClick={() => navigate('/settings')}
            >
              Cancel
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BrokerIntegration;
