
import { useState } from "react";

export interface StrategyDialogState {
  showConfirmationDialog: boolean;
  showQuantityDialog: boolean;
  showBrokerDialog: boolean;
  targetStrategyId: number | null;
  targetMode: "live" | "paper" | null;
  pendingQuantity: number;
}

export const useStrategyDialogs = () => {
  const [dialogState, setDialogState] = useState<StrategyDialogState>({
    showConfirmationDialog: false,
    showQuantityDialog: false,
    showBrokerDialog: false,
    targetStrategyId: null,
    targetMode: null,
    pendingQuantity: 0
  });

  const setShowConfirmationDialog = (show: boolean) => {
    setDialogState(prev => ({ ...prev, showConfirmationDialog: show }));
  };

  const setShowQuantityDialog = (show: boolean) => {
    setDialogState(prev => ({ ...prev, showQuantityDialog: show }));
  };

  const setShowBrokerDialog = (show: boolean) => {
    setDialogState(prev => ({ ...prev, showBrokerDialog: show }));
  };

  const setTargetStrategyId = (id: number | null) => {
    setDialogState(prev => ({ ...prev, targetStrategyId: id }));
  };

  const setTargetMode = (mode: "live" | "paper" | null) => {
    setDialogState(prev => ({ ...prev, targetMode: mode }));
  };

  const setPendingQuantity = (quantity: number) => {
    setDialogState(prev => ({ ...prev, pendingQuantity: quantity }));
  };

  const resetDialogState = () => {
    setDialogState({
      showConfirmationDialog: false,
      showQuantityDialog: false,
      showBrokerDialog: false,
      targetStrategyId: null,
      targetMode: null,
      pendingQuantity: 0
    });
  };

  const openBrokerDialogAfterQuantity = (quantity: number) => {
    setPendingQuantity(quantity);
    setShowQuantityDialog(false);
    setShowBrokerDialog(true);
  };

  return {
    ...dialogState,
    setShowConfirmationDialog,
    setShowQuantityDialog,
    setShowBrokerDialog,
    setTargetStrategyId,
    setTargetMode,
    setPendingQuantity,
    resetDialogState,
    openBrokerDialogAfterQuantity
  };
};
