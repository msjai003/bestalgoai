
import { ChevronLeft, User, Lock, Key, Shield, Hash, KeyRound, FileKey, Eye, EyeOff, Package } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Broker } from "@/types/broker";
import { BrokerCredentials } from "@/types/broker";
import { Button } from "@/components/ui/button";

interface CredentialsFormProps {
  selectedBroker: Broker | null;
  credentials: BrokerCredentials;
  setCredentials: (credentials: BrokerCredentials) => void;
  showApiFields: boolean;
  onBack: () => void;
  isConnected?: boolean;
  productType?: string;
  setProductType?: (value: string) => void;
}

export const CredentialsForm = ({
  selectedBroker,
  credentials,
  setCredentials,
  showApiFields,
  onBack,
  isConnected = false,
  productType = "qwedhidnqin213",
  setProductType,
}: CredentialsFormProps) => {
  // Helper function to update a specific credential
  const updateCredential = (field: keyof BrokerCredentials, value: string) => {
    setCredentials({ ...credentials, [field]: value });
  };

  // State to track visibility of sensitive fields
  const [fieldVisibility, setFieldVisibility] = useState({
    password: false,
    apiKey: false,
    secretKey: false,
    twoFactorSecret: false,
    sessionId: false,
    productType: false,
  });

  // Toggle field visibility
  const toggleFieldVisibility = (field: string) => {
    setFieldVisibility({
      ...fieldVisibility,
      [field]: !fieldVisibility[field as keyof typeof fieldVisibility],
    });
  };

  // Mask sensitive data
  const maskValue = (value: string) => {
    if (!value) return "";
    return value.length > 8 
      ? `${value.substring(0, 2)}${"X".repeat(value.length - 4)}${value.substring(value.length - 2)}`
      : "X".repeat(value.length);
  };

  return (
    <section className="mb-6">
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="mr-3 p-2 rounded-full hover:bg-gray-800">
          <ChevronLeft className="w-5 h-5 text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold">
          {isConnected ? "Broker Credentials" : "Enter Broker Credentials"}
        </h1>
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
              <p>{selectedBroker.supportedAssets?.join(", ") || "Not specified"}</p>
            </div>
            <div>
              <p className="text-gray-400">Fee Structure:</p>
              <p>{selectedBroker.fees || "Not specified"}</p>
            </div>
          </div>
        </div>
      )}

      {isConnected && (
        <div className="mb-6 p-3 bg-green-900/20 border border-green-600/30 rounded-lg">
          <p className="text-green-400 flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Broker already connected. You can view or edit your credentials.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {/* Username and Password - Required by database schema */}
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
            onChange={(e) => updateCredential('username', e.target.value)}
          />
          <p className="text-gray-400 text-xs mt-1">
            This will be used to connect to your broker's API.
          </p>
        </div>

        <div>
          <Label htmlFor="password" className="text-gray-300 flex items-center gap-2">
            <Lock className="w-4 h-4" /> Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={fieldVisibility.password ? "text" : "password"}
              placeholder="Enter your broker password"
              className="mt-1 bg-gray-800/50 border-gray-700 text-gray-100 pr-10"
              value={credentials.password}
              onChange={(e) => updateCredential('password', e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-8 w-8 p-0"
              onClick={() => toggleFieldVisibility('password')}
            >
              {fieldVisibility.password ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle password visibility</span>
            </Button>
          </div>
        </div>

        {/* Product Type Field */}
        <div>
          <Label htmlFor="productType" className="text-gray-300 flex items-center gap-2">
            <Package className="w-4 h-4" /> Product Type
          </Label>
          <div className="relative">
            <Input
              id="productType"
              type={fieldVisibility.productType ? "text" : "password"}
              placeholder="Enter product type"
              className="mt-1 bg-gray-800/50 border-gray-700 text-gray-100 pr-10"
              value={productType}
              onChange={(e) => setProductType && setProductType(e.target.value)}
              readOnly={!setProductType}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-8 w-8 p-0"
              onClick={() => toggleFieldVisibility('productType')}
            >
              {fieldVisibility.productType ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle product type visibility</span>
            </Button>
          </div>
          <p className="text-gray-400 text-xs mt-1">
            Product type associated with this broker account.
          </p>
        </div>

        <div>
          <Label htmlFor="sessionId" className="text-gray-300 flex items-center gap-2">
            <Hash className="w-4 h-4" /> Session ID
          </Label>
          <div className="relative">
            <Input
              id="sessionId"
              type={fieldVisibility.sessionId ? "text" : "password"}
              placeholder="Enter your session ID"
              className="mt-1 bg-gray-800/50 border-gray-700 text-gray-100 pr-10"
              value={credentials.sessionId}
              onChange={(e) => updateCredential('sessionId', e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-8 w-8 p-0"
              onClick={() => toggleFieldVisibility('sessionId')}
            >
              {fieldVisibility.sessionId ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle session ID visibility</span>
            </Button>
          </div>
        </div>

        {showApiFields && (
          <>
            <div>
              <Label htmlFor="apiKey" className="text-gray-300 flex items-center gap-2">
                <Key className="w-4 h-4" /> API Key
              </Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={fieldVisibility.apiKey ? "text" : "password"}
                  placeholder="Enter your API key"
                  className="mt-1 bg-gray-800/50 border-gray-700 text-gray-100 pr-10"
                  value={credentials.apiKey}
                  onChange={(e) => updateCredential('apiKey', e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() => toggleFieldVisibility('apiKey')}
                >
                  {fieldVisibility.apiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">Toggle API key visibility</span>
                </Button>
              </div>
            </div>

            {/* Show Secret Key only for brokers that require it */}
            {selectedBroker?.requiresSecretKey && (
              <div>
                <Label htmlFor="secretKey" className="text-gray-300 flex items-center gap-2">
                  <FileKey className="w-4 h-4" /> Secret Key
                </Label>
                <div className="relative">
                  <Input
                    id="secretKey"
                    type={fieldVisibility.secretKey ? "text" : "password"}
                    placeholder="Enter your secret key"
                    className="mt-1 bg-gray-800/50 border-gray-700 text-gray-100 pr-10"
                    value={credentials.secretKey}
                    onChange={(e) => updateCredential('secretKey', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                    onClick={() => toggleFieldVisibility('secretKey')}
                  >
                    {fieldVisibility.secretKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">Toggle secret key visibility</span>
                  </Button>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="twoFactorSecret" className="text-gray-300 flex items-center gap-2">
                <Shield className="w-4 h-4" /> 2FA Secret
              </Label>
              <div className="relative">
                <Input
                  id="twoFactorSecret"
                  type={fieldVisibility.twoFactorSecret ? "text" : "password"}
                  placeholder="Enter your 2FA secret"
                  className="mt-1 bg-gray-800/50 border-gray-700 text-gray-100 pr-10"
                  value={credentials.twoFactorSecret}
                  onChange={(e) => updateCredential('twoFactorSecret', e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() => toggleFieldVisibility('twoFactorSecret')}
                >
                  {fieldVisibility.twoFactorSecret ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">Toggle 2FA secret visibility</span>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Security Notice */}
      <div className="mt-8 p-3 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg border border-pink-600/40 text-sm">
        <div className="flex items-center">
          <Shield className="w-5 h-5 text-pink-400 mr-2 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-white text-sm">YOUR SECURITY IS OUR PRIORITY</h3>
            <p className="text-xs text-gray-300 mt-1">
              Your credentials are <span className="font-medium text-pink-300">securely encrypted</span> using bank-level encryption.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
