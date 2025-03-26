
import React from 'react';
import { Badge as BadgeType, Level } from '@/hooks/useEducation';

interface LevelBadgesProps {
  level: Level;
  earnedBadges: BadgeType[];
}

export const LevelBadges = ({ level, earnedBadges }: LevelBadgesProps) => {
  const levelBadges = earnedBadges.filter(badge => badge.level === level);
  
  return (
    <div className="flex flex-wrap gap-3">
      {levelBadges.length > 0 ? (
        levelBadges.map(badge => (
          <div 
            key={badge.id} 
            className="flex items-center gap-2 bg-cyan/10 px-3 py-1.5 rounded-full border border-cyan/20"
          >
            <span className="text-lg">{badge.image}</span>
            <span className="text-sm font-medium text-white">{badge.name}</span>
          </div>
        ))
      ) : (
        <div className="text-sm text-gray-400">Complete modules to earn badges</div>
      )}
    </div>
  );
};
