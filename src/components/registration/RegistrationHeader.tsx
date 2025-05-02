
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface RegistrationHeaderProps {
  handleBack: () => void;
}

const RegistrationHeader: React.FC<RegistrationHeaderProps> = ({ handleBack }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Button 
          onClick={handleBack}
          variant="outline"
          size="sm"
          className="border-gray-700 bg-charcoalSecondary text-white hover:bg-charcoalSecondary/90 hover:text-cyan hover:border-cyan/40"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span className="text-xs font-medium">Back</span>
        </Button>
        <Link to="/" className="flex items-center">
          <i className="fa-solid fa-chart-line text-cyan text-2xl"></i>
          <span className="text-white text-xl ml-2">BestAlgo.ai</span>
        </Link>
      </div>
      <Link to="/" className="text-gray-400">
        <X className="h-5 w-5" />
      </Link>
    </div>
  );
};

export default RegistrationHeader;
