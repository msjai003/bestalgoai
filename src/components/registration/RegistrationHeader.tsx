
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
        className="text-gray-400 transition-all duration-300 hover:text-white hover:scale-110"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <Link to="/" className="flex items-center group">
        <i className="fa-solid fa-chart-line text-[#FF00D4] text-2xl group-hover:animate-micro-bounce"></i>
        <span className="text-white text-xl ml-2 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#FF00D4] after:scale-x-0 after:origin-right after:transition-transform group-hover:after:scale-x-100 group-hover:after:origin-left">BestAlgo.ai</span>
      </Link>
      <Link to="/auth" className="text-gray-400 transition-all duration-300 hover:text-white hover:scale-110">
        <X className="h-5 w-5" />
      </Link>
    </header>
  );
};

export default RegistrationHeader;
