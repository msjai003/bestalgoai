
export interface Broker {
  id: number;
  name: string;
  description: string;
  logo: string;
  supportedAssets: string[];
  fees: string;
  apiRequired: boolean;
  requiresSecretKey?: boolean;
}

export interface BrokerCredentials {
  accessToken: string;
  username: string;
  password: string;
  apiKey: string;
  secretKey: string;
  twoFactorSecret: string;
  twoFactorCode: string;
  sessionId: string;
  [key: string]: string; // Allow dynamic field names
}

export interface BrokerField {
  id: string;
  broker_id: number;
  field_name: string;
  field_type: string;
  display_name: string;
  placeholder?: string;
  is_required: boolean;
  is_sensitive: boolean;
  sort_order: number;
  is_visible: boolean;
}

export interface BrokerPermissions {
  readOnly: boolean;
  trading: boolean;
}

export type ConnectionStep = "selection" | "credentials" | "settings" | "success";
