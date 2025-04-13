
import * as React from "react";
import { cn } from "@/lib/utils";

interface SegmentedControlProps {
  segments: Array<{
    label: string;
    value: string;
    icon?: React.ReactNode;
    count?: number;
  }>;
  value: string;
  onChange: (value: string) => void;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary";
  className?: string;
}

export const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  ({ segments, value, onChange, fullWidth = true, size = "md", variant = "primary", className }, ref) => {
    const containerClasses = cn(
      "flex rounded-2xl p-1.5 bg-charcoalSecondary/80 border border-gray-700/30 shadow-sm",
      {
        "w-full": fullWidth,
        "inline-flex": !fullWidth,
        "p-1": size === "sm",
        "p-1.5": size === "md",
        "p-2": size === "lg",
      },
      className
    );

    const getSegmentClasses = (segmentValue: string) => {
      const isActive = value === segmentValue;
      
      return cn(
        "flex items-center justify-center transition-all duration-300 ease-in-out",
        {
          // Size variants
          "text-xs py-1.5": size === "sm",
          "text-sm py-2": size === "md",
          "text-base py-2.5": size === "lg",
          
          // Width
          "flex-1": fullWidth,
          "px-3": !fullWidth && size === "sm",
          "px-4": !fullWidth && size === "md",
          "px-5": !fullWidth && size === "lg",
          
          // Active state - primary variant
          "bg-cyan text-charcoalPrimary font-medium rounded-xl shadow-md": 
            isActive && variant === "primary",
          
          // Active state - secondary variant
          "bg-gray-700/80 text-white font-medium rounded-xl shadow-md": 
            isActive && variant === "secondary",
          
          // Inactive state
          "text-gray-400 hover:text-white hover:bg-gray-700/40 rounded-xl": !isActive,
        }
      );
    };

    return (
      <div ref={ref} className={containerClasses}>
        {segments.map((segment) => (
          <button
            key={segment.value}
            className={getSegmentClasses(segment.value)}
            onClick={() => onChange(segment.value)}
            type="button"
          >
            {segment.icon && (
              <span className={`mr-1.5 ${value === segment.value ? "" : "text-gray-500"}`}>
                {segment.icon}
              </span>
            )}
            
            <span className="font-medium">{segment.label}</span>
            
            {segment.count !== undefined && (
              <span 
                className={cn(
                  "ml-1.5 px-1.5 py-0.5 rounded-full text-xs inline-flex items-center justify-center",
                  {
                    "bg-white/10 text-white": value === segment.value && variant === "primary",
                    "bg-cyan/20 text-cyan": value !== segment.value,
                  }
                )}
              >
                {segment.count}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }
);

SegmentedControl.displayName = "SegmentedControl";
