
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, X } from 'lucide-react';

interface RegistrationHeaderProps {
  handleBack: () => void;
}

const RegistrationHeader: React.FC<RegistrationHeaderProps> = ({ handleBack }) => {
  return (
    <header className="flex items-center justify-between mb-8">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleBack}
        className="p-2 text-gray-400"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <div className="flex items-center">
        <i className="fa-solid fa-chart-line text-pink-500/80 text-2xl mr-2"></i>
        <span className="text-xl font-bold bg-gradient-to-r from-pink-500/90 to-purple-600/90 bg-clip-text text-transparent">
          BestAlgo.ai
        </span>
      </div>
      <Link to="/auth" className="p-2 text-gray-400">
        <X className="h-6 w-6" />
      </Link>
    </header>
  );
};

export default RegistrationHeader;
