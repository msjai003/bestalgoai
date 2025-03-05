
import { Search, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Broker } from "@/types/broker";

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
            <div
              key={broker.id}
              className="flex items-center p-4 bg-gray-800/30 rounded-xl border border-gray-700 cursor-pointer hover:border-pink-500 transition-colors"
              onClick={() => onSelectBroker(broker.id)}
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
  );
};
