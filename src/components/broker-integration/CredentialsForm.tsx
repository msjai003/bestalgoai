
import { ChevronLeft, User, Lock, Key, Shield, Hash, KeyRound, FileKey } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Broker, BrokerCredentials } from "@/types/broker";
import { useBrokerFields } from "@/hooks/useBrokerFields";
import { Loader2 } from "lucide-react";

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
  const { fields, isLoading, error } = useBrokerFields(selectedBroker?.id || null);

  const getIconForField = (fieldName: string) => {
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
        return <Shield className="w-4 h-4" />;
      case 'sessionId':
        return <Hash className="w-4 h-4" />;
      case 'twoFactorCode':
        return <KeyRound className="w-4 h-4" />;
      default:
        return <Key className="w-4 h-4" />;
    }
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setCredentials({ ...credentials, [fieldName]: value });
  };

  const renderFields = () => {
    // Filter fields based on whether they're API fields and the showApiFields prop
    const filteredFields = fields.filter(field => {
      // ApiKey fields and similar should only show when showApiFields is true
      const isApiField = field.field_name === 'apiKey' || 
                         field.field_name === 'secretKey' || 
                         field.field_name === 'twoFactorSecret';
      
      return isApiField ? showApiFields : true;
    });

    return filteredFields.map(field => (
      <div key={field.id}>
        <Label htmlFor={field.field_name} className="text-gray-300 flex items-center gap-2">
          {getIconForField(field.field_name)} {field.display_name}
          {field.is_required && <span className="text-red-500">*</span>}
        </Label>
        <Input
          id={field.field_name}
          type={field.field_type}
          placeholder={field.placeholder || `Enter your ${field.display_name.toLowerCase()}`}
          className="mt-1 bg-gray-800/50 border-gray-700 text-gray-100"
          value={credentials[field.field_name] || ''}
          onChange={(e) => handleFieldChange(field.field_name, e.target.value)}
          required={field.is_required}
        />
        {field.field_name === 'username' && (
          <p className="text-gray-400 text-xs mt-1">
            This will be used to connect to your broker's API.
          </p>
        )}
      </div>
    ));
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
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2">Loading input fields...</span>
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 border border-red-500 rounded-md">
            Error loading broker fields: {error}
          </div>
        ) : (
          renderFields()
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
