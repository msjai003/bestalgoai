
import { Search, ChevronRight, Check, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Broker } from "@/types/broker";
import { useBrokerFunctions } from "@/hooks/useBrokerFunctions";
import { Badge } from "@/components/ui/badge";

interface BrokerListProps {
  brokers: Broker[];
  onSelectBroker: (brokerId: number) => void;
}

export const BrokerList = ({ brokers, onSelectBroker }: BrokerListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBrokers = brokers.filter((broker) =>
    broker.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              key={broker.id} 
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
  const { functions, isLoading } = useBrokerFunctions(broker.id);
  
  const enabledFunctions = functions.filter(func => func.function_enabled);
  const premiumFunctions = functions.filter(func => func.is_premium && func.function_enabled);
  
  return (
    <div
      className="flex items-center p-4 bg-gray-800/30 rounded-xl border border-gray-700 cursor-pointer hover:border-pink-500 transition-colors"
      onClick={() => onSelect(broker.id)}
    >
      <img
        src={broker.logo}
        className="w-10 h-10 rounded-lg"
        alt={broker.name}
      />
      <div className="ml-3 flex-1">
        <h3 className="font-semibold">{broker.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          {isLoading ? (
            <div className="text-xs text-gray-400">Loading features...</div>
          ) : functions.length > 0 ? (
            <>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Check className="w-3 h-3 text-green-500" />
                <span>{enabledFunctions.length} functions available</span>
              </div>
              
              {premiumFunctions.length > 0 && (
                <Badge variant="outline" className="text-xs bg-amber-900/30 text-amber-400 border-amber-800">
                  {premiumFunctions.length} Premium
                </Badge>
              )}
            </>
          ) : (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <AlertCircle className="w-3 h-3 text-gray-500" />
              <span>No functions configured</span>
            </div>
          )}
        </div>
      </div>
      <ChevronRight className="ml-auto w-5 h-5 text-gray-500" />
    </div>
  );
};
