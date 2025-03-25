
import { Broker } from "@/types/broker";

export const brokers: Broker[] = [
  {
    id: 1,
    name: "Zerodha",
    description: "Most popular in India",
    logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg",
    supportedAssets: ["Stocks", "Options", "Futures", "Commodities"],
    fees: "₹0 for equity delivery, ₹20 per order for intraday",
    apiRequired: true,
    requiresSecretKey: true  // Only Zerodha requires secret key
  },
  {
    id: 2,
    name: "Angel One",
    description: "Recommended",
    logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
    supportedAssets: ["Stocks", "Options", "Futures", "Commodities", "Currencies"],
    fees: "₹20 per order flat fee structure",
    apiRequired: true
  },
  {
    id: 3,
    name: "ICICI Direct",
    description: "Bank-backed broker",
    logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg",
    supportedAssets: ["Stocks", "Options", "Futures", "Mutual Funds"],
    fees: "0.275% for delivery, 0.05% for intraday",
    apiRequired: true  // Changed from false to true to require API key and 2FA
  },
  {
    id: 4,
    name: "Upstox",
    description: "Low brokerage fees",
    logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg",
    supportedAssets: ["Stocks", "Options", "Futures", "Commodities"],
    fees: "₹20 per order or 0.05% (whichever is lower)",
    apiRequired: true
  },
  {
    id: 5,
    name: "Aliceblue",
    description: "Advanced trading tools",
    logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg",
    supportedAssets: ["Stocks", "Options", "Futures", "Commodities", "Currencies"],
    fees: "₹15 per order flat fee structure",
    apiRequired: true
  },
  {
    id: 6,
    name: "Angelone",
    description: "Comprehensive trading platform",
    logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg",
    supportedAssets: ["Stocks", "Options", "Futures", "Commodities", "Currencies"],
    fees: "₹20 per order flat fee structure",
    apiRequired: true
  }
];

export const accountTypes = [
  "Individual Trading Account",
  "Joint Trading Account",
  "Corporate Account",
  "Trust Account",
  "Demat Account"
];
