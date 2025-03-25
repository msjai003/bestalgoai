
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

    // Auto-generate an access token from username and password
    // This keeps the access token concept in the backend without exposing it in UI
    const generatedToken = `${credentials.username}_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    
    // Update the accessToken in the credentials state
    setCredentials(prev => ({
      ...prev,
      accessToken: generatedToken
    }));

    // Move to settings
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
      // Prepare the credentials data for saving
      const credentialsData = {
        user_id: user.id,
        broker_id: selectedBroker.id,
        broker_name: selectedBroker.name,
        username: credentials.username,
        password: credentials.password,
        accesstoken: credentials.accessToken
      };

      // Add optional fields if they have values
      if (credentials.apiKey) credentialsData['api_key'] = credentials.apiKey;
      if (credentials.secretKey) credentialsData['secret_key'] = credentials.secretKey;
      if (credentials.twoFactorSecret) credentialsData['two_factor_secret'] = credentials.twoFactorSecret;
      if (credentials.sessionId) credentialsData['session_id'] = credentials.sessionId;

      // Save broker credentials to the database with status 'connected'
      const { data, error } = await supabase
        .from('broker_credentials')
        .insert({
          ...credentialsData,
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
