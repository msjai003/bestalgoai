
import { supabase } from "@/integrations/supabase/client";

export const loadUserStrategies = async (userId: string) => {
  try {
    const { data: strategySelections, error } = await supabase
      .from('strategy_selections')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error("Error fetching strategy selections:", error);
      return [];
    }

    // Load all broker usernames for this user to display them correctly
    const { data: brokerCredentials, error: brokerError } = await supabase
      .from('broker_credentials')
      .select('id, broker_name, username, broker_id')
      .eq('user_id', userId);

    if (brokerError) {
      console.error("Error fetching broker credentials:", brokerError);
    }

    // Create a map of broker IDs to broker usernames for easy lookup
    const brokerUsernameMap = {};
    if (brokerCredentials) {
      brokerCredentials.forEach(cred => {
        brokerUsernameMap[cred.id] = cred.username;
      });
    }

    return strategySelections.map(selection => {
      // Get the broker username from our map based on the selected_broker UUID 
      // If not found, fallback to the stored broker_username
      const brokerUsername = brokerUsernameMap[selection.selected_broker] || selection.broker_username;

      return {
        id: selection.strategy_id,
        name: selection.strategy_name,
        description: selection.strategy_description,
        isWishlisted: false, // This value is not stored in the strategy_selections table
        isLive: selection.trade_type === "live trade",
        quantity: selection.quantity,
        selectedBroker: selection.selected_broker,
        brokerUsername: brokerUsername,
        tradeType: selection.trade_type,
        uniqueId: `${selection.strategy_id}-${selection.selected_broker}-${brokerUsername}`,
        rowId: selection.id,
        paid_status: selection.paid_status,
        // Add default performance object since it's required by the Strategy type
        performance: {
          winRate: "N/A",
          avgProfit: "N/A",
          drawdown: "N/A"
        }
      };
    });
  } catch (error) {
    console.error("Error loading user strategies:", error);
    return [];
  }
};

export const updateStrategyLiveConfig = async (
  userId: string,
  strategyId: number,
  quantity: number,
  selectedBroker: string,
  brokerUsername: string,
  tradeType: string,
  strategyName: string = "",
  strategyDescription: string = ""
) => {
  try {
    console.log("Updating strategy with trade type:", tradeType);
    
    // Get broker details to ensure we have the correct username
    const { data: brokerData, error: brokerError } = await supabase
      .from('broker_credentials')
      .select('id, username, broker_name')
      .eq('id', selectedBroker)
      .maybeSingle();
    
    if (brokerError) {
      console.error("Error fetching broker details:", brokerError);
    }
    
    // Use the username from broker_credentials if available
    const correctBrokerUsername = brokerData?.username || brokerUsername;
    const brokerDisplayName = brokerData?.broker_name || 'Unknown Broker';
    
    console.log("Using broker username:", correctBrokerUsername);
    console.log("Using broker display name:", brokerDisplayName);
    
    // If strategyName is empty, try to fetch it from predefined_strategies table
    if (!strategyName || !strategyDescription) {
      const { data: predefinedStrategy, error: predefinedError } = await supabase
        .from('predefined_strategies')
        .select('name, description')
        .eq('id', strategyId)
        .maybeSingle();
        
      if (!predefinedError && predefinedStrategy) {
        strategyName = strategyName || predefinedStrategy.name;
        strategyDescription = strategyDescription || predefinedStrategy.description || "";
      }
      
      // If still not found, try to fetch from existing record
      if (!strategyName) {
        const { data: existingStrategy, error: fetchError } = await supabase
          .from('strategy_selections')
          .select('strategy_name, strategy_description')
          .eq('user_id', userId)
          .eq('strategy_id', strategyId)
          .maybeSingle();

        if (!fetchError && existingStrategy) {
          strategyName = strategyName || existingStrategy.strategy_name;
          strategyDescription = strategyDescription || existingStrategy.strategy_description || "";
        }
      }
    }

    // If still no name, use a default
    if (!strategyName) {
      strategyName = `Strategy ${strategyId}`;
    }

    console.log("Using strategy name:", strategyName);
    console.log("Using strategy description:", strategyDescription);

    // Check if record exists for this specific strategy + broker combination
    const { data: existingRecords, error: checkError } = await supabase
      .from('strategy_selections')
      .select('id')
      .eq('user_id', userId)
      .eq('strategy_id', strategyId)
      .eq('selected_broker', selectedBroker);

    if (checkError) {
      console.error("Error checking for existing records:", checkError);
      throw checkError;
    }

    let result;

    // Check if the record exists for this specific strategy + broker combination
    if (existingRecords && existingRecords.length > 0) {
      // Update existing record for this specific broker
      console.log("Updating existing strategy-broker record, record ID:", existingRecords[0].id);
      result = await supabase
        .from('strategy_selections')
        .update({
          quantity: quantity,
          trade_type: tradeType,
          strategy_name: strategyName,
          strategy_description: strategyDescription,
          broker_username: correctBrokerUsername
        })
        .eq('id', existingRecords[0].id)
        .select();
    } else {
      // Insert new record for this strategy-broker combination if none exists
      console.log("Creating new strategy-broker selection record for strategyId:", strategyId, "broker:", brokerDisplayName);
      result = await supabase
        .from('strategy_selections')
        .insert({
          user_id: userId,
          strategy_id: strategyId,
          quantity: quantity,
          selected_broker: selectedBroker,
          broker_username: correctBrokerUsername,
          trade_type: tradeType,
          strategy_name: strategyName,
          strategy_description: strategyDescription
        })
        .select();
    }
    
    if (result.error) {
      console.error("Error updating strategy live config:", result.error);
      throw result.error;
    }

    return result.data;
  } catch (error) {
    console.error("Error in updateStrategyLiveConfig:", error);
    throw error;
  }
};

export const updateStrategyTradeType = async (
  userId: string,
  strategyId: number | string,
  tradeType: string,
  selectedBroker: string,
  brokerUsername: string = ""
) => {
  try {
    console.log(`Updating strategy ${strategyId} with broker ${selectedBroker} to trade type: ${tradeType}`);
    
    // Make sure strategyId is a number for database operations
    const strategyIdNum = typeof strategyId === 'string' ? parseInt(strategyId, 10) : strategyId;
    
    // Check if record exists for this specific strategy + broker combination
    const { data: specificBrokerRecords, error: brokerCheckError } = await supabase
      .from('strategy_selections')
      .select('id')
      .eq('user_id', userId)
      .eq('strategy_id', strategyIdNum)
      .eq('selected_broker', selectedBroker);
      
    if (brokerCheckError) {
      console.error("Error checking for broker records:", brokerCheckError);
      throw brokerCheckError;
    }
      
    if (specificBrokerRecords && specificBrokerRecords.length > 0) {
      // Update only this specific broker's record
      console.log(`Updating trade type for strategy ${strategyId} with broker ${selectedBroker} to ${tradeType}`);
      const { error } = await supabase
        .from('strategy_selections')
        .update({ trade_type: tradeType })
        .eq('id', specificBrokerRecords[0].id);
        
      if (error) {
        console.error("Error updating strategy trade type:", error);
        throw error;
      }
      
      return { 
        success: true, 
        message: `Updated trade type to ${tradeType} for strategy with broker ${selectedBroker}` 
      };
    } else {
      return { 
        success: false, 
        message: `No record found for strategy ${strategyId} with broker ${selectedBroker}` 
      };
    }
  } catch (error) {
    console.error("Error updating strategy trade type:", error);
    throw error;
  }
};

export const fetchBrokerById = async (brokerId: string) => {
  try {
    const { data: broker, error } = await supabase
      .from('broker_credentials')
      .select('id, broker_name, username')
      .eq('id', brokerId)
      .single();

    if (error) {
      console.error("Error fetching broker by ID:", error);
      throw error;
    }

    return broker;
  } catch (error) {
    console.error("Exception fetching broker by ID:", error);
    throw error;
  }
};

export const fetchUserBrokers = async (userId: string) => {
  try {
    // Updated to use is_connected field instead of checking status
    const { data: brokers, error } = await supabase
      .from('broker_credentials')
      .select('id, broker_name, username')
      .eq('user_id', userId)
      .eq('is_connected', true);

    if (error) {
      console.error("Error fetching user brokers:", error);
      throw error;
    }

    console.log("Fetched brokers with usernames:", brokers);
    return brokers;
  } catch (error) {
    console.error("Exception fetching user brokers:", error);
    throw error;
  }
};
