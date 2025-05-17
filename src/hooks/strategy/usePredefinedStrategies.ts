
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Strategy } from "./types";

// Helper function to fetch predefined strategies
const fetchPredefinedStrategies = async (): Promise<Strategy[]> => {
  console.log("Fetching predefined strategies...");
  const { data, error } = await supabase
    .from("predefined_strategies")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching predefined strategies:", error);
    throw error;
  }

  // Process the data to ensure Apexflow (ID=2) is marked correctly
  const strategies = data.map(strategy => ({
    ...strategy,
    isPremium: strategy.id === 2 || strategy.id > 1, // Ensure Apexflow (ID=2) is always premium
  }));

  console.log("Fetched predefined strategies:", strategies);
  return strategies;
};

// Hook to load predefined strategies
export const usePredefinedStrategies = () => {
  return useQuery({
    queryKey: ["predefinedStrategies"],
    queryFn: fetchPredefinedStrategies,
  });
};
