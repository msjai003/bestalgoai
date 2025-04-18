
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

const BASE_URL = 'http://103.61.225.81:8000';

interface Question {
  id: string;
  question: string;
  options: string[] | string;
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

  useEffect(() => {
    axios.get(`${BASE_URL}/api/quiz/start`)
      .then((res) => {
        // Process questions to handle stringified JSON options
        const processedQuestions = res.data.map((q: Question) => ({
          ...q,
          options: typeof q.options === 'string'
            ? Object.values(JSON.parse(q.options))
            : q.options
        }));
        setQuestions(processedQuestions);
      })
      .catch((err) => {
        console.error("❌ Failed to load quiz:", err);
      });
  }, []);

  const handleSelect = async (option: string) => {
    setSelected(option);
    const q = questions[current];
    const res = await axios.post(`${BASE_URL}/api/quiz/analyze`, {
      user_id: 'demo_user',
      question: q.question,
      options: q.options,
      selected_answer: option,
      level: q.level,
    });
    setResult(res.data);
    setAnswers((prev) => [
      ...prev,
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
        .post(`${BASE_URL}/api/quiz/final_level`, {
          user_id: 'demo_user',
          level_signals,
        })
        .then((res) => {
          setFinalLevel(res.data.final_level);
          axios.post(`${BASE_URL}/api/quiz/save_result`, {
            user_id: 'demo_user',
            final_level: res.data.final_level,
            results: answers,
          });
        });
    }
  };

  if (finalLevel) {
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
  }

  if (questions.length === 0) {
    return (
      <Card className="glass-card p-8 text-center mt-10 max-w-xl mx-auto rounded-3xl">
        <p className="text-gray-400">Loading your assessment...</p>
      </Card>
    );
  }

  const currentQuestion = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <Card className="glass-card p-8 max-w-2xl mx-auto rounded-3xl">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">
            Question {current + 1} of {questions.length}
          </span>
          <span className="text-sm text-cyan">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2 w-full bg-[#121212] rounded-full" />
      </div>

      <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>
      
      <div className="space-y-3 mb-6">
        {Array.isArray(currentQuestion.options) && currentQuestion.options.map((opt, idx) => (
          <Button
            key={idx}
            variant="outline"
            className={`w-full justify-start rounded-full text-left p-4 transition-all duration-300 
              ${selected === opt && result?.is_correct 
                ? 'border-cyan bg-cyan/10 text-cyan' 
                : selected === opt && !result?.is_correct 
                ? 'border-red-500 bg-red-500/10 text-red-500' 
                : 'bg-[#121212] border-cyan/30 text-white hover:bg-cyan/10 hover:border-cyan'
              }`}
            onClick={() => handleSelect(opt)}
            disabled={selected !== null}
          >
            {selected === opt && (
              result?.is_correct ? 
                <CheckCircle2 className="h-5 w-5 mr-2 inline text-cyan" /> : 
                <XCircle className="h-5 w-5 mr-2 inline text-red-500" />
            )}
            {opt}
          </Button>
        ))}
      </div>

      {result && (
        <div className="mt-6 p-4 rounded-full bg-[#121212]/50 space-y-4">
          <p>
            <span className="font-semibold text-cyan">Explanation:</span>{' '}
            <span className="text-gray-300">{result.explanation}</span>
          </p>
          <p>
            <span className="font-semibold text-cyan">Example:</span>{' '}
            <span className="text-gray-300">{result.example}</span>
          </p>
        </div>
      )}

      {selected && (
        <div className="mt-6 text-right">
          <Button 
            onClick={handleNext}
            className="bg-cyan text-[#121212] hover:bg-cyan/90 rounded-full px-6"
          >
            {current < questions.length - 1 ? (
              <>
                Next Question
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              'Complete Quiz'
            )}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default SmartQuiz;
