export interface Broker {
  id: number;
  name: string;
  logo: string;
  description: string;
  apiRequired: boolean;
}

export interface AccountType {
  value: string;
  label: string;
}

export const accountTypes: AccountType[] = [
  { value: "savings", label: "Savings Account" },
  { value: "checking", label: "Checking Account" },
  { value: "trading", label: "Trading Account" },
];

export const brokers = [
  {
    id: 1,
    name: "Zerodha",
    logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg",
    description: "India's largest stock broker offering the lowest, most competitive brokerage rates",
    apiRequired: true,
  },
  {
    id: 2,
    name: "ICICI Direct",
    logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
    description: "Full-service broker offering investment products across asset classes",
    apiRequired: true,
  },
  {
    id: 3,
    name: "Angel One",
    logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg",
    description: "Tech-first stockbroking platform with advanced trading tools",
    apiRequired: true,
  },
  {
    id: 4,
    name: "HDFC Securities",
    logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg",
    description: "Full-service broker with research-backed investment advice",
    apiRequired: true,
  },
  {
    id: 5,
    name: "Upstox",
    logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg",
    description: "Discount broker with powerful trading platforms",
    apiRequired: true,
  },
  {
    id: 6,
    name: "Groww",
    logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg",
    description: "User-friendly investment platform for stocks, mutual funds & more",
    apiRequired: true,
  },
  {
    id: 7,
    name: "5 Paisa",
    logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg",
    description: "Low-cost broker with advanced trading platforms",
    apiRequired: true,
  },
  {
    id: 8,
    name: "Bigul", // Updated from "Bigil" to "Bigul"
    logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg",
    description: "New-age trading platform with innovative features",
    apiRequired: true,
  }
];
