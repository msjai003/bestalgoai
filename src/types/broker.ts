
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
  twoFactorSecret: string;
  twoFactorCode: string;
}

export interface BrokerPermissions {
  readOnly: boolean;
  trading: boolean;
}

export type ConnectionStep = "selection" | "credentials" | "verification" | "settings" | "success";
