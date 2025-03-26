
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CredentialsForm } from "@/components/broker-integration/CredentialsForm";
import { AccountSettings } from "@/components/broker-integration/AccountSettings";
import { SuccessDialog } from "@/components/broker-integration/SuccessDialog";
import { BrokerHeader } from "@/components/broker-integration/BrokerHeader";
import { ConnectionStepActions } from "@/components/broker-integration/ConnectionStepActions";
import { BrokerFunctions } from "@/components/broker-integration/BrokerFunctions";
import { useBrokerConnection } from "@/hooks/useBrokerConnection";
import { brokers, accountTypes } from "@/components/broker-integration/BrokerData";
import { Skeleton } from "@/components/ui/skeleton";

const BrokerCredentials = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { brokerId } = location.state || {};
  
  const selectedBroker = brokerId ? brokers.find(b => b.id === brokerId) : null;
  const showApiFields = selectedBroker?.apiRequired || false;

  // Redirect if no broker was selected
  useEffect(() => {
    if (!selectedBroker) {
      navigate("/broker-integration");
    }
  }, [selectedBroker, navigate]);

  const {
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
    isLoading
  } = useBrokerConnection(selectedBroker);

  if (!selectedBroker) {
    return null; // Will redirect in useEffect
  }

  const renderCurrentStep = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      );
    }
    
    switch (connectionStep) {
      case "credentials":
        return (
          <div>
            <CredentialsForm
              selectedBroker={selectedBroker}
              credentials={credentials}
              setCredentials={setCredentials}
              showApiFields={showApiFields}
              onBack={handleBack}
              isConnected={isConnected}
            />
            
            {selectedBroker && (
              <div className="mt-8">
                <BrokerFunctions 
                  brokerId={selectedBroker.id} 
                  brokerName={selectedBroker.name} 
                />
              </div>
            )}
          </div>
        );
      case "settings":
        return (
          <AccountSettings
            selectedAccount={selectedAccount}
            setSelectedAccount={setSelectedAccount}
            permissions={permissions}
            setPermissions={setPermissions}
            accountTypes={accountTypes}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  const handleStepSubmit = () => {
    switch (connectionStep) {
      case "credentials":
        handleCredentialsSubmit();
        break;
      case "settings":
        handleSettingsSubmit();
        break;
    }
  };

  // Customize button text based on connection status
  const getActionButtonText = () => {
    if (isConnected) {
      return "Update Credentials";
    }
    
    switch (connectionStep) {
      case "credentials":
        return "Continue";
      case "settings":
        return "Connect Broker";
      default:
        return "Continue";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <BrokerHeader 
        onBack={handleBack} 
        title={isConnected ? "Edit Broker Connection" : "Connect Your Broker"} 
      />

      <main className="pt-20 px-4 pb-24">
        {renderCurrentStep()}
      </main>

      <section className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
        <div className="flex flex-col gap-3">
          <button
            className="w-full h-12 bg-gradient-to-r from-cyan to-cyan/80 text-charcoalPrimary rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleStepSubmit}
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? "Processing..." : getActionButtonText()}
          </button>
          
          <button
            className="w-full h-12 border border-charcoalSecondary bg-transparent text-charcoalTextPrimary rounded-xl font-semibold"
            onClick={handleBack}
            disabled={isSubmitting || isLoading}
          >
            Cancel
          </button>
        </div>
      </section>

      <SuccessDialog
        open={showSuccessDialog}
        setOpen={setShowSuccessDialog}
        selectedBroker={selectedBroker}
        selectedAccount={selectedAccount}
        permissions={permissions}
        onComplete={handleComplete}
      />
    </div>
  );
};

export default BrokerCredentials;
