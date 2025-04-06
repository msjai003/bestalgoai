
import React, { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';
import { CompletedModules, Level } from '@/hooks/useEducation';

interface AiCoachTipProps {
  level: Level;
  completedModules: CompletedModules;
}

export const AiCoachTip: React.FC<AiCoachTipProps> = ({ level, completedModules }) => {
  const [tip, setTip] = useState<string>('');
  
  useEffect(() => {
    const generateTip = () => {
      // Getting completion percentage
      const getCompletionPercentage = (level: Level) => {
        switch (level) {
          case 'basics':
            return Math.round((completedModules.basics / 15) * 100);
          case 'intermediate':
            return Math.round((completedModules.intermediate / 15) * 100);
          case 'pro':
            return Math.round((completedModules.pro / 15) * 100);
          default:
            return 0;
        }
      };
      
      const currentPercentage = getCompletionPercentage(level);
      
      // Generate tips based on user progress
      if (level === 'basics') {
        if (currentPercentage === 0) {
          setTip("Welcome to Trading Academy! Start with the first module to begin your trading journey.");
        } else if (currentPercentage < 40) {
          setTip("Great start! Focus on understanding market terminology and basic concepts before moving forward.");
        } else if (currentPercentage < 70) {
          setTip("You're doing well in Basics! Consider exploring the Risk Management module next.");
        } else if (currentPercentage < 100) {
          setTip("Almost finished with Basics! After completing this level, you'll be ready for Intermediate concepts.");
        } else {
          setTip("Congratulations on completing Basics! Try Intermediate level to learn more advanced trading strategies.");
        }
      } else if (level === 'intermediate') {
        if (currentPercentage === 0) {
          setTip("Welcome to Intermediate level! Build on your basics with more advanced trading concepts.");
        } else if (currentPercentage < 40) {
          setTip("Technical analysis is key at this level. Focus on pattern recognition and indicator strategies.");
        } else if (currentPercentage < 70) {
          setTip("You're making great progress! Try applying these concepts in our Trading Simulator.");
        } else if (currentPercentage < 100) {
          setTip("Almost there! After this level, you'll be ready to explore algorithmic trading concepts.");
        } else {
          setTip("Impressive work completing the Intermediate level! You're ready for Pro-level algorithmic trading concepts.");
        }
      } else {
        if (currentPercentage === 0) {
          setTip("Welcome to Pro level! You'll learn advanced algorithmic trading strategies and automation.");
        } else if (currentPercentage < 40) {
          setTip("Focus on understanding how to translate trading strategies into algorithmic rules.");
        } else if (currentPercentage < 70) {
          setTip("Great progress! Consider exploring backtesting methodologies to validate your strategies.");
        } else if (currentPercentage < 100) {
          setTip("You're almost a trading master! The final modules will complete your algorithmic trading knowledge.");
        } else {
          setTip("Congratulations on completing all levels! You now have a comprehensive understanding of trading from basics to algorithmic strategies.");
        }
      }
    };
    
    generateTip();
  }, [level, completedModules]);
  
  if (!tip) return null;
  
  return (
    <div className="mb-6 animate-fadeIn">
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-cyan/20 rounded-xl p-4 shadow-lg">
        <div className="flex items-start">
          <div className="bg-gradient-to-br from-cyan to-blue-400 p-2 rounded-full mr-3 shrink-0">
            <Lightbulb className="h-5 w-5 text-charcoalPrimary" />
          </div>
          <div>
            <h3 className="text-cyan font-medium mb-1">Coach Tip</h3>
            <p className="text-gray-300 text-sm">{tip}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
