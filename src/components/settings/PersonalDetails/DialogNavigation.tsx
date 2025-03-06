
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DialogNavigationProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export const DialogNavigation = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
}: DialogNavigationProps) => {
  return (
    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
      <Button 
        onClick={onPrevPage} 
        disabled={currentPage === 1}
        variant="ghost" 
        className={`px-3 ${currentPage === 1 ? 'invisible' : ''}`}
      >
        <ChevronLeft className="h-4 w-4 mr-1" /> Previous
      </Button>
      
      <div className="flex gap-1">
        {Array.from({length: totalPages}).map((_, i) => (
          <div 
            key={i} 
            className={`w-2 h-2 rounded-full ${currentPage === i+1 ? 'bg-pink-500' : 'bg-gray-600'}`}
          />
        ))}
      </div>
      
      <Button 
        onClick={onNextPage} 
        disabled={currentPage === totalPages}
        variant="ghost" 
        className={`px-3 ${currentPage === totalPages ? 'invisible' : ''}`}
      >
        Next <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
};
