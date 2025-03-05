
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { BrokerList } from "@/components/broker-integration/BrokerList";
import { CredentialsForm } from "@/components/broker-integration/CredentialsForm";
import { VerificationForm } from "@/components/broker-integration/VerificationForm";
import { AccountSettings } from "@/components/broker-integration/AccountSettings";
import { SuccessDialog } from "@/components/broker-integration/SuccessDialog";
import { ActionButtons } from "@/components/broker-integration/ActionButtons";
import { brokers, accountTypes } from "@/components/broker-integration/BrokerData";
import { ConnectionStep, BrokerCredentials, BrokerPermissions } from "@/types/broker";

const BrokerIntegration = () => {
  const navigate = useNavigate();
  const [selectedBrokerId, setSelectedBrokerId] = useState<number | null>(null);
  const [connectionStep, setConnectionStep] = useState<ConnectionStep>("selection");
  const [credentials, setCredentials] = useState<BrokerCredentials>({
    username: "",
    password: "",
    apiKey: "",
    twoFactorSecret: "",
    twoFactorCode: ""
  });
  const [showApiFields, setShowApiFields] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [permissions, setPermissions] = useState<BrokerPermissions>({
    readOnly: true,
    trading: false
  });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const selectedBroker = selectedBrokerId ? brokers.find(b => b.id === selectedBrokerId) : null;

  const handleSelectBroker = (brokerId: number) => {
    setSelectedBrokerId(brokerId);
    const broker = brokers.find(b => b.id === brokerId);
    setShowApiFields(broker?.apiRequired || false);
    setConnectionStep("credentials");
  };

  const handleCredentialsSubmit = () => {
    if (!credentials.username || !credentials.password) {
      toast.error("Please enter your username and password");
      return;
    }

    if (showApiFields && (!credentials.apiKey || !credentials.twoFactorSecret)) {
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
    toast.success(`${selectedBroker?.name} broker connected successfully`);
    navigate('/dashboard');
  };

  const handleReset = () => {
    setSelectedBrokerId(null);
    setConnectionStep("selection");
    setCredentials({
      username: "",
      password: "",
      apiKey: "",
      twoFactorSecret: "",
      twoFactorCode: ""
    });
    setShowApiFields(false);
    setSelectedAccount("");
    setPermissions({
      readOnly: true,
      trading: false
    });
  };

  const renderCurrentStep = () => {
    switch (connectionStep) {
      case "selection":
        return <BrokerList brokers={brokers} onSelectBroker={handleSelectBroker} />;
      case "credentials":
        return (
          <CredentialsForm
            selectedBroker={selectedBroker}
            credentials={credentials}
            setCredentials={setCredentials}
            showApiFields={showApiFields}
            onBack={handleReset}
          />
        );
      case "verification":
        return (
          <VerificationForm
            credentials={credentials}
            setCredentials={setCredentials}
            onBack={() => setConnectionStep("credentials")}
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
            onBack={() => setConnectionStep("verification")}
          />
        );
      case "success":
        return <BrokerList brokers={brokers} onSelectBroker={handleSelectBroker} />;
      default:
        return <BrokerList brokers={brokers} onSelectBroker={handleSelectBroker} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Button 
            variant="ghost" 
            className="p-2"
            onClick={() => navigate('/settings')}
          >
            <ChevronLeft className="w-5 h-5 text-gray-300" />
          </Button>
          <h1 className="text-lg font-semibold">Connect Your Broker</h1>
          <Button variant="ghost" className="p-2">
            <HelpCircle className="w-5 h-5 text-gray-300" />
          </Button>
        </div>
      </header>

      <main className="pt-20 px-4 pb-24">
        {renderCurrentStep()}
      </main>

      <section className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
        <div className="flex flex-col gap-3">
          <ActionButtons
            connectionStep={connectionStep}
            handleCredentialsSubmit={handleCredentialsSubmit}
            handleSettingsSubmit={handleSettingsSubmit}
            handleReset={handleReset}
            navigate={navigate}
            setConnectionStep={setConnectionStep}
          />
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

export default BrokerIntegration;
