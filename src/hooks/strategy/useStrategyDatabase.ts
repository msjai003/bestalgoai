
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
      id: selection.strategy_id,
      name: selection.strategy_name,
      description: selection.strategy_description,
      isWishlisted: false, // This value is not stored in the strategy_selections table
      isLive: selection.trade_type === "live trade",
      quantity: selection.quantity,
      selectedBroker: selection.selected_broker,
      brokerUsername: selection.broker_username,
      tradeType: selection.trade_type,
      uniqueId: `${selection.strategy_id}-${selection.selected_broker}-${selection.broker_username}`,
      rowId: selection.id,
      // Add default performance object since it's required by the Strategy type
      performance: {
        winRate: "N/A",
        avgProfit: "N/A",
        drawdown: "N/A"
      }
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
  tradeType: string,
  strategyName: string = "",  // Added strategyName parameter with default value
  strategyDescription: string = "" // Added strategyDescription parameter with default value
) => {
  try {
    // If strategyName is empty, try to fetch it from existing record
    if (!strategyName || !strategyDescription) {
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

    // If still no name, use a default
    if (!strategyName) {
      strategyName = `Strategy ${strategyId}`;
    }

    // Check if record exists
    const { data: existingRecord, error: checkError } = await supabase
      .from('strategy_selections')
      .select('id')
      .eq('user_id', userId)
      .eq('strategy_id', strategyId)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking for existing record:", checkError);
      throw checkError;
    }

    let data;
    let error;

    if (existingRecord) {
      // Update existing record
      console.log("Updating existing strategy record:", existingRecord.id);
      const result = await supabase
        .from('strategy_selections')
        .update({
          quantity: quantity,
          selected_broker: selectedBroker,
          broker_username: brokerUsername,
          trade_type: tradeType,
          strategy_name: strategyName,
          strategy_description: strategyDescription
        })
        .eq('id', existingRecord.id)
        .select();
      
      data = result.data;
      error = result.error;
    } else {
      // Insert new record
      console.log("Creating new strategy selection record");
      const result = await supabase
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
      
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error("Error updating strategy live config:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in updateStrategyLiveConfig:", error);
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
    // Only fetch brokers with status="connected"
    const { data: brokers, error } = await supabase
      .from('broker_credentials')
      .select('id, broker_name')
      .eq('user_id', userId)
      .eq('status', 'connected');

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
