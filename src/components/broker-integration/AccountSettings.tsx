
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, ChevronLeft, Shield } from "lucide-react";
import { BrokerPermissions } from "@/types/broker";
import { AccountType } from "./BrokerData";

interface AccountSettingsProps {
  selectedAccount: string;
  setSelectedAccount: (account: string) => void;
  permissions: BrokerPermissions;
  setPermissions: (permissions: BrokerPermissions) => void;
  accountTypes: AccountType[];
  onBack: () => void;
}

export const AccountSettings = ({
  selectedAccount,
  setSelectedAccount,
  permissions,
  setPermissions,
  accountTypes,
  onBack,
}: AccountSettingsProps) => {
  return (
    <section className="mb-6">
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="mr-3 p-2 rounded-full hover:bg-gray-800">
          <ChevronLeft className="w-5 h-5 text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold">Account Settings</h1>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium mb-3">Select Account Type</h2>
          <RadioGroup
            value={selectedAccount}
            onValueChange={setSelectedAccount}
            className="space-y-2"
          >
            {accountTypes.map((account) => (
              <div
                key={account.value}
                className={`flex items-center p-3 rounded-lg border ${
                  selectedAccount === account.value
                    ? "border-pink-500 bg-pink-500/10"
                    : "border-gray-700 bg-gray-800/30"
                }`}
              >
                <RadioGroupItem
                  value={account.value}
                  id={account.value}
                  className="sr-only"
                />
                <Label
                  htmlFor={account.value}
                  className="flex items-center justify-between w-full cursor-pointer"
                >
                  <span>{account.label}</span>
                  {selectedAccount === account.value && (
                    <Check className="w-4 h-4 text-pink-500" />
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-3">Permissions</h2>
          <div className="space-y-2">
            <div
              className={`flex items-center p-3 rounded-lg border ${
                permissions.readOnly
                  ? "border-pink-500 bg-pink-500/10"
                  : "border-gray-700 bg-gray-800/30"
              } cursor-pointer`}
              onClick={() =>
                setPermissions({ readOnly: true, trading: false })
              }
            >
              <Shield className="w-5 h-5 mr-3 text-gray-400" />
              <div className="flex-1">
                <h3 className="font-medium">Read-Only Access</h3>
                <p className="text-sm text-gray-400">
                  Only allow viewing your portfolio and market data
                </p>
              </div>
              {permissions.readOnly && <Check className="w-4 h-4 text-pink-500" />}
            </div>

            <div
              className={`flex items-center p-3 rounded-lg border ${
                permissions.trading
                  ? "border-pink-500 bg-pink-500/10"
                  : "border-gray-700 bg-gray-800/30"
              } cursor-pointer`}
              onClick={() =>
                setPermissions({ readOnly: false, trading: true })
              }
            >
              <Shield className="w-5 h-5 mr-3 text-emerald-500" />
              <div className="flex-1">
                <h3 className="font-medium">Full Trading Access</h3>
                <p className="text-sm text-gray-400">
                  Allow automated trading and order placement
                </p>
              </div>
              {permissions.trading && <Check className="w-4 h-4 text-pink-500" />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
