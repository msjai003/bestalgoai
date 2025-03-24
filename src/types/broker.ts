
export interface Broker {
  id: number;
  name: string;
  description: string;
  logo: string;
  supportedAssets: string[];
  fees: string;
  apiRequired: boolean;
}

export interface BrokerCredentials {
  username: string;
  password: string;
  apiKey: string;
  accessToken: string; // Added new field
  twoFactorSecret: string;
  twoFactorCode: string;
  sessionId: string;
}

export interface BrokerPermissions {
  readOnly: boolean;
  trading: boolean;
}

export type ConnectionStep = "selection" | "credentials" | "settings" | "success";
