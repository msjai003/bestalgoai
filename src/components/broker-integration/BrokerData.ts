
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
    logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg",
    description: "India's largest stock broker offering the lowest, most competitive brokerage rates",
    supportedAssets: ["Stocks", "Options", "Futures", "Commodities"],
    fees: "₹0 for equity delivery, ₹20 per order for intraday",
    apiRequired: true,
    requiresSecretKey: true
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
    id: 5,
    name: "Upstox",
    logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg",
    description: "Discount broker with powerful trading platforms",
    supportedAssets: ["Stocks", "Options", "Futures", "Commodities"],
    fees: "₹20 per order or 0.05% (whichever is lower)",
    apiRequired: true,
  }
];
