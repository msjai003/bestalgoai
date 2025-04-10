
import { useNavigate } from "react-router-dom";
import { useStrategyDialogState } from "./useStrategyDialogState";
import { useStrategyDataManagement } from "./useStrategyDataManagement";
import { useStrategyDialogHandlers } from "./useStrategyDialogHandlers";
import { useStrategyActionHandlers } from "./useStrategyActionHandlers";

export const useLiveTrading = () => {
  const navigate = useNavigate();
  
  // Use our new modular hooks
  const {
    selectedMode,
    strategies,
    isActive,
    handleModeChange,
    toggleTradingActive,
    setStrategies
  } = useStrategyDataManagement();
  
  const {
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
  } = useStrategyDialogState();
  
  const {
    confirmModeChange: confirmModeChangeHandler,
    handleQuantitySubmit: handleQuantitySubmitHandler,
    handleBrokerSubmit: handleBrokerSubmitHandler
  } = useStrategyDialogHandlers(strategies, setStrategies);
  
  const {
    handleTradingToggle: handleTradingToggleAction,
    handleToggleLiveMode: handleToggleLiveModeAction,
    handleOpenQuantityDialog: handleOpenQuantityDialogAction
  } = useStrategyActionHandlers(isActive, toggleTradingActive);
  
  // Connect the handlers to the state
  const handleTradingToggle = () => {
    handleTradingToggleAction();
  };
  
  const handleToggleLiveMode = (
    id: number, 
    uniqueId?: string, 
    rowId?: string, 
    broker?: string
  ) => {
    handleToggleLiveModeAction(
      id, 
      uniqueId, 
      rowId, 
      broker, 
      strategies, 
      setCurrentStrategyId,
      setCurrentBroker,
      setCurrentCustomId,
      setTargetMode,
      setShowConfirmationDialog
    );
  };
  
  const handleOpenQuantityDialog = (id: number) => {
    handleOpenQuantityDialogAction(
      id, 
      setCurrentStrategyId, 
      setShowQuantityDialog
    );
  };
  
  const confirmModeChange = async () => {
    await confirmModeChangeHandler(
      currentStrategyId, 
      currentCustomId, 
      targetMode, 
      currentBroker
    );
    resetDialogs();
  };
  
  const cancelModeChange = () => {
    resetDialogs();
  };
  
  const handleQuantitySubmit = async (quantity: number) => {
    await handleQuantitySubmitHandler(quantity, currentStrategyId);
    setShowQuantityDialog(false);
    setCurrentStrategyId(null);
  };
  
  const handleCancelQuantity = () => {
    setShowQuantityDialog(false);
    setCurrentStrategyId(null);
  };
  
  const handleBrokerSubmit = async (broker: string, username: string) => {
    await handleBrokerSubmitHandler(broker, username, currentStrategyId);
    setShowBrokerDialog(false);
    setCurrentStrategyId(null);
  };
  
  const handleCancelBroker = () => {
    setShowBrokerDialog(false);
    setCurrentStrategyId(null);
  };

  return {
    isActive,
    selectedMode,
    strategies,
    showConfirmationDialog,
    setShowConfirmationDialog,
    showQuantityDialog,
    setShowQuantityDialog,
    showBrokerDialog,
    setShowBrokerDialog,
    targetMode,
    currentBroker,
    handleTradingToggle,
    handleModeChange,
    handleToggleLiveMode,
    handleOpenQuantityDialog,
    confirmModeChange,
    cancelModeChange,
    handleQuantitySubmit,
    handleCancelQuantity,
    handleBrokerSubmit,
    handleCancelBroker,
    navigate
  };
};
