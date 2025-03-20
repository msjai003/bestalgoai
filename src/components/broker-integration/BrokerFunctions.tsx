
import { useState } from "react";
import { useBrokerFunctions } from "@/hooks/useBrokerFunctions";
import { BrokerFunction } from "@/hooks/strategy/types";
import { CheckCircle, XCircle, LockClosed, Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BrokerFunctionsProps {
  brokerId: number;
  brokerName: string;
}

export const BrokerFunctions = ({ brokerId, brokerName }: BrokerFunctionsProps) => {
  const { functions, isLoading, error } = useBrokerFunctions(brokerId);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories from function slugs
  const categories = Array.from(new Set(functions.map(func => {
    // Extract category from slug (e.g., "order_placement" -> "order")
    return func.function_slug.split('_')[0];
  }))).sort();

  // Filter functions by selected category if any
  const filteredFunctions = selectedCategory 
    ? functions.filter(func => func.function_slug.startsWith(selectedCategory))
    : functions;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-t-2 border-pink-500 border-r-2 rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
        <p className="text-red-400">Failed to load broker functions. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Available Functions</h2>
      
      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          <Button
            size="sm"
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className="text-xs px-3 py-1 h-auto"
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              size="sm"
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="text-xs px-3 py-1 h-auto capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
      )}
      
      {filteredFunctions.length === 0 ? (
        <div className="text-center p-6 bg-gray-800/40 rounded-lg border border-gray-700">
          <p className="text-gray-400">No functions available for {brokerName}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredFunctions.map((func) => (
            <FunctionCard key={func.id} func={func} />
          ))}
        </div>
      )}
    </div>
  );
};

const FunctionCard = ({ func }: { func: BrokerFunction }) => {
  return (
    <div className="p-4 bg-gray-800/40 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-white">{func.function_name}</h3>
            {func.is_premium && (
              <Badge variant="outline" className="bg-amber-900/30 text-amber-400 border-amber-800 text-xs">
                Premium
              </Badge>
            )}
            {!func.function_enabled && (
              <Badge variant="outline" className="bg-gray-800 text-gray-400 border-gray-700 text-xs">
                Disabled
              </Badge>
            )}
          </div>
          {func.function_description && (
            <p className="text-sm text-gray-400 mt-1">{func.function_description}</p>
          )}
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="h-6 w-6 flex items-center justify-center">
                {func.function_enabled ? 
                  (func.is_premium ? 
                    <LockClosed className="h-5 w-5 text-amber-400" /> : 
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : 
                  <XCircle className="h-5 w-5 text-gray-500" />
                }
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {func.function_enabled ? 
                (func.is_premium ? 
                  "Premium feature - Requires subscription" : 
                  "Available"
                ) : 
                "Currently unavailable"
              }
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
