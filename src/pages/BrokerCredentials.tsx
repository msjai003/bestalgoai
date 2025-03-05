
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CredentialsForm } from "@/components/broker-integration/CredentialsForm";
import { VerificationForm } from "@/components/broker-integration/VerificationForm";
import { AccountSettings } from "@/components/broker-integration/AccountSettings";
import { SuccessDialog } from "@/components/broker-integration/SuccessDialog";
import { BrokerHeader } from "@/components/broker-integration/BrokerHeader";
import { ConnectionStepActions } from "@/components/broker-integration/ConnectionStepActions";
import { useBrokerConnection } from "@/hooks/useBrokerConnection";
import { brokers, accountTypes } from "@/components/broker-integration/BrokerData";

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
    handleBack
  } = useBrokerConnection(selectedBroker);

  if (!selectedBroker) {
    return null; // Will redirect in useEffect
  }

  const renderCurrentStep = () => {
    switch (connectionStep) {
      case "credentials":
        return (
          <CredentialsForm
            selectedBroker={selectedBroker}
            credentials={credentials}
            setCredentials={setCredentials}
            showApiFields={showApiFields}
            onBack={handleBack}
          />
        );
      case "verification":
        return (
          <VerificationForm
            credentials={credentials}
            setCredentials={setCredentials}
            onBack={handleBack}
          />
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
      case "verification":
        handleCredentialsSubmit();
        break;
      case "settings":
        handleSettingsSubmit();
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <BrokerHeader 
        onBack={handleBack} 
        title="Connect Your Broker" 
      />

      <main className="pt-20 px-4 pb-24">
        {renderCurrentStep()}
      </main>

      <section className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
        <ConnectionStepActions 
          connectionStep={connectionStep}
          onSubmit={handleStepSubmit}
          onBack={handleBack}
        />
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
