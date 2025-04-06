
import React from 'react';
import { GraduationCap, Sun, Moon, LogIn, CheckCircle, Trophy, Award, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

interface AcademyHeaderProps {
  stats: {
    completedCount: number;
    totalModules: number;
    quizzesTaken: number;
    badgesEarned: number;
    averageScore: number;
  };
}

export const AcademyHeader: React.FC<AcademyHeaderProps> = ({ stats }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useAuth();
  
  return (
    <section className="py-8 mb-6">
      <div className={`${isDarkMode ? 'bg-charcoalSecondary' : 'bg-white'} rounded-xl border ${isDarkMode ? 'border-gray-800/40' : 'border-gray-200'} p-6 shadow-lg transition-all duration-300`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <GraduationCap className={`${isDarkMode ? 'text-cyan' : 'text-blue-500'} mr-2 h-6 w-6`} />
            <h2 className={`${isDarkMode ? 'text-cyan' : 'text-blue-500'} text-xl font-bold`}>Trading Academy</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className={`${isDarkMode ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'} hover:bg-gray-800/10`}
              onClick={toggleTheme}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            {!user && (
              <Link to="/auth">
                <Button variant="outline" size="sm" className={`${isDarkMode ? 'border-cyan/30 text-cyan hover:bg-cyan/10' : 'border-blue-300 text-blue-500 hover:bg-blue-50'}`}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-3">
          <span className={isDarkMode ? 'text-cyan' : 'text-blue-500'}>Master Trading</span> from Basics to Pro
        </h1>
        
        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
          Interactive flashcards, quizzes, and AI-personalized learning paths to become a confident trader
        </p>
        
        {user ? (
          <div className="flex flex-wrap gap-4 mt-5">
            <div className={`${isDarkMode ? 'bg-charcoalPrimary' : 'bg-gray-50'} rounded-lg px-4 py-2 flex items-center shadow-sm`}>
              <CheckCircle className={`${isDarkMode ? 'text-cyan' : 'text-blue-500'} h-4 w-4 mr-2`} />
              <span className="text-sm">{stats.completedCount}/{stats.totalModules} Modules</span>
            </div>
            
            <div className={`${isDarkMode ? 'bg-charcoalPrimary' : 'bg-gray-50'} rounded-lg px-4 py-2 flex items-center shadow-sm`}>
              <Trophy className={`${isDarkMode ? 'text-cyan' : 'text-blue-500'} h-4 w-4 mr-2`} />
              <span className="text-sm">{stats.quizzesTaken} Quizzes</span>
            </div>
            
            <div className={`${isDarkMode ? 'bg-charcoalPrimary' : 'bg-gray-50'} rounded-lg px-4 py-2 flex items-center shadow-sm`}>
              <Award className={`${isDarkMode ? 'text-cyan' : 'text-blue-500'} h-4 w-4 mr-2`} />
              <span className="text-sm">{stats.badgesEarned} Badges</span>
            </div>
            
            {stats.averageScore > 0 && (
              <div className={`${isDarkMode ? 'bg-charcoalPrimary' : 'bg-gray-50'} rounded-lg px-4 py-2 flex items-center shadow-sm`}>
                <Brain className={`${isDarkMode ? 'text-cyan' : 'text-blue-500'} h-4 w-4 mr-2`} />
                <span className="text-sm">{stats.averageScore}% Score</span>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/auth?signup=true">
              <Button className={isDarkMode ? 'bg-cyan text-charcoalPrimary hover:bg-cyan/90' : 'bg-blue-500 text-white hover:bg-blue-600'}>
                Create Free Account
              </Button>
            </Link>
            <Button variant="outline" className={isDarkMode ? 'border-white/20' : 'border-gray-300'}>
              Explore Modules
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
