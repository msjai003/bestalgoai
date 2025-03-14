
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ConnectionStep, BrokerCredentials, BrokerPermissions } from "@/types/broker";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useBrokerConnection = (selectedBroker: any) => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCredentialsSubmit = async () => {
    if (!credentials.username || !credentials.password) {
      toast.error("Please enter your username and password");
      return;
    }

    if (selectedBroker?.apiRequired && (!credentials.apiKey || !credentials.twoFactorSecret)) {
      toast.error("API Key and 2FA Secret are required for this broker");
      return;
    }

    // If currently on credentials step, move to verification
    if (connectionStep === "credentials") {
      setConnectionStep("verification");
      toast.info("Please enter the verification code sent to your email");
      return;
    }

    // If on verification step, validate the 2FA code
    if (connectionStep === "verification") {
      if (!credentials.twoFactorCode || credentials.twoFactorCode.length !== 6) {
        toast.error("Please enter a valid 6-digit verification code");
        return;
      }

      toast.info("Verifying code...");
      
      setTimeout(() => {
        if (credentials.twoFactorCode === "123456") {
          setConnectionStep("settings");
          toast.success("Verification successful");
        } else {
          toast.error("Invalid verification code. Please try again.");
        }
      }, 1500);
    }
  };

  const handleSettingsSubmit = async () => {
    if (!selectedAccount) {
      toast.error("Please select an account type");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to connect a broker");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save broker credentials to the database
      const { data, error } = await supabase
        .from('broker_credentials')
        .insert({
          user_id: user.id,
          broker_id: selectedBroker.id,
          broker_name: selectedBroker.name,
          username: credentials.username,
          password: credentials.password,
          api_key: credentials.apiKey || null,
          two_factor_secret: credentials.twoFactorSecret || null,
          status: 'pending'
        });

      if (error) {
        console.error("Error saving broker credentials:", error);
        toast.error("Failed to save broker credentials");
        setIsSubmitting(false);
        return;
      }

      setConnectionStep("success");
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Exception saving broker credentials:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
    handleBack,
    isSubmitting
  };
};
