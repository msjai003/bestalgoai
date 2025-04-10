
import { useState } from "react";

export const useStrategyDialogState = () => {
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showQuantityDialog, setShowQuantityDialog] = useState(false);
  const [showBrokerDialog, setShowBrokerDialog] = useState(false);
  const [currentStrategyId, setCurrentStrategyId] = useState<number | null>(null);
  const [currentCustomId, setCurrentCustomId] = useState<string | null>(null);
  const [targetMode, setTargetMode] = useState<"live" | "paper" | null>(null);
  const [currentBroker, setCurrentBroker] = useState<string | null>(null);
  
  const resetDialogs = () => {
    setShowConfirmationDialog(false);
    setShowQuantityDialog(false);
    setShowBrokerDialog(false);
    setCurrentStrategyId(null);
    setCurrentCustomId(null);
    setTargetMode(null);
    setCurrentBroker(null);
  };
  
  return {
    showConfirmationDialog,
    setShowConfirmationDialog,
    showQuantityDialog,
    setShowQuantityDialog,
    showBrokerDialog,
    setShowBrokerDialog,
    currentStrategyId,
    setCurrentStrategyId,
    currentCustomId,
    setCurrentCustomId,
    targetMode,
    setTargetMode,
    currentBroker,
    setCurrentBroker,
    resetDialogs
  };
};
