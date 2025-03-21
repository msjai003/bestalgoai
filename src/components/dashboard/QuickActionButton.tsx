
import React from "react";

interface QuickActionButtonProps {
  icon?: string;
  label: string;
  lucideIcon?: React.ReactNode;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ 
  icon, 
  label, 
  lucideIcon 
}) => (
  <div className="flex flex-col items-center bg-gray-800/30 rounded-xl p-3">
    {lucideIcon || <i className={`fa-solid ${icon} text-[#FF00D4] text-xl mb-2`}></i>}
    <span className="text-gray-300 text-xs">{label}</span>
  </div>
);

export default QuickActionButton;
