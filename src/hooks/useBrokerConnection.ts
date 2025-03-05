
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ConnectionStep, BrokerCredentials, BrokerPermissions } from "@/types/broker";

export const useBrokerConnection = (selectedBroker: any) => {
  const navigate = useNavigate();
  const [connectionStep, setConnectionStep] = useState<ConnectionStep>("credentials");
  const [credentials, setCredentials] = useState<BrokerCredentials>({
    username: "",
    password: "",
    apiKey: "",
    twoFactorSecret: "",
    twoFactorCode: ""
  });
  const [selectedAccount, setSelectedAccount] = useState("");
  const [permissions, setPermissions] = useState<BrokerPermissions>({
    readOnly: true,
    trading: false
  });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleCredentialsSubmit = () => {
    if (!credentials.username || !credentials.password) {
      toast.error("Please enter your username and password");
      return;
    }

    if (selectedBroker?.apiRequired && (!credentials.apiKey || !credentials.twoFactorSecret)) {
      toast.error("API Key and 2FA Secret are required for this broker");
      return;
    }

    setConnectionStep("verification");
    toast.info("Verifying credentials...");
    
    setTimeout(() => {
      if (credentials.twoFactorCode === "123456" || credentials.twoFactorCode === "") {
        setConnectionStep("settings");
        toast.success("Credentials verified successfully");
      } else {
        toast.error("Invalid verification code. Please try again.");
      }
    }, 1500);
  };

  const handleSettingsSubmit = () => {
    if (!selectedAccount) {
      toast.error("Please select an account type");
      return;
    }

    setConnectionStep("success");
    setShowSuccessDialog(true);
  };

  const handleComplete = () => {
    setShowSuccessDialog(false);
    toast.success(`Your request has been submitted to our technical team`);
    navigate('/'); // Changed from '/dashboard' to '/' to navigate to home page
  };

  const handleBack = () => {
    if (connectionStep === "credentials") {
      navigate("/broker-integration");
    } else if (connectionStep === "verification") {
      setConnectionStep("credentials");
    } else if (connectionStep === "settings") {
      setConnectionStep("verification");
    }
  };

  return {
    connectionStep,
    credentials,
    setCredentials,
    selectedAccount,
    setSelectedAccount,
    permissions,
    setPermissions,
    showSuccessDialog,
    setShowSuccessDialog,
    handleCredentialsSubmit,
    handleSettingsSubmit,
    handleComplete,
    handleBack
  };
};
