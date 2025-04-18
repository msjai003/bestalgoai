
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { RefreshCw, GraduationCap, Award, Star, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface QuizResultsProps {
  correctAnswers: number;
  totalQuestions: number;
  onRestartQuiz: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  correctAnswers,
  totalQuestions,
  onRestartQuiz
}) => {
  const navigate = useNavigate();
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const isPassed = correctAnswers / totalQuestions >= 0.7;
  
  const getLevel = (score: number): { level: string; icon: React.ReactNode; color: string } => {
    if (score >= 90) return { level: 'Pro Trader', icon: <TrendingUp className="h-8 w-8" />, color: 'text-cyan' };
    if (score >= 70) return { level: 'Intermediate Trader', icon: <Star className="h-8 w-8" />, color: 'text-yellow-400' };
    return { level: 'Basic Trader', icon: <Award className="h-8 w-8" />, color: 'text-gray-400' };
  };

  const levelInfo = getLevel(percentage);
  
  const handleStartLearning = () => {
    navigate('/education');
  };

  return (
    <Card className="glass-card p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-6">Quiz Complete! 🎉</h2>
        
        <div className="mb-8">
          <div className="flex justify-center mb-4">{levelInfo.icon}</div>
          <div className={cn("text-4xl font-bold mb-2", levelInfo.color)}>
            {percentage}%
          </div>
          <div className={cn("text-xl font-medium mb-4", levelInfo.color)}>
            You are a {levelInfo.level}!
          </div>
          <p className="text-gray-300 text-sm">
            You scored {correctAnswers} out of {totalQuestions} questions correctly
          </p>
        </div>
        
        <div className="mb-8">
          <Progress 
            value={percentage} 
            className="h-2 w-full bg-[#121212]"
          />
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={handleStartLearning}
            className="w-full py-6 text-lg rounded-xl shadow-lg transition-all duration-300 hover:shadow-cyan/20 hover:scale-[1.02] bg-cyan text-[#121212]"
          >
            <GraduationCap className="mr-2 h-5 w-5" />
            Start Learning Modules
          </Button>
          
          <Button 
            onClick={onRestartQuiz}
            variant="outline"
            className="w-full py-6 text-lg"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Retake Quiz
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default QuizResults;
