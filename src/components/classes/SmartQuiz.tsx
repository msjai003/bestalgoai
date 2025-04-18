
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, RefreshCw, Award, Star, TrendingUp } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  level: string;
}

interface AnswerResult {
  is_correct: boolean;
  explanation: string;
  example: string;
  level_signal: string;
}

const SmartQuiz = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [finalLevel, setFinalLevel] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:8000/api/quiz/start').then((res) => {
      setQuestions(res.data);
    });
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      setProgress(((current + 1) / questions.length) * 100);
    }
  }, [current, questions.length]);

  const handleSelect = async (option: string) => {
    setSelected(option);
    const q = questions[current];
    const res = await axios.post('http://localhost:8000/api/quiz/analyze', {
      user_id: 'demo_user',
      question: q.question,
      options: q.options,
      selected_answer: option,
      level: q.level,
    });
    setResult(res.data);
    setAnswers([
      ...answers,
      {
        question: q.question,
        selected: option,
        ...res.data,
      },
    ]);
  };

  const handleNext = () => {
    setSelected(null);
    setResult(null);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      const level_signals = answers.map((a) => a.level_signal);
      axios
        .post('http://localhost:8000/api/quiz/final_level', {
          user_id: 'demo_user',
          level_signals,
        })
        .then((res) => {
          setFinalLevel(res.data.final_level);
          axios.post('http://localhost:8000/api/quiz/save_result', {
            user_id: 'demo_user',
            final_level: res.data.final_level,
            results: answers,
          });
        });
    }
  };

  const getLevel = (level: string): { icon: React.ReactNode; color: string } => {
    switch (level.toLowerCase()) {
      case 'pro':
        return { icon: <TrendingUp className="h-8 w-8" />, color: 'text-cyan' };
      case 'intermediate':
        return { icon: <Star className="h-8 w-8" />, color: 'text-yellow-400' };
      default:
        return { icon: <Award className="h-8 w-8" />, color: 'text-gray-400' };
    }
  };

  if (finalLevel) {
    const levelInfo = getLevel(finalLevel);
    return (
      <Card className="glass-card p-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">{levelInfo.icon}</div>
          <h2 className={`text-2xl font-bold mb-4 ${levelInfo.color}`}>
            You are a {finalLevel.toUpperCase()} Trader! 🎯
          </h2>
          <p className="text-gray-400 mb-8">Start your recommended learning modules now.</p>
          
          <div className="space-y-4">
            <Button 
              onClick={() => window.location.href = '/education'}
              className="w-full py-6 text-lg rounded-xl shadow-lg transition-all duration-300 hover:shadow-cyan/20 hover:scale-[1.02] bg-cyan text-[#121212]"
            >
              <GraduationCap className="mr-2 h-5 w-5" />
              Start Learning Modules
            </Button>
            
            <Button 
              onClick={() => window.location.reload()}
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
  }

  if (questions.length === 0) {
    return (
      <Card className="glass-card p-8">
        <p className="text-gray-400">Loading quiz...</p>
      </Card>
    );
  }

  const currentQuestion = questions[current];

  return (
    <Card className="glass-card p-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Question {current + 1} of {questions.length}</span>
          <span className="text-sm text-cyan">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2 w-full bg-[#121212]" />
      </div>

      <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>
      
      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((opt, idx) => (
          <Button
            key={idx}
            variant="outline"
            className="w-full justify-start rounded-xl text-left bg-charcoalSecondary border border-cyan/20 text-white hover:bg-cyan hover:text-charcoalPrimary transition-all duration-200"
            onClick={() => handleSelect(opt)}
            disabled={selected !== null}
          >
            {opt}
          </Button>
        ))}
      </div>

      {result && (
        <div className="mt-6 space-y-4 text-left bg-charcoalSecondary/50 p-4 rounded-xl">
          <p>
            <span className="text-cyan font-semibold">Explanation:</span>{' '}
            <span className="text-gray-300">{result.explanation}</span>
          </p>
          <p>
            <span className="text-cyan font-semibold">Example:</span>{' '}
            <span className="text-gray-300">{result.example}</span>
          </p>
        </div>
      )}

      {selected && (
        <div className="mt-6 flex justify-end">
          <Button 
            onClick={handleNext}
            className="bg-cyan text-charcoalPrimary hover:bg-cyan/90 transition-all duration-200"
          >
            {current === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default SmartQuiz;
