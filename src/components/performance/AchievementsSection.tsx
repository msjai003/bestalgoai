
import React from 'react';
import { Award, Crown, TrendingUp } from 'lucide-react';

export const AchievementsSection = () => {
  const achievements = [
    { 
      id: 1, 
      name: 'Risk Master', 
      icon: <Crown className="text-2xl text-purple-400" />, 
      bgColor: 'bg-purple-500/20' 
    },
    { 
      id: 2, 
      name: 'Backtest Pro', 
      icon: <TrendingUp className="text-2xl text-blue-400" />, 
      bgColor: 'bg-blue-500/20' 
    },
    { 
      id: 3, 
      name: 'Market Wizard', 
      icon: <Award className="text-2xl text-green-400" />, 
      bgColor: 'bg-green-500/20' 
    }
  ];

  return (
    <section className="rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-4 border border-gray-800">
      <h2 className="text-lg font-bold mb-4">Recent Achievements</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="flex-shrink-0 w-20 text-center">
            <div className={`w-16 h-16 rounded-full ${achievement.bgColor} flex items-center justify-center mx-auto mb-2`}>
              {achievement.icon}
            </div>
            <div className="text-xs">{achievement.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
