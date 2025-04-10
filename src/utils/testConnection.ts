
import { supabase } from "@/lib/supabase/client";

export const testConnection = async (broker: string, credentials: any) => {
  // This is a mock function that pretends to test broker connections
  console.log(`Testing connection to ${broker} with credentials:`, credentials);
  
  // Simulate a delay for network call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock success based on certain conditions
  let success = Math.random() > 0.2; // 80% success rate
  
  if (broker === "Zerodha" && credentials.username === "test" && credentials.password === "test") {
    success = true;
  }
  
  if (success) {
    return {
      success: true,
      message: "Connection successful",
      data: {
        session_token: "mock-session-token-" + Math.random().toString(36).substring(2),
        user_id: "mock-user-id-" + Math.random().toString(36).substring(2),
        account_info: {
          account_type: "Individual",
          account_status: "Active",
          funds_available: 10000.00,
          last_login: new Date().toISOString()
        }
      }
    };
  } else {
    return {
      success: false,
      message: "Failed to connect: Invalid credentials",
      error: {
        code: "AUTH_FAILED",
        details: "The username or password you entered is incorrect."
      }
    };
  }
};

export const testFunctionality = async (broker: string, functionality: string) => {
  console.log(`Testing ${functionality} functionality for ${broker}`);
  
  // Simulate a delay for network call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, only some functionalities work
  const workingFunctionalities = ["order_placement", "market_data", "portfolio"];
  const isWorking = workingFunctionalities.includes(functionality);
  
  if (isWorking) {
    return {
      success: true,
      message: `${functionality} is working correctly`,
      data: {
        status: "AVAILABLE",
        permissions: ["read", "write"]
      }
    };
  } else {
    return {
      success: false,
      message: `${functionality} is not available or requires additional permissions`,
      error: {
        code: "FUNC_UNAVAILABLE",
        details: "This functionality is not supported or requires additional permissions."
      }
    };
  }
};

export const checkBrokerStatus = async (brokerId: number) => {
  try {
    // Check if broker has any functions
    const { data, error } = await supabase.rpc('get_broker_infocap_functions', {
      p_broker_id: brokerId
    });
    
    if (error) {
      console.error("Error checking broker status:", error);
      return { 
        isActive: false, 
        functionCount: 0,
        message: "Error checking broker status" 
      };
    }
    
    // Check if data has any items
    const hasData = data && Array.isArray(data) && data.length > 0;
    const functionCount = hasData ? data.length : 0;
    
    return {
      isActive: functionCount > 0,
      functionCount,
      message: functionCount > 0 ? 
        `Broker is active with ${functionCount} functions` : 
        "Broker has no active functions"
    };
  } catch (error) {
    console.error("Error in checkBrokerStatus:", error);
    return { 
      isActive: false, 
      functionCount: 0,
      message: "Exception checking broker status" 
    };
  }
};
