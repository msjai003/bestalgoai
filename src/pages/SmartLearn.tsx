
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SmartQuiz from '@/components/SmartQuiz';
import { GraduationCap } from 'lucide-react';

const SmartLearn = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-charcoalPrimary text-white px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <Card className="rounded-3xl p-8 mb-10 shadow-xl bg-[#1F1F1F]/80">
          <div className="text-center">
            <GraduationCap className="mx-auto mb-4 h-10 w-10 text-cyan" />
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Trading Level Assessment
            </h1>
            <p className="text-gray-400">
              Let's identify your trading expertise with this smart quiz powered by AI
            </p>
          </div>
        </Card>

        {/* SmartQuiz Component Handles Full Logic */}
        <SmartQuiz />

        <div className="text-center mt-12 text-xs text-gray-500">
          Powered by BestAlgo.ai GPT Assistant ⚡
        </div>
      </div>
    </div>
  );
};

export default SmartLearn;
