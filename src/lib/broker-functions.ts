
import { BrokerFunction } from '@/hooks/strategy/types';
import { brokers } from '@/components/broker-integration/BrokerData';

// Static broker functions data
const staticBrokerFunctions: BrokerFunction[] = [
  // Zerodha functions
  {
    id: "1-order_placement",
    broker_id: 1,
    broker_name: "Zerodha",
    function_name: "Order Placement",
    function_description: "Place new orders with the broker",
    function_slug: "order_placement",
    function_enabled: true,
    is_premium: false,
    broker_image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
  },
  {
    id: "1-order_modification",
    broker_id: 1,
    broker_name: "Zerodha",
    function_name: "Order Modification",
    function_description: "Modify existing orders",
    function_slug: "order_modification",
    function_enabled: true,
    is_premium: false,
    broker_image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
  },
  {
    id: "1-market_data",
    broker_id: 1,
    broker_name: "Zerodha",
    function_name: "Market Data",
    function_description: "Access real-time market data",
    function_slug: "market_data",
    function_enabled: true,
    is_premium: true,
    broker_image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
  },
  // Add more broker functions as needed for other brokers
];

/**
 * Fetches all functions for a specific broker
 */
export const getFunctionsForBroker = async (brokerId: number): Promise<BrokerFunction[]> => {
  // Filter functions from static data
  return staticBrokerFunctions.filter(func => 
    func.broker_id === brokerId && func.function_enabled
  );
};

/**
 * Checks if a broker has a specific function enabled
 */
export const hasBrokerFunction = async (
  brokerId: number, 
  functionSlug: string
): Promise<boolean> => {
  const functions = staticBrokerFunctions.filter(func => 
    func.broker_id === brokerId && 
    func.function_slug === functionSlug && 
    func.function_enabled
  );
  
  return functions.length > 0;
};

/**
 * Checks if a broker function is premium
 */
export const isBrokerFunctionPremium = async (
  brokerId: number, 
  functionSlug: string
): Promise<boolean> => {
  const functions = staticBrokerFunctions.filter(func => 
    func.broker_id === brokerId && 
    func.function_slug === functionSlug && 
    func.function_enabled
  );
  
  if (functions.length === 0) return false;
  
  return !!functions[0].is_premium;
};

/**
 * Gets function configuration for a broker
 */
export const getBrokerFunctionConfig = async (
  brokerId: number, 
  functionSlug: string
): Promise<any | null> => {
  const functions = staticBrokerFunctions.filter(func => 
    func.broker_id === brokerId && 
    func.function_slug === functionSlug && 
    func.function_enabled
  );
  
  if (functions.length === 0) return null;
  
  // Return a default configuration or null
  return functions[0].configuration || null;
};

/**
 * Gets broker image for a broker function
 */
export const getBrokerImage = async (
  brokerId: number
): Promise<string | null> => {
  const broker = brokers.find(b => b.id === brokerId);
  return broker?.logo || null;
};
