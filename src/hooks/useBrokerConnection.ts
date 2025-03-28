
import { useState, useEffect } from "react";
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
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [productType, setProductType] = useState("qwedhidnqin213"); // Add state for product type with default value

  // Load existing broker credentials if available
  useEffect(() => {
    const loadBrokerCredentials = async () => {
      if (!user || !selectedBroker) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('broker_credentials')
          .select('*')
          .eq('user_id', user.id)
          .eq('broker_id', selectedBroker.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching broker credentials:", error);
          toast.error("Failed to load broker details");
          setIsLoading(false);
          return;
        }

        if (data) {
          // Broker is already connected
          setIsConnected(data.status === 'connected');
          
          // Populate credentials with existing data
          setCredentials({
            username: data.username || "",
            password: data.password || "",
            apiKey: data.api_key || "",
            secretKey: data.secret_key || "",
            accessToken: data.accesstoken || "",
            twoFactorSecret: data.two_factor_secret || "",
            twoFactorCode: "",
            sessionId: data.session_id || ""
          });
          
          // Set product type if available
          if (data.product_type) {
            setProductType(data.product_type);
          }
        }
      } catch (error) {
        console.error("Exception fetching broker credentials:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBrokerCredentials();
  }, [user, selectedBroker]);

  const handleCredentialsSubmit = async () => {
    if (!credentials.username) {
      toast.error("Please enter your username");
      return;
    }

    if (!credentials.password) {
      toast.error("Please enter your password");
      return;
    }

    // If we're editing existing credentials, update them directly
    if (isConnected) {
      await updateBrokerCredentials();
      return;
    }

    // Move to settings without generating an access token
    setConnectionStep("settings");
    toast.success("Credentials accepted");
  };

  const updateBrokerCredentials = async () => {
    if (!user || !selectedBroker) {
      toast.error("User or broker information missing");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('broker_credentials')
        .update({
          username: credentials.username,
          password: credentials.password,
          api_key: credentials.apiKey,
          secret_key: credentials.secretKey,
          two_factor_secret: credentials.twoFactorSecret,
          session_id: credentials.sessionId,
          product_type: productType, // Include product type in update
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('broker_id', selectedBroker.id);

      if (error) {
        console.error("Error updating broker credentials:", error);
        toast.error("Failed to update broker credentials");
        setIsSubmitting(false);
        return;
      }

      toast.success("Broker credentials updated successfully");
      navigate('/settings');
    } catch (error) {
      console.error("Exception updating broker credentials:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
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
          accesstoken: "valid", // Set default value "valid" for access token
          api_key: credentials.apiKey,
          secret_key: credentials.secretKey,
          two_factor_secret: credentials.twoFactorSecret,
          session_id: credentials.sessionId,
          product_type: productType, // Include product type
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
    isSubmitting,
    isConnected,
    isLoading,
    productType,
    setProductType // Export the product type state and setter
  };
};
