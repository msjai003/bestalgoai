
import { useState } from "react";
import { fetchUserBrokers } from "./useStrategyDatabase";
import { useAuth } from "@/contexts/AuthContext";

export const useStrategyDialogs = () => {
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showQuantityDialog, setShowQuantityDialog] = useState(false);
  const [showBrokerDialog, setShowBrokerDialog] = useState(false);
  const [targetStrategyId, setTargetStrategyId] = useState<number | null>(null);
  const [targetMode, setTargetMode] = useState<"live" | "paper" | null>(null);
  const [pendingQuantity, setPendingQuantity] = useState<number>(0);
  const [targetUniqueId, setTargetUniqueId] = useState<string | undefined>(undefined);
  const [targetRowId, setTargetRowId] = useState<string | undefined>(undefined);
  const { user } = useAuth();
  
  const resetDialogState = () => {
    setShowConfirmationDialog(false);
    setShowQuantityDialog(false);
    setShowBrokerDialog(false);
    setTargetStrategyId(null);
    setTargetMode(null);
    setPendingQuantity(0);
    setTargetUniqueId(undefined);
    setTargetRowId(undefined);
  };
  
  const openBrokerDialogAfterQuantity = async (quantity: number) => {
    setPendingQuantity(quantity);
    setShowQuantityDialog(false);
    setShowBrokerDialog(true);
  };

  return {
    showConfirmationDialog,
    setShowConfirmationDialog,
    showQuantityDialog,
    setShowQuantityDialog,
    showBrokerDialog,
    setShowBrokerDialog,
    targetStrategyId,
    setTargetStrategyId,
    targetMode,
    setTargetMode,
    pendingQuantity,
    setPendingQuantity,
    targetUniqueId,
    setTargetUniqueId,
    targetRowId,
    setTargetRowId,
    resetDialogState,
    openBrokerDialogAfterQuantity
  };
};
