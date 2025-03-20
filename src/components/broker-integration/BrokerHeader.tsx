
import { Button } from "@/components/ui/button";
import { ChevronLeft, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getBrokerLogo } from "@/utils/brokerImageUtils";

interface BrokerHeaderProps {
  onBack: () => void;
  title: string;
  brokerId?: number;
  brokerName?: string;
}

export const BrokerHeader = ({ 
  onBack, 
  title,
  brokerId,
  brokerName
}: BrokerHeaderProps) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  
  useEffect(() => {
    if (brokerId) {
      const fetchLogo = async () => {
        const url = await getBrokerLogo(brokerId);
        setLogoUrl(url);
      };
      
      fetchLogo();
    }
  }, [brokerId]);

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 z-50">
      <div className="flex items-center justify-between px-4 h-16">
        <Button 
          variant="ghost" 
          className="p-2"
          onClick={onBack}
        >
          <ChevronLeft className="w-5 h-5 text-gray-300" />
        </Button>
        <div className="flex items-center">
          {logoUrl && brokerId && (
            <img 
              src={logoUrl} 
              alt={brokerName || "Broker logo"} 
              className="w-6 h-6 mr-2 rounded bg-white p-0.5 object-contain"
            />
          )}
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        <Button variant="ghost" className="p-2">
          <HelpCircle className="w-5 h-5 text-gray-300" />
        </Button>
      </div>
    </header>
  );
};
