
import React from "react";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAccessItemProps {
  icon: LucideIcon;
  text: string;
  route: string;
  className?: string;
  onClick?: () => void;
}

const QuickAccessItem = ({ icon: Icon, text, route, className, onClick }: QuickAccessItemProps) => {
  return (
    <Link to={route} className={cn("block h-full", className)} onClick={onClick}>
      <div className="bg-charcoalSecondary rounded-2xl p-5 border border-gray-800/40 flex items-center hover:border-cyan/30 hover:bg-charcoalSecondary/90 transition-all h-full shadow-sm hover:shadow-md group">
        <div className="bg-charcoalPrimary/60 p-3 rounded-xl mr-4 flex-shrink-0 group-hover:bg-charcoalPrimary/80 transition-all">
          <Icon className="h-5 w-5 text-cyan" />
        </div>
        <span className="text-gray-200 font-medium text-base group-hover:text-white transition-colors">{text}</span>
      </div>
    </Link>
  );
};

export default QuickAccessItem;
