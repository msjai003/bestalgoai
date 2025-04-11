
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
  required_inputs: string[] | string;
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
  image_url?: string;
  required_inputs?: string[];
  created_at?: string;
  updated_at?: string;
  function_order?: number;
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

// Interface representing the broker_infocap table structure (legacy)
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
  broker_image?: string;  // Legacy property
  created_at?: string;
  updated_at?: string;
}

// Type definitions for RPC function responses
export type BrokerInfocapResponse = BrokerInfocapFunction[] | null;

// Response types for the mock client
export interface MockQueryResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface RPCParams {
  p_broker_id?: number;
  p_broker_name?: string;
  p_function_name?: string;
  p_function_description?: string;
  p_function_slug?: string;
  p_function_order?: number;
  p_function_enabled?: boolean;
  p_is_premium?: boolean;
  query?: string;
}

// Define specific RPC parameter types to ensure correct type checking
export interface GetBrokerFunctionsParams {
  p_broker_id: number;
}

export interface SaveBrokerFunctionParams {
  p_broker_id: number;
  p_broker_name: string;
  p_function_name: string;
  p_function_description: string;
  p_function_slug: string;
  p_function_order: number;
  p_function_enabled: boolean;
  p_is_premium: boolean;
  p_required_inputs?: string[];
  p_image_url?: string;
}

export interface ExecuteSqlParams {
  query: string;
}

// Add a new interface for the broker_image table
export interface BrokerImage {
  id: string;
  broker_id: number;
  image_url: string;
  created_at?: string;
  updated_at?: string;
}

// Add interface for broker_profile_images table
export interface BrokerProfileImage {
  id: string;
  broker_id: number;
  image_url: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
