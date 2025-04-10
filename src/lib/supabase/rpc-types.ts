
import { BrokerFunction, BrokerInfocapFunction, BrokerDetail } from "@/types/broker";

/**
 * Type definitions for RPC functions to improve TypeScript support
 */

export interface BrokerDetailRPC {
  id: number;
  broker_name: string;
  description: string | null;
  image_url: string | null;
  required_inputs: string[] | string | Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RPCFunctions {
  // Broker Info Functions
  get_all_broker_details: {
    params: {};
    returns: BrokerDetailRPC[];
  };
  
  get_broker_details: {
    params: { p_broker_id: number };
    returns: BrokerDetailRPC[];
  };
  
  // Broker Functions
  get_all_broker_functions: {
    params: {};
    returns: BrokerFunction[];
  };
  
  save_broker_function: {
    params: {
      p_broker_id: number;
      p_broker_name: string;
      p_function_name: string;
      p_function_description: string;
      p_function_slug: string;
      p_function_enabled: boolean;
      p_is_premium: boolean;
      p_broker_image: string;
    };
    returns: { id: string };
  };
  
  // Broker Infocap Functions
  get_all_broker_infocap_functions: {
    params: {};
    returns: BrokerInfocapFunction[];
  };
  
  get_broker_infocap_functions: {
    params: { p_broker_id: number };
    returns: BrokerInfocapFunction[];
  };
  
  save_broker_infocap_function: {
    params: {
      p_broker_id: number;
      p_broker_name: string;
      p_function_name: string;
      p_function_description: string;
      p_function_slug: string;
      p_function_order: number;
      p_function_enabled: boolean;
      p_is_premium: boolean;
    };
    returns: { id: string };
  };
  
  delete_broker_infocap_function: {
    params: { p_function_id: number };
    returns: boolean;
  };
  
  update_broker_infocap_function_order: {
    params: { 
      p_function_id: number;
      p_new_order: number;
    };
    returns: boolean;
  };
}
