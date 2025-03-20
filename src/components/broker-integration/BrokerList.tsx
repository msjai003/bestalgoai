
import { Search, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Broker } from "@/types/broker";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getBrokerLogo } from "@/utils/brokerImageUtils";

interface BrokerListProps {
  brokers: Broker[];
  onSelectBroker: (brokerId: number) => void;
}

export const BrokerList = ({ brokers, onSelectBroker }: BrokerListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [brokerImages, setBrokerImages] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Fetch broker images from Supabase
    const fetchBrokerImages = async () => {
      try {
        setIsLoading(true);
        // Create a mapping of broker_id to image_url
        const imageMap: Record<number, string> = {};
        
        // Fetch images for each broker in parallel
        const promises = brokers.map(async (broker) => {
          const logoUrl = await getBrokerLogo(broker.id);
          if (logoUrl) {
            imageMap[broker.id] = logoUrl;
          }
        });
        
        await Promise.all(promises);
        setBrokerImages(imageMap);
      } catch (error) {
        console.error('Exception fetching broker images:', error);
        toast.error('Failed to load broker images');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBrokerImages();
  }, [brokers]);

  const filteredBrokers = brokers.filter((broker) =>
    broker.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get the broker image from Supabase or fall back to the default one
  const getBrokerImage = (broker: Broker) => {
    return brokerImages[broker.id] || broker.logo;
  };

  return (
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
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-pulse h-10 w-10 rounded-full bg-gray-700"></div>
          </div>
        ) : filteredBrokers.length > 0 ? (
          filteredBrokers.map((broker) => (
            <div
              key={broker.id}
              className="flex items-center p-4 bg-gray-800/30 rounded-xl border border-gray-700 cursor-pointer hover:border-pink-500 transition-colors"
              onClick={() => onSelectBroker(broker.id)}
            >
              <img
                src={getBrokerImage(broker)}
                className="w-10 h-10 rounded-lg object-contain bg-white p-1"
                alt={broker.name}
                onError={(e) => {
                  // Fallback to default logo if image fails to load
                  (e.target as HTMLImageElement).src = broker.logo;
                }}
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
  );
};
