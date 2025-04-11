
import { Broker } from "@/types/broker";

export interface AccountType {
  value: string;
  label: string;
}

export const accountTypes: AccountType[] = [
  { value: "savings", label: "Savings Account" },
  { value: "checking", label: "Checking Account" },
  { value: "trading", label: "Trading Account" },
];

export const brokers: Broker[] = [
  {
    id: 1,
    name: "Zerodha",
    description: "India's largest stock broker offering the lowest, flat-fee brokerage rates.",
    logo: "/lovable-uploads/9de2890f-d6a8-443f-9e22-64a47566a9fa.png",
    apiRequired: true,
    requiresSecretKey: true,
    requiredInputs: ["api_key", "secret_key", "user_id"]
  },
  {
    id: 2,
    name: "ICICI Direct",
    logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
    description: "Full-service broker offering investment products across asset classes",
    supportedAssets: ["Stocks", "Options", "Futures", "Mutual Funds"],
    fees: "0.275% for delivery, 0.05% for intraday",
    apiRequired: true,
  },
  {
    id: 3,
    name: "Angel One",
    logo: "/lovable-uploads/e4eaf527-5b68-4f06-99e7-5969dcfa6810.png",
    description: "Tech-first stockbroking platform with advanced trading tools",
    supportedAssets: ["Stocks", "Options", "Futures", "Commodities", "Currencies"],
    fees: "₹20 per order flat fee structure",
    apiRequired: true,
  },
  {
    id: 4,
    name: "HDFC Securities",
    logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg",
    description: "Full-service broker with research-backed investment advice",
    supportedAssets: ["Stocks", "Options", "Futures", "Mutual Funds"],
    fees: "0.25% for delivery, 0.05% for intraday",
    apiRequired: true,
  },
  {
    id: 5,
    name: "Upstox",
    logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg",
    description: "Discount broker with powerful trading platforms",
    supportedAssets: ["Stocks", "Options", "Futures", "Commodities"],
    fees: "₹20 per order or 0.05% (whichever is lower)",
    apiRequired: true,
  },
  {
    id: 6,
    name: "Groww",
    logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg",
    description: "User-friendly investment platform for stocks, mutual funds & more",
    supportedAssets: ["Stocks", "Mutual Funds", "ETFs", "US Stocks"],
    fees: "₹20 per order for intraday and F&O",
    apiRequired: true,
  },
  {
    id: 7,
    name: "5 Paisa",
    logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg",
    description: "Low-cost broker with advanced trading platforms",
    supportedAssets: ["Stocks", "Options", "Futures", "Commodities", "Currencies"],
    fees: "₹10 per order flat fee structure",
    apiRequired: true,
  },
  {
    id: 8,
    name: "Bigul",
    logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg",
    description: "New-age trading platform with innovative features",
    supportedAssets: ["Stocks", "Options", "Futures", "ETFs"],
    fees: "₹15 per order or 0.03% (whichever is lower)",
    apiRequired: true,
  }
];
