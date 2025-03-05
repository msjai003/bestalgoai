
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { CredentialsForm } from "@/components/broker-integration/CredentialsForm";
import { VerificationForm } from "@/components/broker-integration/VerificationForm";
import { AccountSettings } from "@/components/broker-integration/AccountSettings";
import { SuccessDialog } from "@/components/broker-integration/SuccessDialog";
import { brokers, accountTypes } from "@/components/broker-integration/BrokerData";
import { ConnectionStep, BrokerCredentials as BrokerCredentialsType, BrokerPermissions } from "@/types/broker";
import { ChevronLeft, HelpCircle } from "lucide-react";

const BrokerCredentials = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { brokerId } = location.state || {};
  
  const [connectionStep, setConnectionStep] = useState<ConnectionStep>("credentials");
  const [credentials, setCredentials] = useState<BrokerCredentialsType>({
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

  const selectedBroker = brokerId ? brokers.find(b => b.id === brokerId) : null;
  const showApiFields = selectedBroker?.apiRequired || false;

  if (!selectedBroker) {
    // Redirect back to broker selection if no broker ID is provided
    navigate("/broker-integration");
    return null;
  }

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
    toast.success(`${selectedBroker.name} broker connected successfully`);
    navigate('/dashboard');
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

  const renderActionButtons = () => {
    switch (connectionStep) {
      case "credentials":
        return (
          <>
            <Button
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl font-semibold"
              onClick={handleCredentialsSubmit}
            >
              Continue to Verification
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 border border-gray-700 bg-transparent text-white rounded-xl font-semibold"
              onClick={handleBack}
            >
              Back to Broker Selection
            </Button>
          </>
        );
      case "verification":
        return (
          <>
            <Button
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl font-semibold"
              onClick={handleCredentialsSubmit}
            >
              Verify & Continue
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 border border-gray-700 bg-transparent text-white rounded-xl font-semibold"
              onClick={handleBack}
            >
              Back
            </Button>
          </>
        );
      case "settings":
        return (
          <>
            <Button
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl font-semibold"
              onClick={handleSettingsSubmit}
            >
              Connect Broker
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 border border-gray-700 bg-transparent text-white rounded-xl font-semibold"
              onClick={handleBack}
            >
              Back
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Button 
            variant="ghost" 
            className="p-2"
            onClick={handleBack}
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
          {renderActionButtons()}
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
