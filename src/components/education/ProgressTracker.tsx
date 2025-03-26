
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Trophy, Star } from 'lucide-react';
import { Badge as BadgeType } from '@/hooks/useEducation';

interface ProgressTrackerProps {
  progress: {
    overall: number;
    basics: number;
    intermediate: number;
    pro: number;
  };
  earnedBadges: BadgeType[];
}

export const ProgressTracker = ({ progress, earnedBadges }: ProgressTrackerProps) => {
  return (
    <section className="mb-8">
      <div className="premium-card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Your Learning Progress</h3>
              <span className="text-sm text-cyan">{progress.overall}% Complete</span>
            </div>
            
            <div className="w-full bg-charcoalPrimary rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-cyan to-cyan/80 h-3 rounded-full"
                style={{ width: `${progress.overall}%` }}
              ></div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-300">Basics</span>
                  <span className="text-cyan">{progress.basics}%</span>
                </div>
                <div className="w-full bg-charcoalPrimary rounded-full h-1.5">
                  <div className="bg-cyan h-1.5 rounded-full" style={{ width: `${progress.basics}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-300">Intermediate</span>
                  <span className="text-cyan">{progress.intermediate}%</span>
                </div>
                <div className="w-full bg-charcoalPrimary rounded-full h-1.5">
                  <div className="bg-cyan h-1.5 rounded-full" style={{ width: `${progress.intermediate}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-300">Pro</span>
                  <span className="text-cyan">{progress.pro}%</span>
                </div>
                <div className="w-full bg-charcoalPrimary rounded-full h-1.5">
                  <div className="bg-cyan h-1.5 rounded-full" style={{ width: `${progress.pro}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t md:border-t-0 md:border-l border-white/10 pl-0 md:pl-6 pt-4 md:pt-0 flex-shrink-0">
            <div className="flex items-center mb-2">
              <Trophy className="h-4 w-4 text-cyan mr-2" />
              <h4 className="font-medium">Earned Badges</h4>
              <Badge variant="outline" className="ml-2">{earnedBadges.length}/9</Badge>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {earnedBadges.length > 0 ? (
                earnedBadges.slice(0, 5).map(badge => (
                  <div 
                    key={badge.id} 
                    className="w-8 h-8 flex items-center justify-center bg-cyan/10 rounded-full border border-cyan/30"
                    title={badge.name}
                  >
                    <span className="text-lg">{badge.image}</span>
                  </div>
                ))
              ) : (
                <span className="text-gray-400 text-sm">Complete modules to earn badges</span>
              )}
              
              {earnedBadges.length > 5 && (
                <div className="w-8 h-8 flex items-center justify-center bg-cyan/10 rounded-full border border-cyan/30">
                  <span className="text-xs text-cyan">+{earnedBadges.length - 5}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
