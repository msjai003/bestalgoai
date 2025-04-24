
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Award } from 'lucide-react';

interface QuizCompleteProps {
  finalLevel: string;
}

const QuizComplete: React.FC<QuizCompleteProps> = ({ finalLevel }) => {
  return (
    <Card className="glass-card p-8 text-center mt-10 max-w-xl mx-auto rounded-3xl">
      <div className="mb-6">
        <Award className="h-16 w-16 text-cyan mx-auto mb-4 animate-bounce" />
        <h2 className="text-3xl font-bold gradient-text mb-2">
          You are a {finalLevel.toUpperCase()} Trader! 🎯
        </h2>
        <p className="text-gray-400 mt-2">
          Ready to enhance your trading skills? Start your personalized learning journey now.
        </p>
      </div>
      <div className="space-y-4">
        <Button
          onClick={() => window.location.href = '/education'}
          className="w-full py-6 text-lg rounded-full shadow-lg transition-all duration-300 hover:shadow-cyan/20 hover:scale-[1.02] bg-cyan text-[#121212]"
        >
          Start Learning Modules
        </Button>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="w-full py-6 text-lg rounded-full border-cyan/30 hover:bg-cyan/10 hover:border-cyan"
        >
          Retake Quiz
        </Button>
      </div>
    </Card>
  );
};

export default QuizComplete;
