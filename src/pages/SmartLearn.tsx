
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProQuiz from '@/components/classes/ProQuiz';
import { Button } from '@/components/ui/button';
import { GraduationCap, RefreshCw } from 'lucide-react';

const SmartLearn = () => {
  const navigate = useNavigate();
  
  const handleStartLearning = () => {
    navigate('/education');
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-charcoalPrimary">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4 gradient-text">Trading Level Assessment</h1>
          <p className="text-gray-400">
            Let's identify your trading expertise with this smart quiz powered by AI
          </p>
        </div>
        
        <ProQuiz />
      </div>
    </div>
  );
};

export default SmartLearn;
