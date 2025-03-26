
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
    secretKey: "",
    accessToken: "",
    twoFactorSecret: "",
    twoFactorCode: "",
    sessionId: ""
  });
  const [selectedAccount, setSelectedAccount] = useState("");
  const [permissions, setPermissions] = useState<BrokerPermissions>({
    readOnly: true,
    trading: false
  });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCredentialsSubmit = async () => {
    if (!credentials.username) {
      toast.error("Please enter your username");
      return;
    }

    if (!credentials.password) {
      toast.error("Please enter your password");
      return;
    }

    // Move to settings without generating an access token
    setConnectionStep("settings");
    toast.success("Credentials accepted");
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
      // Save broker credentials to the database with status 'connected'
      const { error } = await supabase
        .from('broker_credentials')
        .insert({
          user_id: user.id,
          broker_id: selectedBroker.id,
          broker_name: selectedBroker.name,
          // Store all credential fields correctly, but leave accesstoken empty
          username: credentials.username,
          password: credentials.password,
          // No value for accesstoken means it will be NULL
          api_key: credentials.apiKey,
          secret_key: credentials.secretKey,
          two_factor_secret: credentials.twoFactorSecret,
          session_id: credentials.sessionId,
          status: 'connected'
        });

      if (error) {
        console.error("Error saving broker credentials:", error);
        toast.error("Failed to save broker credentials");
        setIsSubmitting(false);
        return;
      }

      console.log("Broker connected successfully:", selectedBroker.name);
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
    toast.success(`Your broker ${selectedBroker.name} has been connected successfully`);
    navigate('/'); // Navigate to home page
  };

  const handleBack = () => {
    if (connectionStep === "credentials") {
      navigate("/broker-integration");
    } else if (connectionStep === "settings") {
      setConnectionStep("credentials");
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
