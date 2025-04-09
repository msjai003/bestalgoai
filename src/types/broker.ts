
export interface Broker {
  id: number;
  name: string;
  description: string;
  logo: string;
  supportedAssets?: string[];
  fees?: string;
  apiRequired: boolean;
  requiresSecretKey?: boolean;
  requiredInputs?: string[];
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
  productType?: string;
}

export interface BrokerPermissions {
  readOnly: boolean;
  trading: boolean;
}

export type ConnectionStep = "selection" | "credentials" | "settings" | "success";

export interface ApiKeyInfo {
  id: string;
  name: string;
  api_key: string;
  created_at: string;
  last_used?: string;
}

// Interface representing the broker_details table structure
export interface BrokerDetail {
  id: number;
  broker_name: string;
  description?: string;
  image_url?: string;
  required_inputs: string[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Interface representing the brokers_functions table structure
export interface BrokerFunction {
  id: string;
  broker_id: number;
  broker_name: string;
  function_name: string;
  function_description?: string;
  function_slug: string;
  function_enabled: boolean;
  is_premium: boolean;
  broker_image?: string;
  created_at?: string;
  updated_at?: string;
}
