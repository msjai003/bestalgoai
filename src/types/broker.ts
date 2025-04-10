
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

// Interface representing the broker_functionality table structure
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

// Interface for broker function configuration
export interface BrokerFunctionConfig {
  id: string;
  broker_id: number;
  function_slug: string;
  config_data: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

// Interface representing the broker_infocap table structure
export interface BrokerInfocapFunction {
  id: string;
  broker_id: number;
  broker_name: string;
  function_name: string;
  function_description?: string;
  function_slug: string;
  function_order: number;
  function_enabled: boolean;
  is_premium: boolean;
  created_at?: string;
  updated_at?: string;
}
