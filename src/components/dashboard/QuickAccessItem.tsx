
import React from "react";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface QuickAccessItemProps {
  icon: LucideIcon;
  text: string;
  route: string;
}

const QuickAccessItem = ({ icon: Icon, text, route }: QuickAccessItemProps) => {
  return (
    <Link to={route} className="block">
      <div className="bg-charcoalSecondary rounded-xl p-4 border border-gray-800/40 flex items-center hover:border-cyan/30 transition-all">
        <div className="bg-charcoalPrimary/60 p-2.5 rounded-lg mr-3">
          <Icon className="h-5 w-5 text-cyan" />
        </div>
        <span className="text-gray-200">{text}</span>
      </div>
    </Link>
  );
};

export default QuickAccessItem;
