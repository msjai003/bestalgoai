
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Users, Crown, Award, ArrowRight, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LeaderboardProps {
  showSignupPrompt: boolean;
}

export const Leaderboard = ({ showSignupPrompt }: LeaderboardProps) => {
  // Mock leaderboard data for now
  const leaderboardData = [
    { rank: 1, name: "Alex J.", completedModules: 42, badges: 8 },
    { rank: 2, name: "Sophia T.", completedModules: 38, badges: 7 },
    { rank: 3, name: "Michael R.", completedModules: 35, badges: 6 },
    { rank: 4, name: "David W.", completedModules: 31, badges: 5 },
    { rank: 5, name: "Emma S.", completedModules: 28, badges: 5 }
  ];
  
  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <Trophy className="text-cyan mr-2 h-5 w-5" />
          Trading Academy Leaderboard
        </h2>
        
        <Button variant="ghost" size="sm" className="text-cyan hover:bg-cyan/10">
          View All
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
      
      <Card className="p-5 bg-charcoalSecondary border-gray-800/40">
        {showSignupPrompt ? (
          <div className="text-center py-6">
            <Users className="h-16 w-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-lg font-semibold mb-2">Join the Trading Community</h3>
            <p className="text-gray-400 mb-4 mx-auto max-w-md">
              Create an account to track your progress, earn badges, and compete on the leaderboard.
            </p>
            <Link to="/auth?signup=true">
              <Button className="bg-cyan text-charcoalPrimary hover:bg-cyan/90">
                <LogIn className="h-4 w-4 mr-2" />
                Sign Up Free
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-12 text-sm text-gray-400 pb-2 border-b border-gray-700/30 mb-3">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Trader</div>
              <div className="col-span-3 text-center">Modules</div>
              <div className="col-span-3 text-center">Badges</div>
            </div>
            
            {leaderboardData.map((user, index) => (
              <div 
                key={index} 
                className="grid grid-cols-12 items-center py-2 border-b border-gray-800/30 last:border-0 leaderboard-item"
                style={{ '--index': index } as React.CSSProperties}
              >
                <div className="col-span-1">
                  {user.rank === 1 ? (
                    <Crown className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <span className={user.rank <= 3 ? "text-cyan font-bold" : "text-gray-500"}>
                      {user.rank}
                    </span>
                  )}
                </div>
                
                <div className="col-span-5 font-medium">{user.name}</div>
                
                <div className="col-span-3 text-center flex justify-center">
                  <span className="bg-charcoalPrimary rounded-full px-3 py-0.5 text-xs flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1 text-cyan" />
                    {user.completedModules}
                  </span>
                </div>
                
                <div className="col-span-3 text-center flex justify-center">
                  <span className="bg-charcoalPrimary rounded-full px-3 py-0.5 text-xs flex items-center">
                    <Award className="h-3 w-3 mr-1 text-cyan" />
                    {user.badges}
                  </span>
                </div>
              </div>
            ))}
            
            <div className="mt-4 pt-3 border-t border-gray-700/30 text-center">
              <p className="text-sm text-gray-400">
                Complete more modules and quizzes to climb the leaderboard!
              </p>
            </div>
          </>
        )}
      </Card>
    </section>
  );
};
