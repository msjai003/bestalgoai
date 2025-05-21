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

    return strategySelections.map(selection => ({
      strategy_id: selection.strategy_id,
      strategy_name: selection.strategy_name,
      strategy_description: selection.strategy_description,
      id: selection.strategy_id,
      name: selection.strategy_name,
      description: selection.strategy_description,
      isWishlisted: false, // This value is not stored in the strategy_selections table
      isLive: selection.trade_type === "live trade",
      quantity: selection.quantity,
      selected_broker: selection.selected_broker,
      selectedBroker: selection.selected_broker,
      broker_username: selection.broker_username,
      brokerUsername: selection.broker_username,
      trade_type: selection.trade_type as "paper trade" | "live trade",
      tradeType: selection.trade_type as "paper trade" | "live trade",
      uniqueId: `${selection.strategy_id}-${selection.selected_broker}-${selection.broker_username}`,
      rowId: selection.id,
      paid_status: selection.paid_status, // Make sure we're including this field
      // Add default performance object since it's required by the Strategy type
      performance: {
        winRate: "N/A",
        avgProfit: "N/A",
        drawdown: "N/A"
      },
      package: 'free' // Default to free unless explicitly set as premium
    }));
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
  tradeType: "paper trade" | "live trade",
  strategyName: string = "",
  strategyDescription: string = ""
) => {
  try {
    console.log("Updating strategy with trade type:", tradeType);
    
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
      .eq('selected_broker', selectedBroker)
      .eq('broker_username', brokerUsername);

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
          strategy_description: strategyDescription
        })
        .eq('id', existingRecords[0].id)
        .select();
    } else {
      // Insert new record for this strategy-broker combination if none exists
      console.log("Creating new strategy-broker selection record for strategyId:", strategyId, "broker:", selectedBroker);
      result = await supabase
        .from('strategy_selections')
        .insert({
          user_id: userId,
          strategy_id: strategyId,
          quantity: quantity,
          selected_broker: selectedBroker,
          broker_username: brokerUsername,
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
  tradeType: "paper trade" | "live trade",
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
      .select('*')
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
    // Also include username information
    const { data: brokers, error } = await supabase
      .from('broker_credentials')
      .select('id, broker_name, username')
      .eq('user_id', userId)
      .eq('is_connected', true);

    if (error) {
      console.error("Error fetching user brokers:", error);
      throw error;
    }

    return brokers;
  } catch (error) {
    console.error("Exception fetching user brokers:", error);
    throw error;
  }
};
