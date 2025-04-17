
import { useState } from "react";

export const useLogoutDialog = () => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const openLogoutDialog = () => setShowLogoutDialog(true);
  const closeLogoutDialog = () => setShowLogoutDialog(false);

  return {
    showLogoutDialog,
    openLogoutDialog,
    closeLogoutDialog,
    setShowLogoutDialog
  };
};
