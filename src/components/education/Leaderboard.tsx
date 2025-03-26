
import React from 'react';
import { Users, Award, Share } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LevelBadges } from './LevelBadges';
import { Badge as BadgeType } from '@/hooks/useEducation';

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  badgeCount: number;
  completedModules: number;
  earnedBadges: BadgeType[];
}

// Mock data - in a real app this would come from the database
const topUsers: LeaderboardUser[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    avatar: '👨‍💼',
    badgeCount: 7,
    completedModules: 29,
    earnedBadges: [
      { id: 'basics-starter', name: 'Trading Novice', description: 'Completed first basic module', image: '🏆', level: 'basics', unlocked: true },
      { id: 'basics-half', name: 'Trading Enthusiast', description: 'Completed 50% of basics', image: '🥈', level: 'basics', unlocked: true },
      { id: 'basics-complete', name: 'Trading Graduate', description: 'Completed all basic modules', image: '🎓', level: 'basics', unlocked: true },
      { id: 'intermediate-starter', name: 'Market Analyst', description: 'Completed first intermediate module', image: '📊', level: 'intermediate', unlocked: true },
      { id: 'intermediate-half', name: 'Technical Trader', description: 'Completed 50% of intermediate', image: '📈', level: 'intermediate', unlocked: true },
      { id: 'intermediate-complete', name: 'Trading Strategist', description: 'Completed all intermediate modules', image: '🏅', level: 'intermediate', unlocked: true },
      { id: 'pro-starter', name: 'Algo Initiate', description: 'Completed first pro module', image: '🤖', level: 'pro', unlocked: true },
    ]
  },
  {
    id: '2',
    name: 'Samantha Lee',
    avatar: '👩‍💻',
    badgeCount: 5,
    completedModules: 23,
    earnedBadges: [
      { id: 'basics-starter', name: 'Trading Novice', description: 'Completed first basic module', image: '🏆', level: 'basics', unlocked: true },
      { id: 'basics-half', name: 'Trading Enthusiast', description: 'Completed 50% of basics', image: '🥈', level: 'basics', unlocked: true },
      { id: 'basics-complete', name: 'Trading Graduate', description: 'Completed all basic modules', image: '🎓', level: 'basics', unlocked: true },
      { id: 'intermediate-starter', name: 'Market Analyst', description: 'Completed first intermediate module', image: '📊', level: 'intermediate', unlocked: true },
      { id: 'intermediate-half', name: 'Technical Trader', description: 'Completed 50% of intermediate', image: '📈', level: 'intermediate', unlocked: true },
    ]
  },
  {
    id: '3',
    name: 'Michael Zhang',
    avatar: '👨‍🚀',
    badgeCount: 4,
    completedModules: 18,
    earnedBadges: [
      { id: 'basics-starter', name: 'Trading Novice', description: 'Completed first basic module', image: '🏆', level: 'basics', unlocked: true },
      { id: 'basics-half', name: 'Trading Enthusiast', description: 'Completed 50% of basics', image: '🥈', level: 'basics', unlocked: true },
      { id: 'basics-complete', name: 'Trading Graduate', description: 'Completed all basic modules', image: '🎓', level: 'basics', unlocked: true },
      { id: 'intermediate-starter', name: 'Market Analyst', description: 'Completed first intermediate module', image: '📊', level: 'intermediate', unlocked: true },
    ]
  }
];

export const Leaderboard = () => {
  const handleInviteFriends = () => {
    const inviteText = "Join me on Trading Academy to learn trading from basics to pro! Check it out:";
    
    if (navigator.share) {
      navigator.share({
        title: 'Join Trading Academy',
        text: inviteText,
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      navigator.clipboard.writeText(`${inviteText} ${window.location.href}`);
    }
  };
  
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-cyan" />
          <h2 className="text-xl font-bold">Top Learners</h2>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs border-cyan/40 text-cyan hover:bg-cyan/10"
          onClick={handleInviteFriends}
        >
          <Share className="h-3.5 w-3.5 mr-1" />
          Invite Friends
        </Button>
      </div>
      
      <div className="premium-card p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-3">
          {topUsers.map((user, index) => (
            <div key={user.id} className="flex flex-col bg-charcoalSecondary/60 rounded-xl p-4 border border-cyan/10 hover:border-cyan/30 transition-colors">
              {/* User info */}
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-cyan/10 flex items-center justify-center text-xl border border-cyan/20">
                  {user.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{user.name}</span>
                    {index === 0 && (
                      <Badge variant="default" className="h-5 flex items-center gap-1">
                        <Award className="h-3 w-3" /> Top Learner
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-2">
                    <span>{user.completedModules} modules completed</span>
                    <span>•</span>
                    <span>{user.badgeCount} badges</span>
                  </div>
                </div>
              </div>
              
              {/* User badges */}
              <div className="mt-2">
                <h4 className="text-xs uppercase text-gray-400 mb-2">Recent Achievements</h4>
                <div className="flex flex-wrap gap-1">
                  {user.earnedBadges.slice(-3).map(badge => (
                    <div 
                      key={badge.id}
                      className="w-8 h-8 flex items-center justify-center bg-cyan/10 rounded-full border border-cyan/20"
                      title={badge.name}
                    >
                      {badge.image}
                    </div>
                  ))}
                  {user.earnedBadges.length > 3 && (
                    <div className="w-8 h-8 flex items-center justify-center bg-charcoalPrimary rounded-full border border-cyan/10">
                      <span className="text-xs">+{user.earnedBadges.length - 3}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <Button variant="outline" className="text-sm">
            View Full Leaderboard
          </Button>
        </div>
      </div>
    </div>
  );
};
