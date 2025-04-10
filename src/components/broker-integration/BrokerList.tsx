
import { Search, ChevronRight, Check, AlertCircle, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Broker } from "@/types/broker";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton"; 
import { Button } from "@/components/ui/button";

interface BrokerListProps {
  brokers: Broker[];
  onSelectBroker: (brokerId: number) => void;
  loading?: boolean;
  onRefresh?: () => void;
}

export const BrokerList = ({ brokers, onSelectBroker, loading = false, onRefresh }: BrokerListProps) => {
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
        <div className="flex justify-center mt-6">
          <RefreshCw className="animate-spin h-8 w-8 text-gray-400" />
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
          <div className="text-center py-8 flex flex-col items-center">
            <p className="text-gray-400 mb-4">No brokers found matching "{searchQuery}"</p>
            {onRefresh && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRefresh} 
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Broker List
              </Button>
            )}
          </div>
        )}
      </div>
      
      {filteredBrokers.length > 0 && onRefresh && (
        <div className="flex justify-center mt-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh} 
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Broker List
          </Button>
        </div>
      )}
    </section>
  );
};

const BrokerCard = ({ broker, onSelect }: { broker: Broker, onSelect: (id: number) => void }) => {
  // Get broker image from broker.logo
  const brokerImage = broker.logo;
  
  // Use broker name
  const displayName = broker.name;
  
  // Check if broker has required inputs
  const hasRequiredInputs = broker.requiredInputs && broker.requiredInputs.length > 0;

  return (
    <div
      className="flex items-center p-4 bg-gray-800/30 rounded-xl border border-gray-700 cursor-pointer hover:border-pink-500 transition-colors"
      onClick={() => onSelect(broker.id)}
    >
      <img
        src={brokerImage}
        className="w-10 h-10 rounded-lg object-cover"
        alt={displayName}
        onError={(e) => {
          // Fallback to placeholder if image fails to load
          (e.target as HTMLImageElement).src = "/placeholder.svg";
        }}
      />
      <div className="ml-3 flex-1">
        <h3 className="font-semibold">{displayName}</h3>
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
