
import { useState } from "react";

export const useStrategyDialogs = () => {
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showQuantityDialog, setShowQuantityDialog] = useState(false);
  const [showBrokerDialog, setShowBrokerDialog] = useState(false);
  const [targetStrategyId, setTargetStrategyId] = useState<number | null>(null);
  const [targetMode, setTargetMode] = useState<"paper" | "live" | null>(null);
  const [targetBrokerId, setTargetBrokerId] = useState<string | null>(null);
  const [pendingQuantity, setPendingQuantity] = useState<number>(0);

  const openBrokerDialogAfterQuantity = (quantity: number) => {
    setPendingQuantity(quantity);
    setShowQuantityDialog(false);
    setShowBrokerDialog(true);
  };

  const resetDialogState = () => {
    setShowConfirmationDialog(false);
    setShowQuantityDialog(false);
    setShowBrokerDialog(false);
    setTargetStrategyId(null);
    setTargetMode(null);
    setTargetBrokerId(null);
    setPendingQuantity(0);
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
    targetBrokerId,
    setTargetBrokerId,
    pendingQuantity,
    setPendingQuantity,
    openBrokerDialogAfterQuantity,
    resetDialogState
  };
};
