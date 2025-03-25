
export interface Broker {
  id: number;
  name: string;
  description: string;
  logo: string;
  supportedAssets: string[];
  fees: string;
  apiRequired: boolean;
  requiresSecretKey?: boolean; // New field to mark brokers that need secret key
}

export interface BrokerCredentials {
  username: string;
  password: string;
  apiKey: string;
  secretKey: string; // Added new field for Zerodha secret key
  accessToken: string;
  twoFactorSecret: string;
  twoFactorCode: string;
  sessionId: string;
}

export interface BrokerPermissions {
  readOnly: boolean;
  trading: boolean;
}

export type ConnectionStep = "selection" | "credentials" | "settings" | "success";
