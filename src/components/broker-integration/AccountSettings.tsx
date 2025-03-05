
import { ChevronLeft, Settings, Info, ExternalLink } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { BrokerPermissions } from "@/types/broker";

interface AccountSettingsProps {
  selectedAccount: string;
  setSelectedAccount: (account: string) => void;
  permissions: BrokerPermissions;
  setPermissions: (permissions: BrokerPermissions) => void;
  accountTypes: string[];
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

      <div className="space-y-5">
        <div>
          <Label htmlFor="accountType" className="text-gray-300 flex items-center gap-2">
            <Settings className="w-4 h-4" /> Select Account Type
          </Label>
          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
            <SelectTrigger className="mt-1 bg-gray-800/50 border-gray-700 text-gray-100">
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
              {accountTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
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
                  setPermissions({ ...permissions, readOnly: checked === true })
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
                  setPermissions({ ...permissions, trading: checked === true })
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
};
