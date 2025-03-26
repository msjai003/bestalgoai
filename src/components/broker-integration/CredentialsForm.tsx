
import { ChevronLeft, User, Lock, Key, Shield, FileKey } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Broker } from "@/types/broker";
import { BrokerCredentials } from "@/types/broker";
import { useBrokerFields, BrokerField } from "@/hooks/useBrokerFields";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { fields, isLoading, error } = useBrokerFields(selectedBroker?.id);

  // Helper function to get the appropriate icon for a field
  const getFieldIcon = (fieldName: string) => {
    switch (fieldName) {
      case 'username':
        return <User className="w-4 h-4" />;
      case 'password':
        return <Lock className="w-4 h-4" />;
      case 'apiKey':
        return <Key className="w-4 h-4" />;
      case 'secretKey':
        return <FileKey className="w-4 h-4" />;
      case 'twoFactorSecret':
      case 'twoFactorCode':
        return <Shield className="w-4 h-4" />;
      default:
        return <Key className="w-4 h-4" />;
    }
  };

  // Handle credential change
  const handleCredentialChange = (field: BrokerField, value: string) => {
    setCredentials({
      ...credentials,
      [field.field_name]: value
    });
  };

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
        {isLoading ? (
          // Show skeletons while loading
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))
        ) : error ? (
          <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-300">
            <p>Error loading broker fields: {error}</p>
            <p className="text-sm mt-2">Please try again or use the standard form below.</p>
          </div>
        ) : fields.length > 0 ? (
          // Dynamic fields from database
          fields.map((field) => (
            <div key={field.id}>
              <Label htmlFor={field.field_name} className="text-gray-300 flex items-center gap-2">
                {getFieldIcon(field.field_name)} {field.display_name}
              </Label>
              <Input
                id={field.field_name}
                type={field.is_secret ? "password" : field.field_type}
                placeholder={field.placeholder || `Enter your ${field.display_name.toLowerCase()}`}
                className="mt-1 bg-gray-800/50 border-gray-700 text-gray-100"
                value={(credentials as any)[field.field_name] || ''}
                onChange={(e) => handleCredentialChange(field, e.target.value)}
                required={field.is_required}
              />
              {field.field_name === 'secretKey' && <p className="text-xs text-gray-400 mt-1">This will be stored securely.</p>}
            </div>
          ))
        ) : (
          // Fallback fields (original implementation)
          <>
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
              <p className="text-gray-400 text-xs mt-1">
                This will be used to connect to your broker's API.
              </p>
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

                {selectedBroker?.requiresSecretKey && (
                  <div>
                    <Label htmlFor="secretKey" className="text-gray-300 flex items-center gap-2">
                      <FileKey className="w-4 h-4" /> Secret Key
                    </Label>
                    <Input
                      id="secretKey"
                      type="password"
                      placeholder="Enter your secret key"
                      className="mt-1 bg-gray-800/50 border-gray-700 text-gray-100"
                      value={credentials.secretKey}
                      onChange={(e) => setCredentials({ ...credentials, secretKey: e.target.value })}
                    />
                  </div>
                )}
              </>
            )}
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
              Your credentials are <span className="font-medium text-pink-300">never stored</span> on our servers and are securely encrypted using bank-level encryption.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
