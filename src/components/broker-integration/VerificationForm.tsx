
import { ChevronLeft, Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { BrokerCredentials } from "@/types/broker";

interface VerificationFormProps {
  credentials: BrokerCredentials;
  setCredentials: (credentials: BrokerCredentials) => void;
  onBack: () => void;
}

export const VerificationForm = ({
  credentials,
  setCredentials,
  onBack,
}: VerificationFormProps) => {
  return (
    <section className="mb-6">
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="mr-3 p-2 rounded-full hover:bg-gray-800">
          <ChevronLeft className="w-5 h-5 text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold">Verification</h1>
      </div>

      <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-5 mb-5">
        <h3 className="font-semibold mb-3">Email Verification</h3>
        <p className="text-gray-400 text-sm mb-4">
          Enter the verification code sent to your registered email address.
        </p>

        <div>
          <Label htmlFor="twoFactorCode" className="text-gray-300">Verification Code</Label>
          <Input
            id="twoFactorCode"
            type="text"
            placeholder="Enter 6-digit code"
            className="mt-1 bg-gray-800/50 border-gray-700 text-gray-100"
            value={credentials.twoFactorCode}
            onChange={(e) => setCredentials({ ...credentials, twoFactorCode: e.target.value })}
          />
        </div>

        <button
          className="text-pink-500 text-sm mt-3 flex items-center"
          onClick={() => toast.info("New verification code sent to your email")}
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
};
