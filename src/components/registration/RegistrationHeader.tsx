
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, X } from 'lucide-react';

interface RegistrationHeaderProps {
  handleBack: () => void;
}

const RegistrationHeader: React.FC<RegistrationHeaderProps> = ({ handleBack }) => {
  return (
    <header className="flex items-center justify-between mb-8">
      <button 
        onClick={handleBack}
        className="text-gray-400"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <Link to="/" className="flex items-center">
        <i className="fa-solid fa-chart-line text-[#FF00D4] text-2xl"></i>
        <span className="text-white text-xl ml-2">BestAlgo.ai</span>
      </Link>
      <Link to="/auth" className="text-gray-400">
        <X className="h-5 w-5" />
      </Link>
    </header>
  );
};

export default RegistrationHeader;
