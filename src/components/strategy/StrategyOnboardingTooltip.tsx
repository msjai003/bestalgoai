
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OnboardingTooltipProps {
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  targetSelector?: string;
  onDismiss?: () => void;
}

export const OnboardingTooltip: React.FC<OnboardingTooltipProps> = ({
  title,
  content,
  position = 'bottom',
  targetSelector,
  onDismiss
}) => {
  const [visible, setVisible] = useState(true);
  const [coordinates, setCoordinates] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (targetSelector) {
      const targetElement = document.querySelector(targetSelector);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        let top = 0;
        let left = 0;
        
        switch (position) {
          case 'top':
            top = rect.top - 10;
            left = rect.left + rect.width / 2;
            break;
          case 'bottom':
            top = rect.bottom + 10;
            left = rect.left + rect.width / 2;
            break;
          case 'left':
            top = rect.top + rect.height / 2;
            left = rect.left - 10;
            break;
          case 'right':
            top = rect.top + rect.height / 2;
            left = rect.right + 10;
            break;
        }
        
        setCoordinates({ top, left });
      }
    }
  }, [targetSelector, position]);

  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) onDismiss();
  };

  if (!visible) return null;

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full mb-2 left-1/2 transform -translate-x-1/2';
      case 'bottom':
        return 'top-full mt-2 left-1/2 transform -translate-x-1/2';
      case 'left':
        return 'right-full mr-2 top-1/2 transform -translate-y-1/2';
      case 'right':
        return 'left-full ml-2 top-1/2 transform -translate-y-1/2';
      default:
        return 'top-full mt-2';
    }
  };

  return (
    <div 
      className={`absolute z-50 w-64 glass-card bg-charcoalSecondary/95 border border-cyan/20 rounded-xl shadow-xl p-4 ${
        targetSelector ? getPositionClasses() : ''
      }`}
      style={targetSelector ? {} : {
        top: coordinates.top,
        left: coordinates.left
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-white font-medium text-sm">{title}</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0 text-gray-400 hover:text-white"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-gray-300">{content}</p>
      <div className="mt-3 flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs h-7 bg-cyan/10 border-cyan/20 text-cyan hover:bg-cyan/20"
          onClick={handleDismiss}
        >
          Got it
        </Button>
      </div>
    </div>
  );
};
