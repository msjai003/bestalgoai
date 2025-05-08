import { Search, ChevronRight, Check, AlertCircle, ImageOff } from "lucide-react";
import { useState, useEffect } from "react";
import { Broker } from "@/types/broker";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton"; 
import { getBrokerImageUrl, testImageUrl } from "@/utils/brokerImageUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface BrokerListProps {
  brokers: Broker[];
  onSelectBroker: (brokerId: number) => void;
  loading?: boolean;
}

export const BrokerList = ({ brokers, onSelectBroker, loading = false }: BrokerListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBrokers = brokers.filter((broker) =>
    broker.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <section className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Connect Your Broker</h1>
        <div className="relative">
          <Skeleton className="w-full h-12 rounded-xl" />
        </div>
        <div className="mt-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-full h-24 rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  return (
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
          filteredBrokers.map((broker) => (
            <BrokerCard 
              key={`${broker.id}-card`} 
              broker={broker} 
              onSelect={onSelectBroker} 
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No brokers found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </section>
  );
};

const BrokerCard = ({ broker, onSelect }: { broker: Broker, onSelect: (id: number) => void }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  useEffect(() => {
    const fetchBrokerImage = async () => {
      setIsLoading(true);
      setImageError(false);
      try {
        const timestamp = new Date().getTime();
        
        if (broker.id === 1) {
          const zerodhaImage = "/lovable-uploads/9de2890f-d6a8-443f-9e22-64a47566a9fa.png";
          console.log("Using direct Zerodha image:", zerodhaImage);
          setImageUrl(`${zerodhaImage}?_t=${timestamp}&retry=${retryCount}`);
          setIsLoading(false);
          return;
        }
        
        if (broker.id === 2) {
          const iciciDirectImage = "/lovable-uploads/b6f29d4f-ea6d-46c7-bfdd-f79050fc22cb.png";
          console.log("Using direct ICICI Direct image:", iciciDirectImage);
          setImageUrl(`${iciciDirectImage}?_t=${timestamp}&retry=${retryCount}`);
          setIsLoading(false);
          return;
        }
        
        if (broker.id === 3) {
          const angelOneImage = "/lovable-uploads/e4eaf527-5b68-4f06-99e7-5969dcfa6810.png";
          console.log("Using direct Angel One image:", angelOneImage);
          setImageUrl(`${angelOneImage}?_t=${timestamp}&retry=${retryCount}`);
          setIsLoading(false);
          return;
        }
        
        if (broker.id === 4) {
          const hdfcSecuritiesImage = "/lovable-uploads/22134556-ddbb-46aa-b837-cc1b1e3a6260.png";
          console.log("Using direct HDFC Securities image:", hdfcSecuritiesImage);
          setImageUrl(`${hdfcSecuritiesImage}?_t=${timestamp}&retry=${retryCount}`);
          setIsLoading(false);
          return;
        }
        
        if (broker.id === 6) {
          const growwImage = "/lovable-uploads/65c8e983-a72d-472b-9f46-caad015f5cf4.png";
          console.log("Using direct Groww image:", growwImage);
          setImageUrl(`${growwImage}?_t=${timestamp}&retry=${retryCount}`);
          setIsLoading(false);
          return;
        }
        
        if (broker.id === 7) {
          const fivePaisaImage = "/lovable-uploads/e24c22b3-8f90-4b78-8f3f-b0100b2654bc.png";
          console.log("Using direct 5 Paisa image:", fivePaisaImage);
          setImageUrl(`${fivePaisaImage}?_t=${timestamp}&retry=${retryCount}`);
          setIsLoading(false);
          return;
        }
        
        if (broker.id === 8) {
          const bigulImage = "/lovable-uploads/74071c2d-1d0d-4ad9-bad9-ce821097cc5c.png";
          console.log("Using direct Bigul image:", bigulImage);
          setImageUrl(`${bigulImage}?_t=${timestamp}&retry=${retryCount}`);
          setIsLoading(false);
          return;
        }
        
        if (broker.id === 9) {
          const aliceBlueImage = "/lovable-uploads/2567e0d9-3d2d-4f05-ad13-a6d081e8ae97.png";
          console.log("Using direct AliceBlue image:", aliceBlueImage);
          setImageUrl(`${aliceBlueImage}?_t=${timestamp}&retry=${retryCount}`);
          setIsLoading(false);
          return;
        }
        
        const img = await getBrokerImageUrl(broker.id);
        
        console.log(`Image URL result for broker ${broker.id} (${broker.name}):`, img);
        
        if (img) {
          const imgWithTimestamp = img.includes('?') 
            ? `${img}&_t=${timestamp}&retry=${retryCount}` 
            : `${img}?_t=${timestamp}&retry=${retryCount}`;
          
          console.log(`Using image URL with cache busting: ${imgWithTimestamp}`);
          
          if (broker.id === 1 || broker.name.toLowerCase().includes('zerodha')) {
            console.log("Zerodha broker image debug:", {
              originalUrl: img,
              withTimestamp: imgWithTimestamp,
              brokerId: broker.id,
              brokerName: broker.name
            });
            
            const isValid = await testImageUrl(img);
            if (!isValid) {
              console.warn(`Image URL for ${broker.name} failed validation test`);
              toast.warning(`Image for ${broker.name} may not display correctly`);
            }
          }
          
          setImageUrl(imgWithTimestamp);
        } else {
          console.log(`No image found in DB for broker ${broker.id}, using fallback:`, broker.logo);
          setImageUrl(broker.logo);
        }
      } catch (error) {
        console.error(`Error fetching broker image for ${broker.name}:`, error);
        setImageError(true);
        setImageUrl(broker.logo);
        
        if (broker.id === 1 || broker.name.toLowerCase().includes('zerodha') || 
            broker.id === 2 || broker.name.toLowerCase().includes('icici') ||
            broker.id === 3 || broker.name.toLowerCase().includes('angel') || 
            broker.id === 4 || broker.name.toLowerCase().includes('hdfc') ||
            broker.id === 6 || broker.name.toLowerCase().includes('groww') ||
            broker.id === 7 || broker.name.toLowerCase().includes('5 paisa') ||
            broker.id === 8 || broker.name.toLowerCase().includes('bigul') ||
            broker.id === 9 || broker.name.toLowerCase().includes('aliceblue')) {
          toast.error(`Failed to load ${broker.name} image, using fallback`);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBrokerImage();
  }, [broker.id, broker.logo, broker.name, retryCount]);
  
  const handleImageError = () => {
    console.log(`Image loading error for broker ${broker.id} (${broker.name}), falling back to placeholder`);
    setImageError(true);
    
    if ((broker.id === 1 || broker.name.toLowerCase().includes('zerodha') || 
         broker.id === 2 || broker.name.toLowerCase().includes('icici') ||
         broker.id === 3 || broker.name.toLowerCase().includes('angel') ||
         broker.id === 4 || broker.name.toLowerCase().includes('hdfc') ||
         broker.id === 6 || broker.name.toLowerCase().includes('groww') ||
         broker.id === 7 || broker.name.toLowerCase().includes('5 paisa') ||
         broker.id === 8 || broker.name.toLowerCase().includes('bigul') ||
         broker.id === 9 || broker.name.toLowerCase().includes('aliceblue')) && retryCount < 2) {
      console.log(`Retrying ${broker.name} image load, attempt ${retryCount + 1}`);
      setRetryCount(prev => prev + 1);
    } else if (retryCount >= 2) {
      toast.error(`Having trouble loading ${broker.name} image. This might be due to an issue with the image size or format.`);
    }
  };
  
  const fallbackInitial = broker.name ? broker.name.charAt(0).toUpperCase() : 'B';
  const hasRequiredInputs = broker.requiredInputs && broker.requiredInputs.length > 0;

  return (
    <div
      className="flex items-center p-4 bg-gray-800/30 rounded-xl border border-gray-700 cursor-pointer hover:border-pink-500 transition-colors"
      onClick={() => onSelect(broker.id)}
    >
      <Avatar className="w-10 h-10 rounded-lg overflow-hidden">
        {!isLoading && imageUrl && !imageError ? (
          <AvatarImage
            src={imageUrl}
            alt={broker.name}
            className="rounded-lg object-cover"
            onError={handleImageError}
            key={`${broker.id}-${retryCount}-${new Date().getTime()}`}
          />
        ) : null}
        <AvatarFallback className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center text-gray-300">
          {isLoading ? (
            <Skeleton className="w-8 h-8 rounded-lg" />
          ) : imageError ? (
            <ImageOff className="w-4 h-4 text-gray-400" />
          ) : (
            fallbackInitial
          )}
        </AvatarFallback>
      </Avatar>
      
      <div className="ml-3 flex-1">
        <h3 className="font-semibold">{broker.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          {hasRequiredInputs ? (
            <>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Check className="w-3 h-3 text-green-500" />
                <span>Authentication ready</span>
              </div>
              
              {broker.apiRequired && (
                <Badge variant="outline" className="text-xs bg-amber-900/30 text-amber-400 border-amber-800">
                  API Required
                </Badge>
              )}
            </>
          ) : (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <AlertCircle className="w-3 h-3 text-gray-500" />
              <span>No authentication configuration</span>
            </div>
          )}
        </div>
      </div>
      <ChevronRight className="ml-auto w-5 h-5 text-gray-500" />
    </div>
  );
};

export default BrokerList;
