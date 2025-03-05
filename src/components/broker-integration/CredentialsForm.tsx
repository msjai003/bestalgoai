
import { ChevronLeft, User, Lock, Key, Shield } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Broker } from "@/types/broker";
import { BrokerCredentials } from "@/types/broker";

interface CredentialsFormProps {
  selectedBroker: Broker | null;
  credentials: BrokerCredentials;
  setCredentials: (credentials: BrokerCredentials) => void;
  showApiFields: boolean;
  onBack: () => void;
}

export const CredentialsForm = ({
  selectedBroker,
  credentials,
  setCredentials,
  showApiFields,
  onBack,
}: CredentialsFormProps) => {
  return (
    <section className="mb-6">
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="mr-3 p-2 rounded-full hover:bg-gray-800">
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
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
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
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
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
                onChange={(e) => setCredentials({ ...credentials, apiKey: e.target.value })}
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
                onChange={(e) =>
                  setCredentials({ ...credentials, twoFactorSecret: e.target.value })
                }
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
};
