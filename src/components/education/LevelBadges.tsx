
import React from 'react';
import { Badge as BadgeType } from '@/hooks/useEducation';

interface LevelBadgesProps {
  level: 'basics' | 'intermediate' | 'pro';
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
            className="flex items-center bg-cyan/10 rounded-lg px-2 py-1 border border-cyan/20"
            title={badge.description}
          >
            <span className="text-lg mr-2">{badge.image}</span>
            <span className="text-xs text-cyan">{badge.name}</span>
          </div>
        ))
      ) : (
        <span className="text-gray-400 text-xs">Complete modules to earn badges</span>
      )}
    </div>
  );
};
