
import React from 'react';
import { Card } from '@/components/ui/card';
import SmartQuiz from '@/components/classes/SmartQuiz';
import { Award } from 'lucide-react';

const SmartLearn = () => {
  return (
    <div className="min-h-screen bg-charcoalPrimary px-4 py-10 text-white">
      <div className="max-w-3xl mx-auto">
        <Card className="glass-card p-8 rounded-3xl shadow-xl mb-8 text-center">
          <Award className="w-12 h-12 mx-auto text-cyan mb-2" />
          <h1 className="text-3xl font-bold gradient-text mb-1">Trading Level Assessment</h1>
          <p className="text-gray-400 text-sm">
            Let's identify your trading expertise with this smart quiz powered by AI
          </p>
        </Card>

        <SmartQuiz />
      </div>
    </div>
  );
};

export default SmartLearn;
