
import { Search, ChevronRight, Check, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Broker } from "@/types/broker";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton"; 
import { getBrokerImageUrl } from "@/utils/brokerImageUtils";

interface BrokerListProps {
  brokers: Broker[];
  onSelectBroker: (brokerId: number) => void;
  loading?: boolean;
}

export const BrokerList = ({ brokers, onSelectBroker, loading = false }: BrokerListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBrokers = brokers.filter((broker) =>
    broker.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <section className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Connect Your Broker</h1>
        <div className="relative">
          <Skeleton className="w-full h-12 rounded-xl" />
        </div>
        <div className="mt-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-full h-24 rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

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
        {filteredBrokers.length > 0 ? (
          filteredBrokers.map((broker) => (
            <BrokerCard 
              key={`${broker.id}-card`} 
              broker={broker} 
              onSelect={onSelectBroker} 
            />
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

const BrokerCard = ({ broker, onSelect }: { broker: Broker, onSelect: (id: number) => void }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(broker.logo);
  const [imageError, setImageError] = useState(false);
  
  useEffect(() => {
    const fetchBrokerImage = async () => {
      try {
        const img = await getBrokerImageUrl(broker.id);
        if (img) {
          console.log(`Updated image URL for broker ${broker.id} from database:`, img);
          setImageUrl(img);
          setImageError(false);
        }
      } catch (error) {
        console.error("Error fetching broker image:", error);
        setImageError(true);
      }
    };
    
    fetchBrokerImage();
    
    // Refresh images every 30 seconds (optional)
    const intervalId = setInterval(fetchBrokerImage, 30000);
    
    return () => clearInterval(intervalId);
  }, [broker.id]);
  
  const handleImageError = () => {
    console.log(`Image loading error for broker ${broker.id}, falling back to placeholder`);
    setImageError(true);
  };
  
  const hasRequiredInputs = broker.requiredInputs && broker.requiredInputs.length > 0;

  return (
    <div
      className="flex items-center p-4 bg-gray-800/30 rounded-xl border border-gray-700 cursor-pointer hover:border-pink-500 transition-colors"
      onClick={() => onSelect(broker.id)}
    >
      {imageUrl && !imageError ? (
        <img
          src={imageUrl}
          className="w-10 h-10 rounded-lg object-cover bg-gray-700"
          alt={broker.name}
          onError={handleImageError}
        />
      ) : (
        <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center text-gray-500">
          {broker.name.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="ml-3 flex-1">
        <h3 className="font-semibold">{broker.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          {hasRequiredInputs ? (
            <>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Check className="w-3 h-3 text-green-500" />
                <span>Authentication ready</span>
              </div>
              
              {broker.apiRequired && (
                <Badge variant="outline" className="text-xs bg-amber-900/30 text-amber-400 border-amber-800">
                  API Required
                </Badge>
              )}
            </>
          ) : (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <AlertCircle className="w-3 h-3 text-gray-500" />
              <span>No authentication configuration</span>
            </div>
          )}
        </div>
      </div>
      <ChevronRight className="ml-auto w-5 h-5 text-gray-500" />
    </div>
  );
};

export default BrokerList;
