import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, HelpCircle, Search, ChevronRight, Shield, Key, Lock, User, ExternalLink, Check, X, Settings, Plug, Info } from "lucide-react";
import { toast } from "sonner";

const BrokerIntegration = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrokerId, setSelectedBrokerId] = useState<number | null>(null);
  const [connectionStep, setConnectionStep] = useState<"selection" | "credentials" | "verification" | "settings" | "success">("selection");
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    apiKey: "",
    twoFactorSecret: "",
    twoFactorCode: ""
  });
  const [showApiFields, setShowApiFields] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [permissions, setPermissions] = useState({
    readOnly: true,
    trading: false
  });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const brokers = [
    {
      id: 1,
      name: "Zerodha",
      description: "Most popular in India",
      logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg",
      supportedAssets: ["Stocks", "Options", "Futures", "Commodities"],
      fees: "₹0 for equity delivery, ₹20 per order for intraday",
      apiRequired: true
    },
    {
      id: 2,
      name: "Angel One",
      description: "Recommended",
      logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
      supportedAssets: ["Stocks", "Options", "Futures", "Commodities", "Currencies"],
      fees: "₹20 per order flat fee structure",
      apiRequired: true
    },
    {
      id: 3,
      name: "ICICI Direct",
      description: "Bank-backed broker",
      logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg",
      supportedAssets: ["Stocks", "Options", "Futures", "Mutual Funds"],
      fees: "0.275% for delivery, 0.05% for intraday",
      apiRequired: false
    },
    {
      id: 4,
      name: "Upstox",
      description: "Low brokerage fees",
      logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg",
      supportedAssets: ["Stocks", "Options", "Futures", "Commodities"],
      fees: "₹20 per order or 0.05% (whichever is lower)",
      apiRequired: true
    },
    {
      id: 5,
      name: "Aliceblue",
      description: "Advanced trading tools",
      logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg",
      supportedAssets: ["Stocks", "Options", "Futures", "Commodities", "Currencies"],
      fees: "₹15 per order flat fee structure",
      apiRequired: true
    },
    {
      id: 6,
      name: "Angelone",
      description: "Comprehensive trading platform",
      logo: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg",
      supportedAssets: ["Stocks", "Options", "Futures", "Commodities", "Currencies"],
      fees: "₹20 per order flat fee structure",
      apiRequired: true
    }
  ];

  const filteredBrokers = brokers.filter(broker => 
    broker.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedBroker = selectedBrokerId ? brokers.find(b => b.id === selectedBrokerId) : null;

  const accountTypes = [
    "Individual Trading Account",
    "Joint Trading Account",
    "Corporate Account",
    "Trust Account",
    "Demat Account"
  ];

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

  const renderBrokerSelection = () => (
    <section className="mb-6">
      <h1 className="text-2xl font-bold mb-4">Connect Your Broker</h1>
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search brokers" 
          className="w-full h-12 bg-gray-800/50 rounded-xl pl-10 pr-4 border border-gray-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-gray-100"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
      </div>
      
      <div className="mt-4 space-y-3">
        {filteredBrokers.length > 0 ? (
          filteredBrokers.map(broker => (
            <div 
              key={broker.id}
              className="flex items-center p-4 bg-gray-800/30 rounded-xl border border-gray-700 cursor-pointer hover:border-pink-500 transition-colors"
              onClick={() => handleSelectBroker(broker.id)}
            >
              <img 
                src={broker.logo} 
                className="w-10 h-10 rounded-lg" 
                alt={broker.name} 
              />
              <div className="ml-3">
                <h3 className="font-semibold">{broker.name}</h3>
                <p className="text-sm text-gray-400">{broker.description}</p>
              </div>
              <ChevronRight className="ml-auto w-5 h-5 text-gray-500" />
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No brokers found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </section>
  );

  const renderCredentialsForm = () => (
    <section className="mb-6">
      <div className="flex items-center mb-4">
        <button onClick={handleReset} className="mr-3 p-2 rounded-full hover:bg-gray-800">
          <ChevronLeft className="w-5 h-5 text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold">Broker Credentials</h1>
      </div>

      {selectedBroker && (
        <div className="mb-6 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
          <div className="flex items-center">
            <img src={selectedBroker.logo} className="w-12 h-12 rounded-lg" alt={selectedBroker.name} />
            <div className="ml-3">
              <h3 className="font-semibold text-lg">{selectedBroker.name}</h3>
              <p className="text-sm text-gray-400">{selectedBroker.description}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-400">Supported Assets:</p>
              <p>{selectedBroker.supportedAssets.join(", ")}</p>
            </div>
            <div>
              <p className="text-gray-400">Fee Structure:</p>
              <p>{selectedBroker.fees}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="username" className="text-gray-300 flex items-center gap-2">
            <User className="w-4 h-4" /> Username / Account ID
          </Label>
          <Input 
            id="username"
            type="text"
            placeholder="Enter your broker username"
            className="mt-1 bg-gray-800/50 border-gray-700 text-gray-100"
            value={credentials.username}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-gray-300 flex items-center gap-2">
            <Lock className="w-4 h-4" /> Password
          </Label>
          <Input 
            id="password"
            type="password"
            placeholder="Enter your broker password"
            className="mt-1 bg-gray-800/50 border-gray-700 text-gray-100"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          />
        </div>

        {showApiFields && (
          <>
            <div>
              <Label htmlFor="apiKey" className="text-gray-300 flex items-center gap-2">
                <Key className="w-4 h-4" /> API Key
              </Label>
              <Input 
                id="apiKey"
                type="text"
                placeholder="Enter your API key"
                className="mt-1 bg-gray-800/50 border-gray-700 text-gray-100"
                value={credentials.apiKey}
                onChange={(e) => setCredentials({...credentials, apiKey: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="twoFactorSecret" className="text-gray-300 flex items-center gap-2">
                <Shield className="w-4 h-4" /> 2FA Secret
              </Label>
              <Input 
                id="twoFactorSecret"
                type="password"
                placeholder="Enter your 2FA secret"
                className="mt-1 bg-gray-800/50 border-gray-700 text-gray-100"
                value={credentials.twoFactorSecret}
                onChange={(e) => setCredentials({...credentials, twoFactorSecret: e.target.value})}
              />
            </div>
          </>
        )}
      </div>

      <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-4 mt-6">
        <div className="flex items-center">
          <Shield className="w-5 h-5 text-pink-500 mr-2" />
          <div>
            <h4 className="font-medium text-white">Security Assurance</h4>
            <p className="text-sm text-gray-300 mt-1">
              Your credentials are securely encrypted and never stored on our servers. We use industry-standard encryption to protect your information.
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  const renderVerificationForm = () => (
    <section className="mb-6">
      <div className="flex items-center mb-4">
        <button onClick={() => setConnectionStep("credentials")} className="mr-3 p-2 rounded-full hover:bg-gray-800">
          <ChevronLeft className="w-5 h-5 text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold">Verification</h1>
      </div>

      <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-5 mb-5">
        <h3 className="font-semibold mb-3">Two-Factor Authentication</h3>
        <p className="text-gray-400 text-sm mb-4">
          Enter the verification code sent to your mobile device or generated by your authenticator app.
        </p>

        <div>
          <Label htmlFor="twoFactorCode" className="text-gray-300">Verification Code</Label>
          <Input 
            id="twoFactorCode"
            type="text"
            placeholder="Enter 6-digit code"
            className="mt-1 bg-gray-800/50 border-gray-700 text-gray-100"
            value={credentials.twoFactorCode}
            onChange={(e) => setCredentials({...credentials, twoFactorCode: e.target.value})}
          />
        </div>

        <button 
          className="text-pink-500 text-sm mt-3 flex items-center"
          onClick={() => toast.info("New verification code sent")}
        >
          <Info className="w-4 h-4 mr-1" /> Resend verification code
        </button>
      </div>

      <div className="pt-2">
        <div className="flex items-center">
          <Info className="w-5 h-5 text-gray-400 mr-2" />
          <p className="text-sm text-gray-400">
            For testing, you can leave the code blank or use "123456"
          </p>
        </div>
      </div>
    </section>
  );

  const renderAccountSettings = () => (
    <section className="mb-6">
      <div className="flex items-center mb-4">
        <button onClick={() => setConnectionStep("verification")} className="mr-3 p-2 rounded-full hover:bg-gray-800">
          <ChevronLeft className="w-5 h-5 text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold">Account Settings</h1>
      </div>

      <div className="space-y-5">
        <div>
          <Label htmlFor="accountType" className="text-gray-300 flex items-center gap-2">
            <Settings className="w-4 h-4" /> Select Account Type
          </Label>
          <Select 
            value={selectedAccount}
            onValueChange={setSelectedAccount}
          >
            <SelectTrigger className="mt-1 bg-gray-800/50 border-gray-700 text-gray-100">
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
              {accountTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-5">
          <h3 className="font-semibold mb-4">Trading Permissions</h3>
          
          <div className="flex items-start mb-3">
            <div className="flex items-center h-5 mt-1">
              <Checkbox 
                id="readOnly" 
                checked={permissions.readOnly}
                onCheckedChange={(checked) => 
                  setPermissions({...permissions, readOnly: checked === true})
                }
              />
            </div>
            <div className="ml-3">
              <Label htmlFor="readOnly" className="text-gray-200">Read-only access</Label>
              <p className="text-xs text-gray-400">
                View positions, orders, and account information without making changes
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5 mt-1">
              <Checkbox 
                id="trading" 
                checked={permissions.trading}
                onCheckedChange={(checked) => 
                  setPermissions({...permissions, trading: checked === true})
                }
              />
            </div>
            <div className="ml-3">
              <Label htmlFor="trading" className="text-gray-200">Trading access</Label>
              <p className="text-xs text-gray-400">
                Allow the application to place orders and modify positions on your behalf
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-900/20 rounded-xl border border-yellow-800/50 p-4">
          <div className="flex">
            <Info className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-500">Important Disclaimer</h4>
              <p className="text-sm text-gray-300 mt-1">
                By enabling trading access, you authorize BestAlgo to place orders through your broker on your behalf.
                You remain responsible for all activity in your account.
              </p>
              <a 
                href="#" 
                className="text-pink-500 text-sm mt-2 flex items-center"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info("Terms and conditions would open here");
                }}
              >
                <ExternalLink className="w-3 h-3 mr-1" /> Read full terms and conditions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderCurrentStep = () => {
    switch (connectionStep) {
      case "selection":
        return renderBrokerSelection();
      case "credentials":
        return renderCredentialsForm();
      case "verification":
        return renderVerificationForm();
      case "settings":
        return renderAccountSettings();
      case "success":
        return renderBrokerSelection();
      default:
        return renderBrokerSelection();
    }
  };

  const renderActionButtons = () => {
    switch (connectionStep) {
      case "selection":
        return (
          <>
            <Button 
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl font-semibold"
              disabled={true}
            >
              Continue
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-12 border border-gray-700 bg-transparent text-white rounded-xl font-semibold"
              onClick={() => navigate('/settings')}
            >
              Cancel
            </Button>
          </>
        );
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
              onClick={handleReset}
            >
              Cancel
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
              onClick={() => setConnectionStep("credentials")}
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
              onClick={() => setConnectionStep("verification")}
            >
              Back
            </Button>
          </>
        );
      default:
        return (
          <>
            <Button 
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl font-semibold"
              onClick={() => navigate('/settings')}
            >
              Continue
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-12 border border-gray-700 bg-transparent text-white rounded-xl font-semibold"
              onClick={() => navigate('/settings')}
            >
              Cancel
            </Button>
          </>
        );
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
          {renderActionButtons()}
        </div>
      </section>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              Broker Connected Successfully
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Your {selectedBroker?.name} account has been successfully connected.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-gray-900 rounded-lg p-4 mt-2">
            <div className="flex items-center mb-3">
              {selectedBroker && (
                <img src={selectedBroker.logo} className="w-8 h-8 rounded-md mr-3" alt={selectedBroker.name} />
              )}
              <div>
                <h4 className="font-medium">{selectedBroker?.name}</h4>
                <p className="text-sm text-gray-400">{selectedAccount}</p>
              </div>
              <div className="ml-auto flex items-center">
                <span className="bg-green-900/50 text-green-500 text-xs px-2 py-1 rounded">Connected</span>
              </div>
            </div>
            
            <div className="text-sm text-gray-400">
              <p className="flex items-center gap-1">
                <Plug className="w-3 h-3" /> Connection established at {new Date().toLocaleTimeString()}
              </p>
              <p className="flex items-center gap-1 mt-1">
                <Shield className="w-3 h-3" /> {permissions.trading ? "Trading access granted" : "Read-only access granted"}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-3">
            <Button 
              className="bg-gradient-to-r from-purple-600 to-pink-500"
              onClick={handleComplete}
            >
              Continue to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrokerIntegration;
